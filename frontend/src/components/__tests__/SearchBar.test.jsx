import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders input and category select', () => {
    render(
      <SearchBar
        searchTerm=""
        onSearchChange={vi.fn()}
        category="all"
        onCategoryChange={vi.fn()}
        categories={['Cafe', 'Hotel']}
      />
    );

    expect(screen.getByPlaceholderText(/search by name, location, or description/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cafe' })).toBeInTheDocument();
  });

  it('calls handlers when user types and selects category', async () => {
    const handleSearch = vi.fn();
    const handleCategory = vi.fn();

    render(
      <SearchBar
        searchTerm=""
        onSearchChange={handleSearch}
        category="all"
        onCategoryChange={handleCategory}
        categories={['Cafe']}
      />
    );

    await userEvent.type(screen.getByPlaceholderText(/search/i), 'test');
    expect(handleSearch).toHaveBeenCalled();

    await userEvent.selectOptions(screen.getByRole('combobox'), 'Cafe');
    expect(handleCategory).toHaveBeenCalledWith('Cafe');
  });
});
