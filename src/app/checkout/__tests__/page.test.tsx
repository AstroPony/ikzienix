import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import CheckoutPage from '../page'
import { CartProvider } from '@/lib/cart-context'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}))

// Mock the session
const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User'
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString()
}

// Mock cart state
const mockCart = {
  items: [
    {
      id: '1',
      name: 'Test Product',
      price: 99.99,
      quantity: 1,
      image: '/test-image.jpg'
    }
  ],
  total: 99.99
}

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <SessionProvider session={mockSession}>
      <CartProvider>
        {component}
      </CartProvider>
    </SessionProvider>
  )
}

describe('CheckoutPage', () => {
  it('renders the checkout page correctly', async () => {
    renderWithProviders(<CheckoutPage />)

    expect(screen.getByText('Checkout')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })

  it('displays cart items correctly', async () => {
    renderWithProviders(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('$99.99')).toBeInTheDocument()
    })
  })

  it('handles form submission', async () => {
    renderWithProviders(<CheckoutPage />)

    // Fill in shipping details
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' }
    })
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'New York' }
    })
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '10001' }
    })

    // Fill in payment details
    fireEvent.change(screen.getByLabelText(/card number/i), {
      target: { value: '4242424242424242' }
    })
    fireEvent.change(screen.getByLabelText(/expiry date/i), {
      target: { value: '12/25' }
    })
    fireEvent.change(screen.getByLabelText(/cvc/i), {
      target: { value: '123' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText('Order placed successfully!')).toBeInTheDocument()
    })
  })

  it('shows validation errors for required fields', async () => {
    renderWithProviders(<CheckoutPage />)

    // Submit form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Address is required')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    // Mock fetch to simulate an error
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to place order'))

    renderWithProviders(<CheckoutPage />)

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText('Failed to place order')).toBeInTheDocument()
    })
  })

  it('redirects to sign in if not authenticated', () => {
    render(
      <SessionProvider session={null}>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </SessionProvider>
    )

    expect(screen.getByText('Please sign in to continue')).toBeInTheDocument()
  })
}) 