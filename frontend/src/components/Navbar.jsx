import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
	const navigate = useNavigate();

	return (
		<nav className="app-nav">
			<div className="brand-mark" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
				<div className="brand-badge">ES</div>
				<div>
					<div style={{ fontSize: '1.05rem' }}>Explore Sphere</div>
					<div className="muted" style={{ fontSize: '0.88rem' }}>Trusted place discovery platform</div>
				</div>
			</div>

			<div className="nav-links">
				<button className="nav-link" onClick={() => navigate('/')}>Home</button>
				<button className="nav-link" onClick={() => navigate('/browse')}>Browse</button>
				<button className="nav-link" onClick={() => navigate('/about')}>About</button>
				<button className="nav-link" onClick={() => navigate('/how-it-works')}>How it works</button>
			</div>

			<div className="nav-actions">
				{!isAuthenticated ? (
					<>
						<button className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
						<button className="btn btn-primary" onClick={() => navigate('/signup')}>Signup</button>
					</>
				) : (
					<>
						<button className="btn btn-primary" onClick={() => navigate('/add')}>+ Add Place</button>
						<button className="btn btn-secondary" onClick={() => navigate('/profile')}>Profile</button>
						<button className="btn btn-accent" onClick={onLogout}>Logout</button>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
