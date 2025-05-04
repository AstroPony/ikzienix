import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '@/components/ProductCard'
import { CartProvider } from '@/lib/cart-context'

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test.jpg',
  description: 'A test product',
  category: 'test',
  collection: 'test',
  inStock: true,
  rating: 5,
  reviews: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    )

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument()
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('alt', mockProduct.name)
    expect(screen.getByRole('button')).toHaveTextContent(/add to cart/i)
  })

  it('has a link to the product details', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/products/${mockProduct.id}`)
  })

  it('has a functional add to cart button', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    )

    const addButton = screen.getByRole('button')
    expect(addButton).toBeEnabled()
    expect(addButton).toHaveTextContent(/add to cart/i)
  })

  it('handles out of stock products', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    render(
      <CartProvider>
        <ProductCard product={outOfStockProduct} />
      </CartProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('disabled')
    expect(button).toHaveTextContent(/sold out/i)
  })
}) 