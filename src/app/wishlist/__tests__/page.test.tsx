import { render, screen } from '@testing-library/react'
import WishlistPage from '../page'
import { WishlistProvider } from '@/lib/wishlist-context'

describe('WishlistPage', () => {
  it('renders the Wishlist page correctly', () => {
    render(
      <WishlistProvider>
        <WishlistPage />
      </WishlistProvider>
    )
    expect(screen.getByText('My Wishlist')).toBeInTheDocument()
  })
}) 