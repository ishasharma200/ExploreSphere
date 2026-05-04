import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AddPlace = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    location: '',
    category: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/places', form, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add place');
    } finally {
      setLoading(false);
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="page-shell stack">
        <Navbar isAuthenticated={false} />
        <div className="auth-panel form-card stack" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Login required</h2>
          <p className="section-copy">You need an account before you can add a new place.</p>
          <div className="nav-actions" style={{ justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Create account</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell stack">
      <Navbar
        isAuthenticated={auth.isAuthenticated}
        onLogout={() => {
          logout();
          navigate('/');
        }}
      />
      <div className="auth-panel form-card stack">
        <div>
          <p className="muted" style={{ margin: '0 0 8px' }}>Submit a place</p>
          <h2 className="section-title">Add a new venue listing</h2>
          <p className="section-copy">Publish cafes, restaurants, hotels, or other venues to the platform.</p>
        </div>
        {error && <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p>}
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Place name"
            value={form.name}
            onChange={handleChange}
            className="field"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="field"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="select"
            required
          >
            <option value="">Choose category</option>
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
            <option value="hotel">Hotel</option>
            <option value="tourist">Tourist spot</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="textarea"
            style={{ minHeight: '130px' }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
            {loading ? 'Adding...' : 'Add place'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlace;
