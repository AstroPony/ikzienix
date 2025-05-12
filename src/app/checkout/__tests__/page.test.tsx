import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import CheckoutPage from '../page'
import { CartProvider } from '@/lib/cart-context'
import { Product } from '@/types/product'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock session
const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: '1',
}

// Mock cart state
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  description: 'Test description',
  image: '/test.jpg',
  images: ['/test.jpg'],
  category: 'test',
  rating: 0,
  reviews: 0,
  featured: false,
  colors: ['black'],
  inStock: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  sku: 'TEST-001',
  slug: 'test-product',
  specifications: {
    frameMaterial: 'Metal',
    lensMaterial: 'Polycarbonate',
    lensWidth: '50mm',
    bridgeWidth: '18mm',
    templeLength: '140mm',
    weight: '25g',
    uvProtection: 'UV400',
    polarization: true,
  },
  features: ['Feature 1', 'Feature 2'],
  careInstructions: ['Instruction 1', 'Instruction 2'],
  warranty: '1 year warranty',
  shipping: {
    freeShipping: true,
    estimatedDelivery: '3-5 business days',
    returnPolicy: '30 days return policy',
  },
}

const mockCartState = {
  items: [
    {
      product: mockProduct,
      quantity: 1,
    },
  ],
  isOpen: false,
  isLoading: false,
  error: null,
}

// Mock fetch
global.fetch = jest.fn()

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <SessionProvider session={mockSession}>
      <CartProvider>{component}</CartProvider>
    </SessionProvider>
  )
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the checkout page correctly', async () => {
    renderWithProviders(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Checkout' })).toBeInTheDocument()
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
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    renderWithProviders(<CheckoutPage />)

    // Fill in shipping details
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' },
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'New York' },
    })
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'NY' },
    })
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: '10001' },
    })
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'USA' },
    })

    // Fill in payment details
    fireEvent.change(screen.getByLabelText(/card number/i), {
      target: { value: '4242424242424242' },
    })
    fireEvent.change(screen.getByLabelText(/expiry/i), {
      target: { value: '12/25' },
    })
    fireEvent.change(screen.getByLabelText(/cvc/i), {
      target: { value: '123' },
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
      expect(screen.getByText('Phone number is required')).toBeInTheDocument()
      expect(screen.getByText('Address is required')).toBeInTheDocument()
      expect(screen.getByText('City is required')).toBeInTheDocument()
      expect(screen.getByText('State is required')).toBeInTheDocument()
      expect(screen.getByText('Postal code is required')).toBeInTheDocument()
      expect(screen.getByText('Country is required')).toBeInTheDocument()
      expect(screen.getByText('Card number is required')).toBeInTheDocument()
      expect(screen.getByText('Expiry date is required')).toBeInTheDocument()
      expect(screen.getByText('CVC is required')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to place order'))

    renderWithProviders(<CheckoutPage />)

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' },
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'New York' },
    })
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'NY' },
    })
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: '10001' },
    })
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'USA' },
    })
    fireEvent.change(screen.getByLabelText(/card number/i), {
      target: { value: '4242424242424242' },
    })
    fireEvent.change(screen.getByLabelText(/expiry/i), {
      target: { value: '12/25' },
    })
    fireEvent.change(screen.getByLabelText(/cvc/i), {
      target: { value: '123' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText('Failed to place order')).toBeInTheDocument()
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
}) 