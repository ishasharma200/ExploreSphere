const Footer = () => {
	return (
		<footer className="app-footer">
			<div className="app-footer-inner">
				<div>
					<div className="brand-mark" style={{ marginBottom: '10px' }}>
						<div className="brand-badge">ES</div>
						<div>
							<div style={{ fontSize: '1.05rem' }}>Explore Sphere</div>
							<div className="muted" style={{ fontSize: '0.88rem' }}>Professional venue discovery platform</div>
						</div>
					</div>
					<p className="page-note">Built for discovering trusted venues, capturing reviews, and surfacing fresh activity in realtime.</p>
				</div>

				<div className="footer-status card" style={{ padding: '12px 14px' }}>
					<div className="section-label" style={{ marginBottom: '6px' }}>Platform status</div>
					<strong>Realtime experience active</strong>
					<div className="muted" style={{ marginTop: '4px', fontSize: '0.92rem' }}>Updates and submissions are reflected instantly across the app.</div>
				</div>

				<div className="footer-cta card" style={{ padding: '12px 14px' }}>
					<div className="section-label" style={{ marginBottom: '6px' }}>Explore next</div>
					<strong>Browse, compare, and contribute listings.</strong>
					<div className="muted" style={{ marginTop: '4px', fontSize: '0.92rem' }}>A cleaner way to present venue discovery at product quality.</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;