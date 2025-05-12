import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import ProductPage from '../products/[slug]/page'
import { Product } from '@/types/product'
import { CartProvider } from '@/lib/cart-context'
import { ComparisonProvider } from '@/lib/comparison-context'
import { WishlistProvider } from '@/context/WishlistContext'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }),
  useParams: () => ({
    slug: 'test-product'
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
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  image: '/test-image.jpg',
  images: ['image1.jpg', 'image2.jpg'],
  slug: 'test-product',
  category: 'Test Category',
  rating: 4.5,
  reviews: 10,
  featured: false,
  inStock: true,
  colors: ['black', 'white'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sku: 'TEST-001',
  specifications: {
    frameMaterial: 'Metal',
    lensMaterial: 'Polycarbonate',
    lensWidth: '55mm',
    bridgeWidth: '18mm',
    templeLength: '145mm',
    weight: '25g',
    uvProtection: '100%',
    polarization: true
  },
  features: ['UV Protection', 'Polarized Lenses'],
  careInstructions: ['Clean with microfiber cloth', 'Store in case'],
  warranty: '2 years',
  shipping: {
    freeShipping: true,
    estimatedDelivery: '3-5 business days',
    returnPolicy: '30 days return policy'
  }
}

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockProduct)
  })
)

const mockOutOfStockProduct: Product = {
  ...mockProduct,
  id: '2',
  name: 'Out of Stock Product',
  slug: 'out-of-stock-product',
  inStock: false
}

const mockRelatedProducts: Product[] = [
  {
    ...mockProduct,
    id: '3',
    name: 'Related Product 1',
    slug: 'related-product-1',
    sku: 'TEST-002'
  },
  {
    ...mockProduct,
    id: '4',
    name: 'Related Product 2',
    slug: 'related-product-2',
    sku: 'TEST-003'
  }
]

const mockReviews = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Test User',
    rating: 5,
    comment: 'Great product!',
    createdAt: new Date().toISOString()
  }
]

// Mock the API functions
const mockGetProduct = jest.fn().mockResolvedValue(mockProduct)
const mockGetRelatedProducts = jest.fn().mockResolvedValue(mockRelatedProducts)
const mockGetReviews = jest.fn().mockResolvedValue(mockReviews)

jest.mock('@/lib/api', () => ({
  getProduct: () => mockGetProduct(),
  getRelatedProducts: () => mockGetRelatedProducts(),
  getReviews: () => mockGetReviews()
}))

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <SessionProvider session={mockSession}>
      <CartProvider>
        <ComparisonProvider>
          <WishlistProvider>
            {component}
          </WishlistProvider>
        </ComparisonProvider>
      </CartProvider>
    </SessionProvider>
  )
}

describe('ProductPage', () => {
  it('renders the product page correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ProductPage params={{ slug: 'test-product' }} />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })

  it('displays product details correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ProductPage params={{ slug: 'test-product' }} />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Test Category')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('10 reviews')).toBeInTheDocument()
    expect(screen.getByText('In Stock')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    )

    const { container } = render(
      <SessionProvider session={mockSession}>
        <ProductPage params={{ slug: 'test-product' }} />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Failed to load product')).toBeInTheDocument()
  })

  it('displays loading state', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ProductPage params={{ slug: 'test-product' }} />
      </SessionProvider>
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })

  it('handles add to cart', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ProductPage params={{ slug: 'test-product' }} />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)

    expect(screen.getByText('Added to cart')).toBeInTheDocument()
  })

  it('displays product specifications', async () => {
    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)

    // Wait for specifications to load
    await waitFor(() => {
      expect(screen.getByText('Specifications')).toBeInTheDocument()
    })

    // Check for specification details
    expect(screen.getByText('Frame Material: Metal')).toBeInTheDocument()
    expect(screen.getByText('Lens Material: Polycarbonate')).toBeInTheDocument()
    expect(screen.getByText('UV Protection: 100%')).toBeInTheDocument()
  })

  it('displays out of stock message', async () => {
    mockGetProduct.mockResolvedValueOnce(mockOutOfStockProduct)

    renderWithProviders(<ProductPage params={{ slug: 'out-of-stock-product' }} />)

    // Wait for out of stock message
    await waitFor(() => {
      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    })
  })

  it('displays related products', async () => {
    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)

    // Wait for related products to load
    await waitFor(() => {
      expect(screen.getByText('Related Products')).toBeInTheDocument()
    })
  })

  it('shows product reviews', async () => {
    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)

    // Wait for reviews to load
    await waitFor(() => {
      expect(screen.getByText('Reviews')).toBeInTheDocument()
    })
  })
}) 