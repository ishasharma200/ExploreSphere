import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { getErrorMessage } from '../utils/getErrorMessage';
import { validateSignupForm } from '../utils/formValidation';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateSignupForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await signup(form.name, form.email, form.password);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'Signup failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell stack">
      <Navbar isAuthenticated={false} />
      <div className="auth-panel form-card stack">
        <div>
          <span className="section-badge">Join the community</span>
          <h2 className="section-title">Signup</h2>
          <p className="section-copy">Create an account to contribute places and reviews.</p>
        </div>
        {error && <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p>}
        <form onSubmit={handleSubmit} className="form-grid">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="field"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="field"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="field"
          required
        />
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
        </form>
        <p className="section-copy" style={{ margin: 0 }}>
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ padding: '6px 12px', marginLeft: '6px' }}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
