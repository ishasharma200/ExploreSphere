import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getReviews, getAverageRating, addReview } from '../api/reviewApi';
import { getPlaceById } from '../api/placeApi';
import { useAuth } from '../hooks/useAuth';
import ReviewCard from '../components/ReviewCard';
import socket from '../realtime/socket';

const PlaceDetails = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
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

    loadPage();
  }, [id]);

  useEffect(() => {
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

      getAverageRating(id)
        .then((data) => setRating(data.average))
        .catch(() => console.error('Failed to refresh rating'));
    };

    socket.on('review:created', handleReviewCreated);

    return () => {
      socket.off('review:created', handleReviewCreated);
    };
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!auth.isAuthenticated) {
      alert('Please login to add a review');
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
    } catch (error) {
      alert('Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="details-panel" style={{ padding: '24px' }}>
        {pageLoading ? (
          <p className="muted" style={{ margin: 0 }}>Loading place details...</p>
        ) : (
          <>
            <div className="hero-grid">
              <div className="stack">
                <div>
                  <p className="muted" style={{ margin: '0 0 8px' }}>Place details</p>
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
                </div>
              </div>

              <div className="card" style={{ padding: '18px' }}>
                <h3 style={{ marginTop: 0 }}>Add a review</h3>
                {auth.isAuthenticated ? (
                  <form onSubmit={handleSubmitReview} className="form-grid">
                    <div>
                      <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Rating</label>
                      <select
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
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
                reviews.map((review) => <ReviewCard key={review._id} review={review} />)
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaceDetails;
