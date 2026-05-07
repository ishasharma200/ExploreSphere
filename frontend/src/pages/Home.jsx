import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlaces } from '../api/placeApi';
import PlaceCard from '../components/PlaceCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import LiveFeed from '../components/LiveFeed';
import { useAuth } from '../hooks/useAuth';
import socket from '../realtime/socket';

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [liveEvents, setLiveEvents] = useState([]);
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await getPlaces();
        setPlaces(data);
      } catch (error) {
        console.error('Failed to fetch places');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    const addLiveEvent = (title, detail) => {
      setLiveEvents((currentEvents) => [{ id: `${Date.now()}-${Math.random()}`, title, detail }, ...currentEvents].slice(0, 4));
    };

    const handlePlaceCreated = (newPlace) => {
      setPlaces((currentPlaces) => {
        if (currentPlaces.some((place) => place._id === newPlace._id)) {
          return currentPlaces;
        }
        return [newPlace, ...currentPlaces];
      });
      addLiveEvent('New place published', `${newPlace.name || 'Unnamed place'} was added to the catalog.`);
    };

    const handlePlaceUpdated = (updatedPlace) => {
      setPlaces((currentPlaces) => currentPlaces.map((place) => (place._id === updatedPlace._id ? updatedPlace : place)));
      addLiveEvent('Place updated', `${updatedPlace.name || 'A place'} now reflects the latest changes.`);
    };

    const handlePlaceDeleted = ({ id: deletedPlaceId }) => {
      setPlaces((currentPlaces) => currentPlaces.filter((place) => place._id !== deletedPlaceId));
      addLiveEvent('Place removed', 'A listing was deleted and removed from the feed.');
    };

    socket.on('place:created', handlePlaceCreated);
    socket.on('place:updated', handlePlaceUpdated);
    socket.on('place:deleted', handlePlaceDeleted);

    return () => {
      socket.off('place:created', handlePlaceCreated);
      socket.off('place:updated', handlePlaceUpdated);
      socket.off('place:deleted', handlePlaceDeleted);
    };
  }, []);

  const categories = [...new Set(places.map((place) => place.category).filter(Boolean))].sort();
  const placeCount = places.length;
  const categoryCount = categories.length;

  const filteredPlaces = places.filter((place) => {
    const searchableText = `${place.name || ''} ${place.location || ''} ${place.description || ''}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || place.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-shell stack">
      <Navbar
        isAuthenticated={auth.isAuthenticated}
        onLogout={() => {
          logout();
          navigate('/');
        }}
      />

      <div className="hero-panel stack">
        <div className="hero-grid">
          <div className="stack" style={{ gap: '10px' }}>
            <span className="section-badge">Venue intelligence for modern discovery</span>
            <h2 className="section-title">A polished platform for discovering trusted venues and reviews.</h2>
            <p className="section-copy">Explore restaurants, cafes, hotels, and public spaces through a clean product experience built for browsing, comparison, and confident decisions.</p>
            <div className="pill-group">
              <span className="pill">Realtime updates</span>
              <span className="pill">Curated listings</span>
              <span className="pill">Ratings + reviews</span>
              <span className="pill">Fast discovery</span>
            </div>
            <div className="nav-actions" style={{ marginTop: '8px' }}>
              <button className="btn btn-primary" onClick={() => navigate('/about')}>About this project</button>
              <button className="btn btn-secondary" onClick={() => navigate('/browse')}>Browse places</button>
              <button className="btn btn-secondary" onClick={() => navigate('/how-it-works')}>How it works</button>
            </div>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <div className="section-label" style={{ marginBottom: '10px' }}>Platform snapshot</div>
            <div className="stack" style={{ gap: '10px' }}>
              <div className="stat-tile stat-tile-primary">
                <div className="muted" style={{ fontSize: '0.85rem' }}>Active listings</div>
                <strong>{placeCount}</strong>
              </div>
              <div className="stat-tile">
                <div className="muted" style={{ fontSize: '0.85rem' }}>Available categories</div>
                <strong>{categoryCount}</strong>
              </div>
              <div className="stat-tile">
                <div className="muted" style={{ fontSize: '0.85rem' }}>Realtime layer</div>
                <strong>Enabled</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="section-label">Discovery</div>
            <h3>Browse with confidence</h3>
            <p>Search by name, compare category groups, and open detailed venue profiles in a focused flow.</p>
          </div>
          <div className="feature-card">
            <div className="section-label">Signals</div>
            <h3>Ratings that stay live</h3>
            <p>Reviews and average ratings update instantly so the interface always reflects the current conversation.</p>
          </div>
          <div className="feature-card">
            <div className="section-label">Contribute</div>
            <h3>Add listings fast</h3>
            <p>Post a venue, choose a category, and publish it into the platform without extra friction.</p>
          </div>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
        />

        <LiveFeed
          title="Live catalog activity"
          subtitle="Recent realtime changes across the platform"
          items={liveEvents}
          emptyText="New place activity will appear here as it happens."
        />

        {loading ? (
          <p className="muted">Loading places...</p>
        ) : filteredPlaces.length === 0 ? (
          <div className="card" style={{ padding: '18px' }}>
            <p className="muted" style={{ margin: 0 }}>No places found. Be the first to add one!</p>
          </div>
        ) : (
          <div className="grid-list">
            {filteredPlaces.map((place) => (
              <div
                key={place._id}
                onClick={() => navigate(`/place/${place._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        )}

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p className="quote-mark">“</p>
            <p>The interface feels much more like a product people would actually trust and use regularly.</p>
            <div className="muted">Product-led layout</div>
          </div>
          <div className="testimonial-card">
            <p className="quote-mark">“</p>
            <p>It now reads like a proper venue platform, not just a local directory or demo app.</p>
            <div className="muted">Polished discovery flow</div>
          </div>
          <div className="testimonial-card">
            <p className="quote-mark">“</p>
            <p>The realtime updates and cards make the experience feel alive and professionally maintained.</p>
            <div className="muted">Realtime platform feel</div>
          </div>
        </div>

        <div className="cta-banner">
          <div>
            <div className="section-label" style={{ marginBottom: '8px' }}>Next action</div>
            <h3 style={{ margin: '0 0 8px' }}>Explore the catalog or add a new venue listing.</h3>
            <p className="section-copy" style={{ marginBottom: 0 }}>The platform is ready for browsing, submissions, and live review activity.</p>
          </div>
          <div className="nav-actions">
            <button className="btn btn-primary" onClick={() => navigate('/browse')}>Browse now</button>
            <button className="btn btn-secondary" onClick={() => navigate('/add')}>Add venue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;