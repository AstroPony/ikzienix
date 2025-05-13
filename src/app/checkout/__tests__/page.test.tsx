import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/lib/cart-context'
import CheckoutPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: () => Promise.resolve({
    elements: jest.fn(),
  }),
}))

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PaymentElement: () => <div data-testid="payment-element">Payment Element</div>,
  useStripe: () => ({
    confirmPayment: jest.fn().mockResolvedValue({ error: null }),
  }),
  useElements: () => ({
    getElement: jest.fn(),
  }),
}))

const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: '1',
}

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  description: 'Test Description',
  image: '/test.jpg',
  category: 'test',
  rating: 4.5,
  reviews: 10,
  featured: true,
  colors: ['red', 'blue'],
  inStock: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  sku: 'TEST-001',
  slug: 'test-product',
  specifications: {},
  features: [],
  careInstructions: [],
  warranty: '',
  shipping: '',
}

const mockCartState = {
  items: [
    {
      product: mockProduct,
      quantity: 1,
    },
  ],
}

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <SessionProvider session={mockSession}>
      <CartProvider>{ui}</CartProvider>
    </SessionProvider>
  )
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    // Mock fetch for payment intent creation
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url === '/api/create-payment-intent') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ clientSecret: 'test_secret' }),
        })
      }
      if (url === '/api/account') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            name: 'Test User',
            email: 'test@example.com',
            shippingAddress: {
              line1: '123 Main St',
              city: 'Test City',
              state: 'Test State',
              postalCode: '12345',
              country: 'US',
            },
          }),
        })
      }
      if (url === '/api/save-address') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    })
  })

  it('renders the checkout page correctly', async () => {
    renderWithProviders(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })
  })

  it('displays cart items correctly', async () => {
    renderWithProviders(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('$99.99')).toBeInTheDocument()
    })
  })

  it('handles shipping form submission', async () => {
    renderWithProviders(<CheckoutPage />)

    // Fill in shipping details
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Test City' },
    })
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'Test State' },
    })
    fireEvent.change(screen.getByLabelText('Zip Code'), {
      target: { value: '12345' },
    })

    // Submit form
    fireEvent.click(screen.getByText('Continue to Payment'))

    await waitFor(() => {
      expect(screen.getByTestId('payment-element')).toBeInTheDocument()
    })
  })

  it('shows validation errors for required fields', async () => {
    renderWithProviders(<CheckoutPage />)

    // Submit form without filling required fields
    fireEvent.click(screen.getByText('Continue to Payment'))

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Address is required')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to create payment intent'))

    renderWithProviders(<CheckoutPage />)

    // Fill in required fields
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Test City' },
    })
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'Test State' },
    })
    fireEvent.change(screen.getByLabelText('Zip Code'), {
      target: { value: '12345' },
    })

    // Submit form
    fireEvent.click(screen.getByText('Continue to Payment'))

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Failed to create payment intent')).toBeInTheDocument()
    })
  })

  it('redirects to sign in if not authenticated', async () => {
    render(
      <SessionProvider session={null}>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Please sign in to continue')).toBeInTheDocument()
    })
  })

  it('loads saved shipping address if available', async () => {
    renderWithProviders(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('Full Name')).toHaveValue('Test User')
      expect(screen.getByLabelText('Email')).toHaveValue('test@example.com')
      expect(screen.getByLabelText('Address')).toHaveValue('123 Main St')
      expect(screen.getByLabelText('City')).toHaveValue('Test City')
      expect(screen.getByLabelText('State')).toHaveValue('Test State')
      expect(screen.getByLabelText('Zip Code')).toHaveValue('12345')
    })
  })
}) 