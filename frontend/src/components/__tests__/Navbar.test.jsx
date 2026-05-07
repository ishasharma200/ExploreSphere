import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    auth: { isAuthenticated: false },
    logout: vi.fn(),
  }),
}));

describe('Navbar', () => {
  it('renders brand and navigation buttons', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Explore Sphere')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
  });

  it('contains a mobile menu toggle button', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const toggle = screen.getByLabelText(/toggle menu/i, { hidden: true });
    expect(toggle).toBeInTheDocument();
  });
});
