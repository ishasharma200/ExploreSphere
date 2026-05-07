import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  if (!auth.isAuthenticated) {
    return (
      <div className="page-shell stack">
        <Navbar isAuthenticated={false} />
        <div className="auth-panel form-card stack" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Profile locked</h2>
          <p className="section-copy">Login to view your account details and manage your session.</p>
          <div className="nav-actions" style={{ justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Signup</button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-shell stack">
      <Navbar isAuthenticated={auth.isAuthenticated} onLogout={handleLogout} />
      <div className="auth-panel form-card stack">
        <div>
          <span className="section-badge">Account overview</span>
          <h2 className="section-title">My Profile</h2>
          <p className="section-copy">Your account details are managed securely for the active session.</p>
        </div>
        <div className="grid-list" style={{ gridTemplateColumns: '1fr' }}>
          <div className="card" style={{ padding: '16px' }}>
            <div className="muted" style={{ fontSize: '0.9rem' }}>Name</div>
            <strong>{auth.user?.name}</strong>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <div className="muted" style={{ fontSize: '0.9rem' }}>Email</div>
            <strong>{auth.user?.email}</strong>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-accent" style={{ width: '100%' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
