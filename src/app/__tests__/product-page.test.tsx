import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import ProductPage from '../products/[slug]/page'
import { Product } from '@/types/product'
import { CartProvider } from '@/lib/cart-context'
import { ComparisonProvider } from '@/lib/comparison-context'
import { WishlistProvider } from '@/context/WishlistContext'
import { getProduct } from '@/lib/api'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({
    slug: 'test-product'
  }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    notFound: jest.fn(),
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
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      images: ['/images/test.jpg'],
      category: 'Test Category',
      stock: 10
    })
  })
)

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  description: 'Test Description',
  price: 100,
  images: ['/images/test.jpg'],
  category: 'Test Category',
  stock: 10,
  inStock: true,
  sku: 'TEST-001',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

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

// Mock the product components
jest.mock('@/components/product/ProductGallery', () => {
  return function MockProductGallery() {
    return <div data-testid="product-gallery">Product Gallery</div>
  }
})

jest.mock('@/components/product/ProductSpecifications', () => {
  return function MockProductSpecifications() {
    return <div data-testid="product-specifications">Product Specifications</div>
  }
})

jest.mock('@/components/product/ProductFeatures', () => {
  return function MockProductFeatures() {
    return <div data-testid="product-features">Product Features</div>
  }
})

jest.mock('@/components/product/ProductReviews', () => {
  return function MockProductReviews() {
    return <div data-testid="product-reviews">Product Reviews</div>
  }
})

jest.mock('@/components/product/RelatedProducts', () => {
  return function MockRelatedProducts() {
    return <div data-testid="related-products">Related Products</div>
  }
})

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

const mockParams = {
  slug: 'test-product'
}

describe('ProductPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getProduct as jest.Mock).mockResolvedValue(mockProduct)
  })

  it('renders product details correctly', async () => {
    render(<ProductPage params={{ slug: 'test-product' }} />)

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('$99.99')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByTestId('product-gallery')).toBeInTheDocument()
      expect(screen.getByTestId('product-specifications')).toBeInTheDocument()
      expect(screen.getByTestId('product-features')).toBeInTheDocument()
      expect(screen.getByTestId('product-reviews')).toBeInTheDocument()
      expect(screen.getByTestId('related-products')).toBeInTheDocument()
    })
  })

  it('handles product not found', async () => {
    ;(getProduct as jest.Mock).mockResolvedValue(null)

    render(<ProductPage params={{ slug: 'non-existent-product' }} />)

    await waitFor(() => {
      expect(require('next/navigation').notFound).toHaveBeenCalled()
    })
  })

  it('handles error state', async () => {
    ;(getProduct as jest.Mock).mockRejectedValue(new Error('Failed to fetch product'))

    render(<ProductPage params={{ slug: 'test-product' }} />)

    await waitFor(() => {
      expect(screen.getByText('Error loading product')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })
  })

  it('handles add to cart', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ProductPage params={mockParams} />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)

    await waitFor(() => {
      expect(screen.getByText('Added to cart')).toBeInTheDocument()
    })
  })

  it('handles out of stock state', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          price: 100,
          images: ['/images/test.jpg'],
          category: 'Test Category',
          stock: 0
        })
      })
    )

    const { container } = render(
      <SessionProvider session={mockSession}>
        <ProductPage params={mockParams} />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('displays product details correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ProductPage params={mockParams} />
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

  it('displays loading state', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ProductPage params={mockParams} />
      </SessionProvider>
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })

  it('displays product specifications', async () => {
    renderWithProviders(<ProductPage params={mockParams} />)

    // Wait for specifications to load
    await waitFor(() => {
      expect(screen.getByText('Specifications')).toBeInTheDocument()
    })

    // Check for specification details
    expect(screen.getByText('Frame Material: Metal')).toBeInTheDocument()
    expect(screen.getByText('Lens Material: Polycarbonate')).toBeInTheDocument()
    expect(screen.getByText('UV Protection: 100%')).toBeInTheDocument()
  })

  it('displays related products', async () => {
    renderWithProviders(<ProductPage params={mockParams} />)

    // Wait for related products to load
    await waitFor(() => {
      expect(screen.getByText('Related Products')).toBeInTheDocument()
    })
  })

  it('shows product reviews', async () => {
    renderWithProviders(<ProductPage params={mockParams} />)

    // Wait for reviews to load
    await waitFor(() => {
      expect(screen.getByText('Reviews')).toBeInTheDocument()
    })
  })

  it('renders product details', async () => {
    render(
      <SessionProvider session={null}>
        <ProductPage params={mockParams} />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/test product/i)).toBeInTheDocument()
    })
  })
}) 