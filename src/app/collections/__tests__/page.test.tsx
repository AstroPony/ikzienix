import { render, screen, waitFor } from '@testing-library/react'
import CollectionsPage from '../page'
import { Product } from '@/types/product'

// Mock the fetch function
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Test Collection',
    description: 'Test Description',
    price: 99.99,
    image: '/test-image.jpg',
    images: ['/test-image.jpg'],
    category: 'test',
    rating: 4.5,
    reviews: 0,
    featured: false,
    colors: ['black'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sku: 'TEST-001',
    slug: 'test-collection',
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
]

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockProducts)
  })
)

describe('CollectionsPage', () => {
  it('renders the Collections page correctly', async () => {
    render(<CollectionsPage />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Collections')).toBeInTheDocument()
    })
    
    // Check for collection name and description
    expect(screen.getByText('Test Collection')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    // Mock fetch to return error
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.reject(new Error('Failed to fetch'))
      })
    )

    render(<CollectionsPage />)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
    })

    expect(screen.getByText('Failed to load collections')).toBeInTheDocument()
  })

  it('displays collection details', async () => {
    render(<CollectionsPage />)

    // Wait for collection details to load
    await waitFor(() => {
      expect(screen.getByText('Test Collection')).toBeInTheDocument()
    })

    // Check for price
    expect(screen.getByText('$99.99')).toBeInTheDocument()

    // Check for features
    expect(screen.getByText('UV Protection')).toBeInTheDocument()
    expect(screen.getByText('Polarized Lenses')).toBeInTheDocument()

    // Check for shipping info
    expect(screen.getByText('Free Shipping')).toBeInTheDocument()
    expect(screen.getByText('3-5 business days')).toBeInTheDocument()
  })
}) 