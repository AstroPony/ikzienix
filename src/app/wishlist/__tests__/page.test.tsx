import { render, screen } from '@testing-library/react'
import WishlistPage from '../page'

describe('WishlistPage', () => {
  it('renders the Wishlist page correctly', () => {
    render(<WishlistPage />)
    expect(screen.getByText('My Wishlist')).toBeInTheDocument()
  })
}) 