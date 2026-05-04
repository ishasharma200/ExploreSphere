import { useEffect, useState } from 'react';
import { getAverageRating } from '../api/reviewApi';

const PlaceCard = ({ place }) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const data = await getAverageRating(place._id);
        setRating(data.average);
      } catch (error) {
        console.error('Failed to fetch rating');
      }
    };
    fetchRating();
  }, [place._id]);

  return (
    <div className="card card-hover" style={{ padding: '18px', cursor: 'pointer' }}>
      <div className="stack" style={{ gap: '10px' }}>
        <div>
          <h3 style={{ margin: '0 0 6px', letterSpacing: '-0.03em' }}>{place.name}</h3>
          <p className="muted" style={{ margin: 0 }}>📍 {place.location || 'Unknown location'}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 10px', borderRadius: '999px', background: 'rgba(20, 83, 45, 0.08)', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            {place.category || 'Uncategorized'}
          </span>
          {rating > 0 && <strong>⭐ {rating}</strong>}
        </div>
        <p className="muted" style={{ margin: 0 }}>{place.description || 'No description added yet.'}</p>
      </div>
    </div>
  );
};

export default PlaceCard;