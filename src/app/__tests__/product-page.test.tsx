import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CartProvider } from '@/lib/cart-context'
import ProductPage from '@/app/products/[id]/page'
import { Product } from '@/types/product'
import { act } from 'react'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' })
}))

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  image: '/test.jpg',
  category: 'test',
  collection: 'test',
  inStock: true,
  featured: false,
  rating: 5,
  reviews: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const mockRelatedProducts: Product[] = [
  {
    id: '2',
    name: 'Related Product 1',
    description: 'Related Description 1',
    price: 79.99,
    image: '/related1.jpg',
    category: 'test',
    collection: 'test',
    inStock: true,
    featured: false,
    rating: 4,
    reviews: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Related Product 2',
    description: 'Related Description 2',
    price: 89.99,
    image: '/related2.jpg',
    category: 'test',
    collection: 'test',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
]

describe('ProductPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders product details correctly', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/products/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProduct),
        })
      }
      if (url.includes('/api/products/related')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRelatedProducts),
        })
      }
      return Promise.reject(new Error('Not found'))
    })

    render(
      <CartProvider>
        <ProductPage />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByAltText('Test Product')).toBeInTheDocument()
  })

  it('shows loading state while fetching product', async () => {
    let resolveProduct: (value: any) => void
    let resolveRelated: (value: any) => void

    const productPromise = new Promise((resolve) => {
      resolveProduct = resolve
    })
    const relatedPromise = new Promise((resolve) => {
      resolveRelated = resolve
    })

    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/products/1')) {
        return Promise.resolve({
          ok: true,
          json: () => productPromise,
        })
      }
      if (url.includes('/api/products/related')) {
        return Promise.resolve({
          ok: true,
          json: () => relatedPromise,
        })
      }
      return Promise.reject(new Error('Not found'))
    })

    render(
      <CartProvider>
        <ProductPage />
      </CartProvider>
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveClass('spinner-border')

    await act(async () => {
      resolveProduct(mockProduct)
      resolveRelated(mockRelatedProducts)
    })

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
  })

  it('shows error message when product fetch fails', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })
    )

    render(
      <CartProvider>
        <ProductPage />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Error loading product')).toBeInTheDocument()
    })
    expect(screen.getByText('Return to Home')).toBeInTheDocument()
  })

  it('shows out of stock message when product is not available', async () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }

    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/products/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(outOfStockProduct),
        })
      }
      if (url.includes('/api/products/related')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRelatedProducts),
        })
      }
      return Promise.reject(new Error('Not found'))
    })

    render(
      <CartProvider>
        <ProductPage />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument()
    })
  })
}) 