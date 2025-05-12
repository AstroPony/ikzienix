import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '@/components/navigation/Navigation';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/context/WishlistContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }),
  usePathname: () => '/'
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
    const { container } = render(
      <SessionProvider session={mockSession}>
        <Navigation />
      </SessionProvider>
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Collections')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('displays user menu when logged in', () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <Navigation />
      </SessionProvider>
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('displays sign in button when not logged in', () => {
    const { container } = render(
      <SessionProvider session={null}>
        <Navigation />
      </SessionProvider>
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <Navigation />
      </SessionProvider>
    );

    expect(container).toBeInTheDocument();
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByRole('navigation')).toHaveClass('mobile-menu-open');
  });

  it('displays cart icon', () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <Navigation />
      </SessionProvider>
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
  });
}); 