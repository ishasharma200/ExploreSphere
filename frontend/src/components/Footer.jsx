const Footer = () => {
	return (
		<footer className="app-footer">
			<div className="app-footer-inner">
				<div>
					<div className="brand-mark" style={{ marginBottom: 'clamp(10px, 2vw, 12px)' }}>
						<div className="brand-badge">ES</div>
						<div style={{ minWidth: 0 }}>
							<div style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', fontWeight: '700', color: 'var(--text)' }}>Explore Sphere</div>
							<div className="muted" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>Place discovery platform</div>
						</div>
					</div>
					<p className="page-note" style={{ fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)' }}>Built for discovering trusted venues, capturing reviews, and surfacing fresh activity in realtime.</p>
				</div>

				<div className="footer-status card" style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
					<div className="section-label" style={{ marginBottom: 'clamp(4px, 1vw, 8px)', fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)' }}>Platform Status</div>
					<strong style={{ fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>Realtime Active</strong>
					<div className="muted" style={{ marginTop: 'clamp(4px, 1vw, 6px)', fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)' }}>Updates and submissions reflect instantly across the app.</div>
				</div>

				<div className="footer-cta card" style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
					<div className="section-label" style={{ marginBottom: 'clamp(4px, 1vw, 8px)', fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)' }}>Start Exploring</div>
					<strong style={{ fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>Browse & Contribute</strong>
					<div className="muted" style={{ marginTop: 'clamp(4px, 1vw, 6px)', fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)' }}>Find venues, leave reviews, and discover locally.</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;