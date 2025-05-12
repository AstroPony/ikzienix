import { render, screen } from '@testing-library/react'
import OrdersPage from '../page'
import { SessionProvider } from 'next-auth/react'

describe('OrdersPage', () => {
  it('renders the Orders page correctly', () => {
    render(
      <SessionProvider session={null}>
        <OrdersPage />
      </SessionProvider>
    )
    // Since unauthenticated, expect no content
    expect(document.body.textContent).toBe('')
  })
}) 