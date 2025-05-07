import { render, screen } from '@testing-library/react';
import Navigation from '@/components/navigation/Navigation';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-provider';

describe('Navigation', () => {
  it('renders the brand and cart icon', () => {
    render(
      <AuthProvider>
        <CartProvider>
          <Navigation />
        </CartProvider>
      </AuthProvider>
    );
    expect(screen.getByLabelText(/ikzienix home/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cart/i)).toBeInTheDocument();
  });
}); 