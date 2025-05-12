import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '@/components/ProductCard'
import { CartProvider } from '@/lib/cart-context'
import { ComparisonProvider } from '@/lib/comparison-context'
import { Product } from '@/types/product'

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

const outOfStockProduct = {
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

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument()
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument()
    expect(screen.getByAltText(mockProduct.name)).toBeInTheDocument()
  })

  it('handles add to cart functionality', () => {
    renderWithProviders(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByRole('button', { name: 'Add to Cart' })
    expect(addToCartButton).toBeInTheDocument()
    fireEvent.click(addToCartButton)
    
    // After clicking, the button should still be "Add to Cart" as the state is managed by the cart context
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument()
  })

  it('handles out of stock products', () => {
    renderWithProviders(<ProductCard product={outOfStockProduct} />)
    
    const outOfStockButton = screen.getByRole('button', { name: 'Out of Stock' })
    expect(outOfStockButton).toBeInTheDocument()
    expect(outOfStockButton).toBeDisabled()
  })
}) 