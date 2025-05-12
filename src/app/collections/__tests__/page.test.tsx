import { render, screen, waitFor } from '@testing-library/react'
import CollectionsPage from '../page'

// Mock fetch
const mockProducts = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 100,
    images: ['image1.jpg'],
    category: 'Category 1'
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    price: 200,
    images: ['image2.jpg'],
    category: 'Category 2'
  }
]

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockProducts)
  })
)

describe('CollectionsPage', () => {
  it('renders the collections page correctly', async () => {
    const { container } = render(<CollectionsPage />)

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Collections')).toBeInTheDocument()
    expect(screen.getByText('Browse our collections')).toBeInTheDocument()
  })

  it('displays products correctly', async () => {
    const { container } = render(<CollectionsPage />)

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getByText('$200.00')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    )

    const { container } = render(<CollectionsPage />)

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Failed to load products')).toBeInTheDocument()
  })

  it('displays loading state', async () => {
    const { container } = render(<CollectionsPage />)

    expect(container).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })

  it('displays empty state when no products', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )

    const { container } = render(<CollectionsPage />)

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('No products found')).toBeInTheDocument()
  })
}) 