import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlaces } from '../api/placeApi';
import Navbar from '../components/Navbar';
import PlaceCard from '../components/PlaceCard';
import SearchBar from '../components/SearchBar';
import LiveFeed from '../components/LiveFeed';
import { useAuth } from '../hooks/useAuth';
import socket from '../realtime/socket';

const Browse = () => {
	const [places, setPlaces] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [category, setCategory] = useState('all');
	const [liveEvents, setLiveEvents] = useState([]);
	const navigate = useNavigate();
	const { auth, logout } = useAuth();

	useEffect(() => {
		const loadPlaces = async () => {
			try {
				const data = await getPlaces();
				setPlaces(data);
			} catch (error) {
				console.error('Failed to load places');
			} finally {
				setLoading(false);
			}
		};

		loadPlaces();
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
			addLiveEvent('New listing', `${newPlace.name || 'A place'} was added to Browse.`);
		};

		const handlePlaceUpdated = (updatedPlace) => {
			setPlaces((currentPlaces) => currentPlaces.map((place) => (place._id === updatedPlace._id ? updatedPlace : place)));
			addLiveEvent('Listing updated', `${updatedPlace.name || 'A place'} was updated in real time.`);
		};

		const handlePlaceDeleted = ({ id: deletedPlaceId }) => {
			setPlaces((currentPlaces) => currentPlaces.filter((place) => place._id !== deletedPlaceId));
			addLiveEvent('Listing removed', 'A place was deleted and removed from the catalog.');
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

	const categories = useMemo(() => {
		return [...new Set(places.map((place) => place.category).filter(Boolean))].sort();
	}, [places]);

	const visiblePlaces = places.filter((place) => {
		const searchableText = `${place.name || ''} ${place.location || ''} ${place.description || ''}`.toLowerCase();
		const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
		const matchesCategory = category === 'all' || place.category === category;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="page-shell stack">
			<Navbar isAuthenticated={auth.isAuthenticated} onLogout={logout} />

			<div className="hero-panel stack">
				<div className="hero-grid">
					<div className="stack" style={{ gap: '10px' }}>
						<span className="section-badge">Browse the directory</span>
						<h1 className="section-title">A structured view of trusted venues and listings.</h1>
						<p className="section-copy">
							Use this page to scan the full catalog, compare categories, and jump into detail views quickly.
						</p>
					</div>
					<div className="card" style={{ padding: '18px' }}>
						<p className="muted" style={{ marginTop: 0 }}>What you can do</p>
						<div className="stack" style={{ gap: '10px' }}>
							<div className="card" style={{ padding: '12px 14px', background: 'rgba(20, 83, 45, 0.05)' }}>Search by name or location</div>
							<div className="card" style={{ padding: '12px 14px', background: 'rgba(15, 118, 110, 0.05)' }}>Filter by category</div>
							<div className="card" style={{ padding: '12px 14px', background: 'rgba(249, 115, 22, 0.07)' }}>Open a detailed venue profile</div>
						</div>
					</div>
				</div>

				<SearchBar
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
					category={category}
					onCategoryChange={setCategory}
					categories={categories}
				/>

				{loading ? (
					<p className="muted">Loading places...</p>
				) : visiblePlaces.length === 0 ? (
					<div className="card" style={{ padding: '18px' }}>
						<p className="muted" style={{ margin: 0 }}>No places match your current search.</p>
					</div>
				) : (
					<div className="grid-list">
						{visiblePlaces.map((place) => (
							<div key={place._id} onClick={() => navigate(`/place/${place._id}`)} style={{ cursor: 'pointer' }}>
								<PlaceCard place={place} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
					<LiveFeed
						title="Live browse feed"
						subtitle="Watch catalog changes arrive instantly"
						items={liveEvents}
						emptyText="Browse updates will appear here in realtime."
					/>

};

export default Browse;