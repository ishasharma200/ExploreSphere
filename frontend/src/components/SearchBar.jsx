const SearchBar = ({ searchTerm, onSearchChange, category, onCategoryChange, categories = [] }) => {
	return (
		<div className="responsive-split" style={{ margin: '16px 0', gap: '10px' }}>
			<input
				type="text"
				value={searchTerm}
				onChange={(event) => onSearchChange(event.target.value)}
				placeholder="Search by name, location, or description"
				className="field"
				style={{ minHeight: '44px', fontSize: '0.95rem' }}
			/>

			<select
				value={category}
				onChange={(event) => onCategoryChange(event.target.value)}
				className="select"
				style={{ minHeight: '44px', fontSize: '0.95rem' }}
			>
				<option value="all">All Categories</option>
				{categories.map((item) => (
					<option key={item} value={item}>
						{item}
					</option>
				))}
			</select>
		</div>
	);
};

export default SearchBar;
