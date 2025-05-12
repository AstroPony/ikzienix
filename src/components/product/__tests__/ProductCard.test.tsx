import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../ProductCard'
import { CartProvider } from '@/lib/cart-context'
import { ComparisonProvider } from '@/lib/comparison-context'

const mockProduct = {
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

const mockDispatch = jest.fn()

jest.mock('@/lib/cart-context', () => ({
  ...jest.requireActual('@/lib/cart-context'),
  useCart: () => ({
    dispatch: mockDispatch,
    state: { items: [] }
  })
}))

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <CartProvider>
      <ComparisonProvider>
        {component}
      </ComparisonProvider>
    </CartProvider>
  )
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('Test category')).toBeInTheDocument()
    expect(screen.getByAltText('Test Product')).toHaveAttribute('src', '/test.jpg')
  })

  it('has a functional add to cart button', () => {
    renderWithProviders(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByText('Add to Cart')
    fireEvent.click(addToCartButton)
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_ITEM',
      payload: { product: mockProduct }
    })
  })

  it('handles out of stock products', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    renderWithProviders(<ProductCard product={outOfStockProduct} />)
    
    const button = screen.getByText('Out of Stock')
    expect(button).toBeDisabled()
  })
}) 