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

// Mock cart context
const mockCartState = {
  items: [
    {
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
      image: '/test.jpg'
    }
  ],
  total: 100
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

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading checkout...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Payment Details')).toBeInTheDocument()
  })

  it('displays cart items correctly', async () => {
    renderWithProviders(<CheckoutPage />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading checkout...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    renderWithProviders(<CheckoutPage />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading checkout...')).not.toBeInTheDocument()
    })

    // Fill in shipping form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } })
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New York' } })
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'NY' } })
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: '10001' } })
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'USA' } })

    // Submit form
    fireEvent.click(screen.getByText('Pay Now'))

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })
  })

  it('handles form validation', async () => {
    renderWithProviders(<CheckoutPage />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading checkout...')).not.toBeInTheDocument()
    })

    // Submit form without filling required fields
    fireEvent.click(screen.getByText('Pay Now'))

    // Check for validation messages
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Address is required')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to create payment intent'))
    )

    renderWithProviders(<CheckoutPage />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading checkout...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('An error occurred')).toBeInTheDocument()
  })

  it('handles unauthorized access', async () => {
    render(
      <SessionProvider session={null}>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </SessionProvider>
    )

    // Wait for redirect
    await waitFor(() => {
      expect(window.location.pathname).toBe('/auth/signin')
    })
  })
}) 