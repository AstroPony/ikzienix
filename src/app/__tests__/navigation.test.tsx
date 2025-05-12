import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import Navigation from '@/components/navigation/Navigation';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/context/WishlistContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}));

// Mock the session
const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User'
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString()
};

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <SessionProvider session={mockSession}>
      <CartProvider>
        <WishlistProvider>
          {component}
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
};

describe('Navigation', () => {
  it('renders the navigation correctly', () => {
    renderWithProviders(<Navigation />);

    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Collections')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('displays user menu when logged in', () => {
    renderWithProviders(<Navigation />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('displays sign in button when not logged in', () => {
    render(
      <SessionProvider session={null}>
        <CartProvider>
          <WishlistProvider>
            <Navigation />
          </WishlistProvider>
        </CartProvider>
      </SessionProvider>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('handles mobile menu toggle', () => {
    renderWithProviders(<Navigation />);

    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByRole('navigation')).toHaveClass('navbar-expand-lg');
  });

  it('displays cart icon', () => {
    renderWithProviders(<Navigation />);

    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
  });
}); 