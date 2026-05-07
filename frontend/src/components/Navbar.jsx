import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const Navbar = ({ onLogout }) => {
	const navigate = useNavigate();
	const { auth, logout } = useAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		if (onLogout) onLogout();
		logout();
		setMobileMenuOpen(false);
	};

	const handleNavClick = (path) => {
		navigate(path);
		setMobileMenuOpen(false);
	};

	return (
		<>
			<nav className="app-nav">
				<div className="brand-mark" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
					<div className="brand-badge">ES</div>
					<div style={{ minWidth: 0 }}>
						<div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text)' }}>Explore Sphere</div>
						<div className="muted" style={{ fontSize: '0.8rem' }}>Place discovery platform</div>
					</div>
				</div>

				<div className="nav-links" style={{ display: mobileMenuOpen ? 'flex' : 'none', flexDirection: 'column' }}>
					<button className="nav-link" onClick={() => handleNavClick('/')}>Home</button>
					<button className="nav-link" onClick={() => handleNavClick('/browse')}>Browse</button>
					<button className="nav-link" onClick={() => handleNavClick('/about')}>About</button>
					<button className="nav-link" onClick={() => handleNavClick('/how-it-works')}>How it works</button>
				</div>

				<div className="nav-actions">
					{!auth?.isAuthenticated ? (
						<>
							<button className="btn btn-secondary" onClick={() => handleNavClick('/login')}>Login</button>
							<button className="btn btn-primary" onClick={() => handleNavClick('/signup')}>Signup</button>
						</>
					) : (
						<>
							<button className="btn btn-primary" onClick={() => handleNavClick('/add')}>+ Add Place</button>
							<button className="btn btn-secondary" onClick={() => handleNavClick('/profile')}>Profile</button>
							<button className="btn btn-accent" onClick={handleLogout}>Logout</button>
						</>
					)}
				</div>

				<button 
					className="mobile-menu-btn" 
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					style={{
						display: 'none',
						border: 'none',
						background: 'transparent',
						cursor: 'pointer',
						padding: '8px',
						color: 'var(--text)',
						fontSize: '1.5rem',
						zIndex: 1001
					}}
					aria-label="Toggle menu"
				>
					{mobileMenuOpen ? '✕' : '☰'}
				</button>
			</nav>

			<style>{`
				@media (max-width: 768px) {
					.mobile-menu-btn {
						display: flex !important;
						align-items: center;
						justify-content: center;
					}

					.nav-links {
						display: none !important;
						position: absolute;
						top: 100%;
						left: 0;
						right: 0;
						background: var(--surface);
						border-bottom: 1px solid var(--border);
						flex-direction: column;
						padding: 12px;
						gap: 8px;
						z-index: 1000;
						box-shadow: var(--shadow-md);
						animation: slideDown 0.2s ease;
					}

					.nav-links.open {
						display: flex !important;
					}

					@keyframes slideDown {
						from {
							opacity: 0;
							transform: translateY(-10px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}
				}
			`}</style>
		</>
	);
};

export default Navbar;
