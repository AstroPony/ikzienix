import { render, screen } from '@testing-library/react'
import CheckoutSuccessPage from '../page'
import { CartProvider } from '@/lib/cart-context'

describe('CheckoutSuccessPage', () => {
  it('renders the Checkout Success page correctly', () => {
    render(
      <CartProvider>
        <CheckoutSuccessPage />
      </CartProvider>
    )
    expect(screen.getByText('Payment Failed')).toBeInTheDocument()
  })
}) 