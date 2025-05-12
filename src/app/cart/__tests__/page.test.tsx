import { render, screen } from '@testing-library/react'
import CartPage from '../page'
import { CartProvider } from '@/lib/cart-context'

describe('CartPage', () => {
  it('renders the Cart page correctly', () => {
    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    )
    expect(screen.getByText('Your Cart')).toBeInTheDocument()
  })
}) 