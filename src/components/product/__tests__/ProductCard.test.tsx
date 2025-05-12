import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'
import { CartProvider } from '@/lib/cart-context'
import { ComparisonProvider } from '@/lib/comparison-context'

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test.jpg',
  images: ['/test.jpg'],
  description: 'Test description',
  category: 'Test category',
  rating: 4.5,
  reviews: 0,
  featured: false,
  colors: ['Black', 'White'],
  inStock: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sku: 'TEST-001',
  slug: 'test-product',
  specifications: {
    frameMaterial: 'Metal',
    lensMaterial: 'Polycarbonate',
    lensWidth: '50mm',
    bridgeWidth: '18mm',
    templeLength: '145mm',
    weight: '30g',
    uvProtection: 'UV400',
    polarization: true
  },
  features: ['Feature 1', 'Feature 2'],
  careInstructions: ['Care 1', 'Care 2'],
  warranty: '1 year',
  shipping: {
    freeShipping: true,
    estimatedDelivery: '3-5 business days',
    returnPolicy: '30 days return policy'
  }
}

const outOfStockProduct: Product = {
  ...mockProduct,
  inStock: false
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

// Mock the addToCart function
jest.mock('@/lib/cart-context', () => ({
  ...jest.requireActual('@/lib/cart-context'),
  useCart: () => ({
    addToCart: jest.fn().mockResolvedValue(undefined)
  })
}))

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />)
    
    // Check basic product information
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument()
    
    // Check image
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', mockProduct.image)
    expect(image).toHaveAttribute('alt', mockProduct.name)
  })

  it('has a functional add to cart button', () => {
    renderWithProviders(<ProductCard product={mockProduct} />)
    
    const button = screen.getByRole('button', { name: /add to cart/i })
    expect(button).toBeEnabled()
    fireEvent.click(button)
    
    // After clicking, the button should show "Added to Cart"
    expect(screen.getByText('Added to Cart')).toBeInTheDocument()
  })

  it('handles out of stock products', () => {
    renderWithProviders(<ProductCard product={outOfStockProduct} />)
    
    const button = screen.getByRole('button', { name: /out of stock/i })
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Out of Stock')
  })
}) 