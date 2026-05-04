const ReviewCard = ({ review }) => {
  return (
    <div className="card" style={{ padding: '16px', margin: '14px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <strong>{review.user?.name || 'Anonymous'}</strong>
        <span style={{ color: '#f59e0b', fontSize: '16px', letterSpacing: '2px' }}>{'★'.repeat(review.rating)}</span>
      </div>
      <p style={{ margin: '10px 0 8px', lineHeight: 1.6 }}>{review.comment || 'No comment provided.'}</p>
      <small className="muted">
        {new Date(review.createdAt).toLocaleDateString()}
      </small>
    </div>
  );
};

export default ReviewCard;