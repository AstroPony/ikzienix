import { render, screen, fireEvent } from '@testing-library/react'
import CompareButton from '../CompareButton'
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

const renderWithProvider = (component: React.ReactNode) =>
  render(<ComparisonProvider>{component}</ComparisonProvider>)

describe('CompareButton', () => {
  it('shows correct initial state and toggles on click', () => {
    renderWithProvider(<CompareButton product={mockProduct} />)
    
    // Initial state - button should show "Compare" text
    const button = screen.getByRole('button', { name: /compare/i })
    expect(button).toBeInTheDocument()
    
    // Click to add to comparison
    fireEvent.click(button)
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
    
    // Click again to remove from comparison
    fireEvent.click(screen.getByRole('button', { name: /remove/i }))
    expect(screen.getByRole('button', { name: /compare/i })).toBeInTheDocument()
  })
}) 