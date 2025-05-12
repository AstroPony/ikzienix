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

describe('ProductPage', () => {
  it('renders the product page correctly', async () => {
    render(<ProductPage params={{ slug: 'test-product' }} />)
    const productName = await screen.findByText('Test Product')
    expect(productName).toBeInTheDocument()
  })
}) 