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

  const hasImage = place.images && place.images.length > 0;

  return (
    <div className="card card-hover" style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', borderRadius: '16px' }}>
      {hasImage && (
        <div style={{ width: '100%', height: 'clamp(150px, 35vw, 200px)', overflow: 'hidden', background: '#e2e8f0' }}>
          <img
            src={place.images[0]}
            alt={place.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      <div style={{ padding: 'clamp(14px, 3vw, 20px)' }}>
        <div className="stack" style={{ gap: 'clamp(10px, 2vw, 12px)' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', letterSpacing: '-0.03em', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: '700', color: 'var(--text)' }}>{place.name}</h3>
            <p className="muted" style={{ margin: 0, fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>📍 {place.location || 'Unknown location'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(6px, 1vw, 8px) clamp(10px, 2vw, 12px)', borderRadius: '999px', background: 'rgba(15, 76, 129, 0.08)', color: 'var(--primary)', fontWeight: '600', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', border: '1px solid rgba(15, 76, 129, 0.12)', whiteSpace: 'nowrap' }}>
              {place.category || 'Uncategorized'}
            </span>
            {rating > 0 && <strong style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', color: 'var(--warning)' }}>⭐ {rating.toFixed(1)}</strong>}
          </div>
          <p className="muted" style={{ margin: 0, fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', lineHeight: '1.5' }}>{place.description || 'No description added yet.'}</p>
        </div>
      </div>
    </div>
  );
};


export default PlaceCard;