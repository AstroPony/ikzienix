import { render, screen, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import CollectionsPage from '../page'
import { Product } from '@/types/product'

// Mock the fetch function
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'test Collection',
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

// Mock fetch
global.fetch = jest.fn()

// Mock session
const mockSession = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com'
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString()
}

describe('CollectionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the Collections page correctly', async () => {
    // Mock successful fetch
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        name: 'Test Collection',
        description: 'Test Description',
        price: 99.99,
        features: ['Feature 1', 'Feature 2'],
        shipping: {
          method: 'standard',
          cost: 5.99,
          estimatedDays: '3-5'
        }
      })
    })

    render(
      <SessionProvider session={mockSession}>
        <CollectionsPage />
      </SessionProvider>
    )

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading collections/i)).not.toBeInTheDocument()
    })

    // Check for collection name and description
    expect(screen.getByText(/test collection/i)).toBeInTheDocument()
    expect(screen.getByText(/test description/i)).toBeInTheDocument()
  })

  it('handles error state', async () => {
    // Mock failed fetch
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'))

    render(
      <SessionProvider session={mockSession}>
        <CollectionsPage />
      </SessionProvider>
    )

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/error loading collections/i)).toBeInTheDocument()
    })
  })

  it('displays collection details', async () => {
    // Mock successful fetch
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        name: 'Test Collection',
        description: 'Test Description',
        price: 99.99,
        features: ['Feature 1', 'Feature 2'],
        shipping: {
          method: 'standard',
          cost: 5.99,
          estimatedDays: '3-5'
        }
      })
    })

    render(
      <SessionProvider session={mockSession}>
        <CollectionsPage />
      </SessionProvider>
    )

    // Wait for collection details to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading collections/i)).not.toBeInTheDocument()
    })

    // Check for collection details
    expect(screen.getByText(/test collection/i)).toBeInTheDocument()
    expect(screen.getByText(/test description/i)).toBeInTheDocument()
    expect(screen.getByText(/\$99.99/i)).toBeInTheDocument()
    expect(screen.getByText(/feature 1/i)).toBeInTheDocument()
    expect(screen.getByText(/feature 2/i)).toBeInTheDocument()
    expect(screen.getByText(/standard shipping/i)).toBeInTheDocument()
    expect(screen.getByText(/\$5.99/i)).toBeInTheDocument()
    expect(screen.getByText(/3-5 days/i)).toBeInTheDocument()
  })
}) 