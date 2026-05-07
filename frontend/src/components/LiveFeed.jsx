const LiveFeed = ({ title = 'Live updates', subtitle = 'Socket.IO activity', items = [], emptyText = 'Waiting for activity...' }) => {
	return (
		<div className="card" style={{ padding: 'clamp(12px, 3vw, 18px)' }}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'clamp(8px, 2vw, 12px)', marginBottom: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
				<div style={{ flex: 1, minWidth: 0 }}>
					<div className="section-label" style={{ marginBottom: '4px' }}>{title}</div>
					<p className="muted" style={{ margin: 0, fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>{subtitle}</p>
				</div>
				<span className="pill" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>Realtime</span>
			</div>

			{items.length === 0 ? (
				<p className="muted" style={{ margin: 0, fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>{emptyText}</p>
			) : (
				<div className="stack" style={{ gap: 'clamp(8px, 1.5vw, 10px)' }}>
					{items.map((item) => (
						<div key={item.id} className="card" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(12px, 2vw, 14px)', background: 'rgba(37, 99, 235, 0.05)', borderRadius: 'var(--radius-md)' }}>
							<div style={{ fontWeight: 600, marginBottom: '4px', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>{item.title}</div>
							<p className="muted" style={{ margin: 0, fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)' }}>{item.detail}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default LiveFeed;