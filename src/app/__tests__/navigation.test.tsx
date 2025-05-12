import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '@/components/navigation/Navigation';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/lib/cart-context';

// Mock the session
const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
};

describe('Navigation', () => {
  it('renders the navigation bar correctly', () => {
    render(
      <SessionProvider session={null}>
        <CartProvider>
          <Navigation />
        </CartProvider>
      </SessionProvider>
    );

    // Check for logo
    expect(screen.getByText('Ikzienix')).toBeInTheDocument();

    // Check for main navigation links
    expect(screen.getByText('Collections')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();

    // Check for sign up button
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('handles mobile menu toggle', () => {
    render(
      <SessionProvider session={null}>
        <CartProvider>
          <Navigation />
        </CartProvider>
      </SessionProvider>
    );

    // Find and click the hamburger button
    const hamburgerButton = screen.getByLabelText('Toggle navigation');
    fireEvent.click(hamburgerButton);

    // Check if the mobile menu is rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('shows correct links for unauthenticated user', () => {
    render(
      <SessionProvider session={null}>
        <CartProvider>
          <Navigation />
        </CartProvider>
      </SessionProvider>
    );

    // Check for sign in link
    const accountLink = screen.getByLabelText('Account');
    expect(accountLink).toHaveAttribute('href', '/auth/signin');

    // Check for sign up button
    const signUpButton = screen.getByRole('link', { name: 'Sign Up' });
    expect(signUpButton).toHaveAttribute('href', '/auth/signup');
  });

  it('shows correct links for authenticated user', () => {
    render(
      <SessionProvider session={mockSession}>
        <CartProvider>
          <Navigation />
        </CartProvider>
      </SessionProvider>
    );

    // Check for account dropdown
    const accountDropdown = screen.getByLabelText('Account');
    expect(accountDropdown).toBeInTheDocument();

    // Check for user name
    expect(screen.getByText('Test User')).toBeInTheDocument();

    // Check for account links
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Wishlist')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('handles cart interaction', () => {
    render(
      <SessionProvider session={null}>
        <CartProvider>
          <Navigation />
        </CartProvider>
      </SessionProvider>
    );

    // Check for cart button
    const cartButton = screen.getByLabelText('Cart');
    expect(cartButton).toBeInTheDocument();

    // Click cart button
    fireEvent.click(cartButton);

    // Check for cart dropdown
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });
}); 