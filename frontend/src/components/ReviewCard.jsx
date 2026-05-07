const ReviewCard = ({ review, actions }) => {
  return (
    <div className="card" style={{ padding: '20px', margin: '16px 0', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <strong style={{ fontSize: '0.95rem', color: 'var(--text)' }}>{review.user?.name || 'Anonymous'}</strong>
        <span style={{ color: 'var(--warning)', fontSize: '14px', letterSpacing: '1px' }}>{'★'.repeat(review.rating)}</span>
      </div>
      <p style={{ margin: '12px 0', lineHeight: 1.6, fontSize: '0.95rem', color: 'var(--text)' }}>{review.comment || 'No comment provided.'}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
        <small className="muted" style={{ fontSize: '0.85rem' }}>
          {new Date(review.createdAt).toLocaleDateString()}
        </small>
        {actions}
      </div>
    </div>
  );
};

export default ReviewCard;