import { render, screen } from '@testing-library/react'
import ProductCard from '../ProductCard'
import { WishlistProvider } from '@/context/WishlistContext'
import { CartProvider } from '@/lib/cart-context'
import { ComparisonProvider } from '@/lib/comparison-context'

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test-image.jpg',
  slug: 'test-product',
  description: 'Test description',
  category: 'test-category',
  inStock: true,
  sizes: ['S', 'M', 'L'],
  colors: ['Red', 'Blue'],
  rating: 4.5,
  reviews: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <CartProvider>
        <WishlistProvider>
          <ComparisonProvider>
            <ProductCard product={mockProduct} />
          </ComparisonProvider>
        </WishlistProvider>
      </CartProvider>
    )

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })
}) 