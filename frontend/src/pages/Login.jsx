import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { getErrorMessage } from '../utils/getErrorMessage';
import { validateLoginForm } from '../utils/formValidation';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateLoginForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await loginApi(form.email, form.password);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell stack">
      <Navbar isAuthenticated={false} />
      <div className="auth-panel form-card stack">
        <div>
          <span className="section-badge">Welcome back</span>
          <h2 className="section-title">Login</h2>
          <p className="section-copy">Sign in to add places, leave reviews, and manage your profile.</p>
        </div>
        {error && <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p>}
        <form onSubmit={handleSubmit} className="form-grid">
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
        </form>
        <p className="section-copy" style={{ margin: 0 }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="btn btn-secondary" style={{ padding: '6px 12px', marginLeft: '6px' }}>
            Signup
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
