import { render, screen } from '@testing-library/react'
import WishlistPage from '../page'
import { WishlistProvider } from '@/lib/wishlist-context'

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <WishlistProvider>
      {ui}
    </WishlistProvider>
  );
};

describe('WishlistPage', () => {
  it('renders the Wishlist page correctly', () => {
    renderWithProviders(<WishlistPage />)
    expect(screen.getByText('My Wishlist')).toBeInTheDocument()
  })
}) 