// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'test-product' })
}))

// Temporary placeholder for mockProduct, will be overwritten below
let mockProduct: any = {}

// Mock the getProduct function (after mockProduct is defined)
jest.mock('@/lib/api', () => ({
  getProduct: jest.fn(() => Promise.resolve(mockProduct))
}))

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CartProvider } from '@/lib/cart-context'
import ProductPage from '../products/[slug]/page'
import { Product } from '@/types'
import { act } from 'react'
import { ComparisonProvider } from '@/lib/comparison-context'

mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test.jpg',
  images: ['/test.jpg'],
  description: 'Test description',
  category: 'Test category',
  rating: 4.5,
  reviews: 10,
  featured: false,
  colors: ['black'],
  inStock: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  sku: 'TEST-001',
  slug: 'test-product',
  specifications: {
    frameMaterial: 'Test material',
    lensMaterial: 'Test lens',
    lensWidth: '50mm',
    bridgeWidth: '18mm',
    templeLength: '145mm',
    weight: '25g',
    uvProtection: 'UV400',
    polarization: true
  },
  features: ['Feature 1', 'Feature 2'],
  careInstructions: ['Instruction 1', 'Instruction 2'],
  warranty: '1 year warranty',
  shipping: {
    freeShipping: true,
    estimatedDelivery: '3-5 business days',
    returnPolicy: '30 days return policy'
  }
}

const mockOutOfStockProduct: Product = {
  ...mockProduct,
  inStock: false
}

const mockRelatedProducts: Product[] = [
  {
    ...mockProduct,
    id: '2',
    name: 'Related Product 1',
    slug: 'related-product-1',
    sku: 'TEST-002'
  },
  {
    ...mockProduct,
    id: '3',
    name: 'Related Product 2',
    slug: 'related-product-2',
    sku: 'TEST-003'
  }
]

const mockReviews = {
  stats: {
    average: 4.5,
    total: 10,
    distribution: {
      5: 6,
      4: 3,
      3: 1,
      2: 0,
      1: 0
    }
  },
  reviews: [
    {
      id: '1',
      userId: 'user1',
      productId: '1',
      rating: 5,
      comment: 'Great product!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
}

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <CartProvider>
      <ComparisonProvider>
        {component}
      </ComparisonProvider>
    </CartProvider>
  )
}

describe.skip('ProductPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders the product page correctly', async () => {
    render(<ProductPage params={{ slug: 'test-product' }} />)
    
    // Wait for the product to load
    const productName = await screen.findByText('Test Product')
    expect(productName).toBeInTheDocument()
    
    // Check for other product details
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Test category')).toBeInTheDocument()
  })

  it('renders product details correctly', async () => {
    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)
    
    await waitFor(() => {
      // Check basic product information
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
      expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument()
      
      // Check image
      const image = screen.getByAltText(mockProduct.name)
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', mockProduct.image)
      
      // Check specifications
      expect(screen.getByText('Specifications')).toBeInTheDocument()
      expect(screen.getByText(mockProduct.specifications.frameMaterial)).toBeInTheDocument()
      
      // Check features
      expect(screen.getByText('Features')).toBeInTheDocument()
      mockProduct.features.forEach((feature: string) => {
        expect(screen.getByText(feature)).toBeInTheDocument()
      })
    })
  })

  it('shows loading state while fetching product', async () => {
    let resolveProduct: (value: any) => void
    let resolveRelated: (value: any) => void

    const productPromise = new Promise((resolve) => {
      resolveProduct = resolve
    })
    const relatedPromise = new Promise((resolve) => {
      resolveRelated = resolve
    })

    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/products/test-product')) {
        return Promise.resolve({
          ok: true,
          json: () => productPromise,
        })
      }
      if (url.includes('/api/products/related')) {
        return Promise.resolve({
          ok: true,
          json: () => relatedPromise,
        })
      }
      return Promise.reject(new Error('Not found'))
    })

    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)

    expect(screen.getByRole('status')).toBeInTheDocument()

    await act(async () => {
      resolveProduct(mockProduct)
      resolveRelated(mockRelatedProducts)
    })

    await waitFor(() => {
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
    })
  })

  it('shows error message when product fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))

    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)

    await waitFor(() => {
      expect(screen.getByText('Error loading product')).toBeInTheDocument()
    })
  })

  it('shows out of stock message when product is not available', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockOutOfStockProduct)
    })
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockReviews)
    })

    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)
    
    await waitFor(() => {
      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    })
  })

  it('displays product information when loaded successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProduct)
    })
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockReviews)
    })

    renderWithProviders(<ProductPage params={{ slug: 'test-product' }} />)
    
    await waitFor(() => {
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
      expect(screen.getByText(mockProduct.description)).toBeInTheDocument()
      expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument()
      expect(screen.getByAltText(mockProduct.name)).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    render(<ProductPage params={{ slug: 'test-product' }} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error message when product is not found', async () => {
    // Mock the getProduct function to reject
    jest.spyOn(require('@/lib/api'), 'getProduct').mockRejectedValueOnce(new Error('Product not found'))
    
    render(<ProductPage params={{ slug: 'non-existent' }} />)
    
    const errorMessage = await screen.findByText('Product not found')
    expect(errorMessage).toBeInTheDocument()
  })
}) 