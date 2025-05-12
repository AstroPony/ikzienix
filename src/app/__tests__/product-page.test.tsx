import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import ProductPage from '../products/[slug]/page'
import { Product } from '@/types/product'
import { CartProvider } from '@/lib/cart-context'
import { ComparisonProvider } from '@/lib/comparison-context'
import { WishlistProvider } from '@/context/WishlistContext'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({
    slug: 'test-product'
  })
}))

// Define mock product before using it
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  image: '/test-image.jpg',
  images: ['/test-image.jpg'],
  slug: 'test-product',
  category: 'test',
  rating: 4.5,
  reviews: 0,
  featured: false,
  colors: ['Black', 'Brown'],
  inStock: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sku: 'TEST-001',
  specifications: {
    frameMaterial: 'Test Frame',
    lensMaterial: 'Test Lens',
    lensWidth: '50mm',
    bridgeWidth: '18mm',
    templeLength: '145mm',
    weight: '25g',
    uvProtection: 'UV400',
    polarization: true
  },
  features: ['Feature 1', 'Feature 2'],
  careInstructions: ['Care 1', 'Care 2'],
  warranty: '1 year',
  shipping: {
    freeShipping: true,
    estimatedDelivery: '3-5 days',
    returnPolicy: '30 days return policy'
  }
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

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <CartProvider>
      <ComparisonProvider>
        <WishlistProvider>
          {component}
        </WishlistProvider>
      </ComparisonProvider>
    </CartProvider>
  )
}

describe('ProductPage', () => {
  it('renders the product page correctly', async () => {
    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
    
    // Check for product details
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })

  it('displays product specifications', async () => {
    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)

    // Wait for specifications to load
    await waitFor(() => {
      expect(screen.getByText('Specifications')).toBeInTheDocument()
    })

    // Check for specification details
    expect(screen.getByText('Frame Material: Test Frame')).toBeInTheDocument()
    expect(screen.getByText('Lens Material: Test Lens')).toBeInTheDocument()
    expect(screen.getByText('UV Protection: UV400')).toBeInTheDocument()
  })

  it('shows out of stock message for unavailable products', async () => {
    // Update mock to return out of stock product
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

    // Check for related product names
    expect(screen.getByText('Related Product 1')).toBeInTheDocument()
    expect(screen.getByText('Related Product 2')).toBeInTheDocument()
  })

  it('shows product reviews', async () => {
    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)

    // Wait for reviews to load
    await waitFor(() => {
      expect(screen.getByText('Reviews')).toBeInTheDocument()
    })

    // Check for review details
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Great product!')).toBeInTheDocument()
    expect(screen.getByText('5.0')).toBeInTheDocument()
  })
}) 