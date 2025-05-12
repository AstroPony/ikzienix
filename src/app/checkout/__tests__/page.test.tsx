import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/lib/cart-context'
import CheckoutPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
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
    // Mock fetch for order creation
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ orderId: '123' }),
    })
  })

  it('renders the checkout page correctly', async () => {
    renderWithProviders(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument()
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
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Test City' },
    })
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'Test State' },
    })
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '12345' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText(/order placed successfully/i)).toBeInTheDocument()
    })
  })

  it('shows validation errors for required fields', async () => {
    renderWithProviders(<CheckoutPage />)

    // Submit form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/address is required/i)).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to create order'))

    renderWithProviders(<CheckoutPage />)

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Test City' },
    })
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'Test State' },
    })
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '12345' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
      expect(screen.getByText(/failed to place order/i)).toBeInTheDocument()
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
      expect(screen.getByText(/please sign in to continue/i)).toBeInTheDocument()
    })
  })
}) 