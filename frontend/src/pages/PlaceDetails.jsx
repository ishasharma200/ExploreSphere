import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addReview, deleteReview, getAverageRating, getReviews, updateReview } from '../api/reviewApi';
import { deletePlace, getPlaceById, updatePlace } from '../api/placeApi';
import { useAuth } from '../hooks/useAuth';
import ReviewCard from '../components/ReviewCard';
import ImageUploadInput from '../components/ImageUploadInput';
import LiveFeed from '../components/LiveFeed';
import socket from '../realtime/socket';
import { getErrorMessage } from '../utils/getErrorMessage';
import { validateReviewForm } from '../utils/formValidation';

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState('');
  const [editingImages, setEditingImages] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  const [viewersCount, setViewersCount] = useState(0);
  const [socketStatus, setSocketStatus] = useState(socket.connected ? 'connected' : 'connecting');

  const refreshRatings = async () => {
    const ratingData = await getAverageRating(id);
    setRating(ratingData.average);
  };

  const loadPage = async () => {
    setPageLoading(true);
    try {
      const [placeData, reviewData, ratingData] = await Promise.all([
        getPlaceById(id),
        getReviews(id),
        getAverageRating(id),
      ]);
      setPlace(placeData);
      setReviews(reviewData);
      setRating(ratingData.average);
    } catch (error) {
      console.error('Failed to load place details');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [id]);

  useEffect(() => {
    const addLiveEvent = (title, detail) => {
      setLiveEvents((currentEvents) => [{ id: `${Date.now()}-${Math.random()}`, title, detail }, ...currentEvents].slice(0, 4));
    };

    const handleConnect = () => setSocketStatus('connected');
    const handleDisconnect = () => setSocketStatus('disconnected');

    const handleViewerUpdate = ({ placeId, viewers }) => {
      if (String(placeId) === String(id)) {
        setViewersCount(viewers);
      }
    };

    const handleReviewCreated = (newReview) => {
      if (String(newReview.place) !== String(id)) {
        return;
      }

      setReviews((currentReviews) => {
        if (currentReviews.some((review) => review._id === newReview._id)) {
          return currentReviews;
        }
        return [newReview, ...currentReviews];
      });

      addLiveEvent('New review posted', `${newReview.user?.name || 'A visitor'} added a review.`);

      refreshRatings().catch(() => console.error('Failed to refresh rating'));
    };

    const handleReviewUpdated = (updatedReview) => {
      if (String(updatedReview.place) !== String(id)) {
        return;
      }

      setReviews((currentReviews) =>
        currentReviews.map((review) => (review._id === updatedReview._id ? updatedReview : review))
      );
      addLiveEvent('Review updated', `${updatedReview.user?.name || 'A visitor'} edited a review.`);
      refreshRatings().catch(() => console.error('Failed to refresh rating'));
    };

    const handleReviewDeleted = ({ id: reviewId }) => {
      setReviews((currentReviews) => currentReviews.filter((review) => review._id !== reviewId));
      addLiveEvent('Review removed', 'A review was deleted from this place.');
      refreshRatings().catch(() => console.error('Failed to refresh rating'));
    };

    const handlePlaceUpdated = (updatedPlace) => {
      if (String(updatedPlace._id) !== String(id)) {
        return;
      }
      setPlace(updatedPlace);
      addLiveEvent('Place updated', 'The place details were changed in realtime.');
    };

    const handlePlaceDeleted = ({ id: deletedPlaceId }) => {
      if (String(deletedPlaceId) === String(id)) {
        navigate('/browse', { replace: true });
      }
    };

    socket.emit('join:place', id);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('place:viewers', handleViewerUpdate);
    socket.on('review:created', handleReviewCreated);
    socket.on('review:updated', handleReviewUpdated);
    socket.on('review:deleted', handleReviewDeleted);
    socket.on('place:updated', handlePlaceUpdated);
    socket.on('place:deleted', handlePlaceDeleted);

    return () => {
      socket.emit('leave:place', id);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('place:viewers', handleViewerUpdate);
      socket.off('review:created', handleReviewCreated);
      socket.off('review:updated', handleReviewUpdated);
      socket.off('review:deleted', handleReviewDeleted);
      socket.off('place:updated', handlePlaceUpdated);
      socket.off('place:deleted', handlePlaceDeleted);
    };
  }, [id, navigate]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!auth.isAuthenticated) {
      alert('Please login to add a review');
      return;
    }

    const validationError = validateReviewForm(form);
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    try {
      const newReview = await addReview(id, form.rating, form.comment, auth.token);
      setReviews((currentReviews) => {
        if (currentReviews.some((review) => review._id === newReview._id)) {
          return currentReviews;
        }
        return [newReview, ...currentReviews];
      });
      setForm({ rating: 5, comment: '' });
      await refreshRatings();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to add review'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReview = async (review) => {
    const nextRating = window.prompt('Update rating (1-5)', String(review.rating));
    if (nextRating === null) {
      return;
    }

    const parsedRating = Number(nextRating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      alert('Rating must be between 1 and 5');
      return;
    }

    const nextComment = window.prompt('Update comment', review.comment || '');
    if (nextComment === null) {
      return;
    }

    setActionLoadingId(review._id);
    try {
      const updatedReview = await updateReview(review._id, { rating: parsedRating, comment: nextComment }, auth.token);
      setReviews((currentReviews) =>
        currentReviews.map((item) => (item._id === updatedReview._id ? updatedReview : item))
      );
      await refreshRatings();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to update review'));
    } finally {
      setActionLoadingId('');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) {
      return;
    }

    setActionLoadingId(reviewId);
    try {
      await deleteReview(reviewId, auth.token);
      setReviews((currentReviews) => currentReviews.filter((review) => review._id !== reviewId));
      await refreshRatings();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to delete review'));
    } finally {
      setActionLoadingId('');
    }
  };

  const handleDeletePlace = async () => {
    if (!window.confirm('Delete this place? This will also remove its reviews.')) {
      return;
    }

    setActionLoadingId('place');
    try {
      await deletePlace(id, auth.token);
      navigate('/browse', { replace: true });
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to delete place'));
    } finally {
      setActionLoadingId('');
    }
  };

  const handleSaveImages = async (images) => {
    setActionLoadingId('images');
    try {
      const updated = await updatePlace(id, { images }, auth.token);
      setPlace(updated);
      setEditingImages(false);
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to update images'));
    } finally {
      setActionLoadingId('');
    }
  };

  const isOwner = auth.user?.id && String(place?.createdBy?._id || '') === String(auth.user.id);

  return (
    <div className="page-shell">
      <div className="details-panel" style={{ padding: '24px' }}>
        {pageLoading ? (
          <p className="muted" style={{ margin: 0 }}>Loading place details...</p>
        ) : (
          <>
            {!editingImages && place?.images && place.images.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {place.images.map((url, index) => (
                    <div key={index} style={{ borderRadius: '12px', overflow: 'hidden', background: '#f0f0f0', height: '200px' }}>
                      <img src={url} alt={`${place.name}-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
                {isOwner && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingImages(true)}
                    style={{ marginTop: '12px' }}
                  >
                    Edit images
                  </button>
                )}
              </div>
            )}

            {editingImages && isOwner && (
              <div style={{ marginBottom: '22px', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'rgba(37, 99, 235, 0.03)' }}>
                <ImageUploadInput
                  currentImages={place?.images || []}
                  onImagesChange={() => {}}
                  maxImages={5}
                />
                <div className="nav-actions" style={{ marginTop: '12px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const input = document.querySelector('input[type="file"]');
                      if (input && input.files.length > 0) {
                        // Images are already being uploaded by ImageUploadInput component
                        const newImages = place?.images || [];
                        handleSaveImages(newImages);
                      } else {
                        // Just update with current images
                        handleSaveImages(place?.images || []);
                      }
                    }}
                    disabled={actionLoadingId === 'images'}
                  >
                    {actionLoadingId === 'images' ? 'Saving...' : 'Save images'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingImages(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="hero-grid">
              <div className="stack">
                <div>
                  <span className="section-badge">Place details</span>
                  <h1 className="section-title" style={{ marginBottom: '10px' }}>{place?.name || 'Place details'}</h1>
                  <p className="section-copy">{place?.description || 'A community place page with reviews and ratings.'}</p>
                </div>

                <div className="grid-list" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                  <div className="card" style={{ padding: '16px' }}>
                    <div className="muted" style={{ fontSize: '0.9rem' }}>Location</div>
                    <strong>{place?.location || 'Unknown'}</strong>
                  </div>
                  <div className="card" style={{ padding: '16px' }}>
                    <div className="muted" style={{ fontSize: '0.9rem' }}>Category</div>
                    <strong>{place?.category || 'Uncategorized'}</strong>
                  </div>
                  <div className="card" style={{ padding: '16px' }}>
                    <div className="muted" style={{ fontSize: '0.9rem' }}>Average rating</div>
                    <strong>⭐ {rating}</strong>
                  </div>
                  <div className="card" style={{ padding: '16px' }}>
                    <div className="muted" style={{ fontSize: '0.9rem' }}>Posted by</div>
                    <strong>{place?.createdBy?.name || 'Community user'}</strong>
                  </div>
                  <div className="card" style={{ padding: '16px' }}>
                    <div className="muted" style={{ fontSize: '0.9rem' }}>Live viewers</div>
                    <strong>{viewersCount}</strong>
                  </div>
                </div>

                <div className="card" style={{ padding: '16px', background: 'rgba(37, 99, 235, 0.04)' }}>
                  <div className="muted" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>Socket status</div>
                  <strong style={{ textTransform: 'capitalize' }}>{socketStatus}</strong>
                </div>

                <LiveFeed
                  title="Live place activity"
                  subtitle="Reviews and edits arrive instantly while this page is open"
                  items={liveEvents}
                  emptyText="Live activity will appear here as people review or edit the place."
                />

                {isOwner && (
                  <div className="nav-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleDeletePlace}
                      disabled={actionLoadingId === 'place'}
                    >
                      {actionLoadingId === 'place' ? 'Deleting...' : 'Delete place'}
                    </button>
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: '18px' }}>
                <h3 style={{ marginTop: 0 }}>Add a review</h3>
                {auth.isAuthenticated ? (
                  <form onSubmit={handleSubmitReview} className="form-grid">
                    <div>
                      <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Rating</label>
                      <select
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value, 10) })}
                        className="select"
                      >
                        {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <textarea
                      placeholder="Add your comment (optional)"
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      className="textarea"
                      style={{ minHeight: '110px' }}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '12px 16px' }}
                    >
                      {loading ? 'Adding...' : 'Add Review'}
                    </button>
                  </form>
                ) : (
                  <p className="muted" style={{ marginBottom: 0 }}>Login to leave a review and rating.</p>
                )}
              </div>
            </div>

            <div style={{ marginTop: '22px' }}>
              <h3 style={{ marginBottom: '10px' }}>Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <div className="card" style={{ padding: '16px' }}><p className="muted" style={{ margin: 0 }}>No reviews yet. Be the first to review!</p></div>
              ) : (
                reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    actions={
                      auth.user?.id && String(review.user?._id || '') === String(auth.user.id) ? (
                        <div className="nav-actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleUpdateReview(review)}
                            disabled={actionLoadingId === review._id}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-accent"
                            onClick={() => handleDeleteReview(review._id)}
                            disabled={actionLoadingId === review._id}
                          >
                            {actionLoadingId === review._id ? 'Working...' : 'Delete'}
                          </button>
                        </div>
                      ) : null
                    }
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaceDetails;
