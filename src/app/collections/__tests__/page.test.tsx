import { render, screen, waitFor } from '@testing-library/react'
import CollectionsPage from '../page'

const mockCollections = [
  {
    id: '1',
    name: 'Summer Collection',
    category: 'summer',
    image: '/images/summer.jpg',
    description: 'Latest summer styles',
  },
  {
    id: '2',
    name: 'Winter Collection',
    category: 'winter',
    image: '/images/winter.jpg',
    description: 'Cozy winter wear',
  },
]

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify(mockCollections), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  )
)

describe('CollectionsPage', () => {
  test.skip('renders the collections page correctly', async () => {
    render(<CollectionsPage />)

    await waitFor(() => {
      expect(screen.getByText('Collections')).toBeInTheDocument()
    })
  })

  test.skip('displays collections data', async () => {
    render(<CollectionsPage />)

    await waitFor(() => {
      expect(screen.getByText('summer Collection')).toBeInTheDocument()
      expect(screen.getByText('winter Collection')).toBeInTheDocument()
      expect(screen.getByText('Browse our selection of summer sunglasses.')).toBeInTheDocument()
      expect(screen.getByText('Browse our selection of winter sunglasses.')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch'))
    )

    render(<CollectionsPage />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading collections...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Error loading collections')).toBeInTheDocument()
  })
}) 