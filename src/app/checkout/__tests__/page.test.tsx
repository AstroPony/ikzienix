import { render, screen } from '@testing-library/react'
import CheckoutPage from '../page'
import { CartProvider } from '@/lib/cart-context'
import { SessionProvider } from 'next-auth/react'

describe('CheckoutPage', () => {
  it('renders the Checkout page correctly', () => {
    render(
      <SessionProvider session={null}>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </SessionProvider>
    )
    // Since unauthenticated, expect no content
    expect(document.body.textContent).toBe('')
  })
}) 