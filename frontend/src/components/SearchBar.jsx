const SearchBar = ({ searchTerm, onSearchChange, category, onCategoryChange, categories = [] }) => {
	return (
		<div style={{ display: 'grid', gap: '12px', margin: '20px 0' }}>
			<input
				type="text"
				value={searchTerm}
				onChange={(event) => onSearchChange(event.target.value)}
				placeholder="Search by name, location, or description"
				className="field"
			/>

			<select
				value={category}
				onChange={(event) => onCategoryChange(event.target.value)}
				className="select"
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
