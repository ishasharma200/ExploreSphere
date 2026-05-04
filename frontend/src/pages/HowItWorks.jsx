import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

const steps = [
	{
		number: '01',
		title: 'Find a place',
		description: 'Search the feed or filter by category to find cafes, restaurants, hotels, and more.',
	},
	{
		number: '02',
		title: 'Open details',
		description: 'View the place, average rating, and reviews from the community in one place.',
	},
	{
		number: '03',
		title: 'Contribute live',
		description: 'Sign in to add places or reviews and see updates appear instantly for everyone.',
	},
];

const HowItWorks = () => {
	const { auth, logout } = useAuth();

	return (
		<div className="page-shell stack">
			<Navbar isAuthenticated={auth.isAuthenticated} onLogout={logout} />
			<div className="hero-panel stack">
				<div className="stack" style={{ gap: '10px' }}>
					<p className="muted" style={{ margin: 0 }}>How it works</p>
					<h1 className="section-title">The product flow is intentionally clean and professional.</h1>
					<p className="section-copy">
						The frontend is built around three user actions: discover, inspect, and contribute. That keeps the product easy to understand and ready for real use.
					</p>
				</div>

				<div className="grid-list">
					{steps.map((step) => (
						<div key={step.number} className="card" style={{ padding: '18px' }}>
							<div className="muted" style={{ fontSize: '0.9rem' }}>{step.number}</div>
							<h3 style={{ margin: '6px 0 10px' }}>{step.title}</h3>
							<p className="section-copy" style={{ marginBottom: 0 }}>{step.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HowItWorks;