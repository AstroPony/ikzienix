import { render, screen, waitFor } from '@testing-library/react'
import CheckoutPage from '../page'
import { SessionProvider } from 'next-auth/react'

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

// Mock fetch
const mockCart = {
  items: [
    {
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
      image: '/test-image.jpg'
    }
  ],
  total: 100
}

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockCart)
  })
)

describe('CheckoutPage', () => {
  it('renders checkout form correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <CheckoutPage />
      </SessionProvider>
    )

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })

    // Check for form elements
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Address')).toBeInTheDocument()
    expect(screen.getByLabelText('City')).toBeInTheDocument()
    expect(screen.getByLabelText('Postal Code')).toBeInTheDocument()
    expect(screen.getByLabelText('Country')).toBeInTheDocument()
  })

  it('displays cart items', async () => {
    render(
      <SessionProvider session={mockSession}>
        <CheckoutPage />
      </SessionProvider>
    )

    // Wait for cart items to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })
}) 