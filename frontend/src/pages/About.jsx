import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

const highlights = [
	{
		title: 'Professional discovery',
		description: 'Present listings in a polished interface that supports exploration across venues and categories.',
	},
	{
		title: 'Realtime activity',
		description: 'New places and reviews appear instantly through live socket updates.',
	},
	{
		title: 'Opinionated UI',
		description: 'A clean glass-like layout with strong hierarchy so the core actions stay obvious.',
	},
];

const About = () => {
	const { auth, logout } = useAuth();

	return (
		<div className="page-shell stack">
			<Navbar isAuthenticated={auth.isAuthenticated} onLogout={logout} />
			<div className="hero-panel stack">
				<div className="hero-grid">
					<div className="stack" style={{ gap: '10px' }}>
						<span className="section-badge">About Explore Sphere</span>
						<h1 className="section-title">A professional venue discovery platform for modern browsing and reviews.</h1>
						<p className="section-copy">
							Explore Sphere is a polished product layer for discovering listings, leaving reviews, and surfacing new activity in realtime.
						</p>
					</div>
					<div className="card" style={{ padding: '18px' }}>
						<p className="muted" style={{ marginTop: 0 }}>Core stack</p>
						<div className="stack" style={{ gap: '10px' }}>
							<div className="card" style={{ padding: '12px 14px' }}>React + Vite frontend</div>
							<div className="card" style={{ padding: '12px 14px' }}>Node + Express backend</div>
							<div className="card" style={{ padding: '12px 14px' }}>MongoDB + Socket.IO realtime</div>
						</div>
					</div>
				</div>

				<div className="grid-list">
					{highlights.map((item) => (
						<div key={item.title} className="card" style={{ padding: '18px' }}>
							<h3 style={{ marginTop: 0 }}>{item.title}</h3>
							<p className="section-copy" style={{ marginBottom: 0 }}>{item.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default About;