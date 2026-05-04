import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

const NotFound = () => {
	const navigate = useNavigate();
	const { auth, logout } = useAuth();

	return (
		<div className="page-shell stack">
			<Navbar isAuthenticated={auth.isAuthenticated} onLogout={logout} />
			<div className="hero-panel stack" style={{ textAlign: 'center', padding: '42px 28px' }}>
				<p className="muted" style={{ margin: 0 }}>404</p>
				<h1 className="section-title">That page does not exist.</h1>
				<p className="section-copy">Go back home, browse places, or learn how the app works.</p>
				<div className="nav-actions" style={{ justifyContent: 'center' }}>
					<button className="btn btn-primary" onClick={() => navigate('/')}>Go home</button>
					<button className="btn btn-secondary" onClick={() => navigate('/about')}>About</button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;