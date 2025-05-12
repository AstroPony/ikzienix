import { render, screen, fireEvent } from '@testing-library/react'
import CompareButton from '../CompareButton'
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

jest.mock('@/lib/comparison-context', () => ({
  ...jest.requireActual('@/lib/comparison-context'),
  useComparison: () => ({
    addToComparison: jest.fn(),
    removeFromComparison: jest.fn(),
    isInComparison: jest.fn().mockReturnValue(false),
    state: { items: [] }
  })
}))

const renderWithProvider = (component: React.ReactNode) => {
  return render(
    <ComparisonProvider>
      {component}
    </ComparisonProvider>
  )
}

describe('CompareButton', () => {
  it('renders the CompareButton correctly', () => {
    renderWithProvider(<CompareButton product={mockProduct} />)
    const button = screen.getByTitle('Add to comparison')
    expect(button).toBeInTheDocument()
  })
}) 