import { render, screen, fireEvent } from '@testing-library/react'
import Cart from '@/components/Cart'
import { CartProvider, useCart } from '@/lib/cart-context'

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test.jpg',
  description: 'Test description',
  category: 'test',
  collection: 'test',
  inStock: true,
  rating: 4.5,
  reviews: 10,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  featured: false
}

function TestComponent({ children }: { children: React.ReactNode }) {
  const { dispatch } = useCart()
  return (
    <>
      <button onClick={() => dispatch({ type: 'TOGGLE_CART' })} data-testid="toggle-cart">
        Toggle Cart
      </button>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { product: mockProduct } })} data-testid="add-item">
        Add Item
      </button>
      {children}
    </>
  )
}

describe('Cart', () => {
  it('displays empty cart message when no items', () => {
    render(
      <CartProvider>
        <TestComponent>
          <Cart />
        </TestComponent>
      </CartProvider>
    )
    fireEvent.click(screen.getByTestId('toggle-cart'))
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('displays cart items and handles quantity updates', () => {
    render(
      <CartProvider>
        <TestComponent>
          <Cart />
        </TestComponent>
      </CartProvider>
    )

    fireEvent.click(screen.getByTestId('toggle-cart'))
    fireEvent.click(screen.getByTestId('add-item'))

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
    expect(screen.getAllByText(`$${mockProduct.price}`)).toHaveLength(2) // Price shown in item and total

    const increaseButton = screen.getByRole('button', { name: '+' })
    fireEvent.click(increaseButton)
    expect(screen.getByRole('spinbutton')).toHaveValue(2)

    const decreaseButton = screen.getByRole('button', { name: '-' })
    fireEvent.click(decreaseButton)
    expect(screen.getByRole('spinbutton')).toHaveValue(1)
  })

  it('removes item and updates total', () => {
    render(
      <CartProvider>
        <TestComponent>
          <Cart />
        </TestComponent>
      </CartProvider>
    )

    fireEvent.click(screen.getByTestId('toggle-cart'))
    fireEvent.click(screen.getByTestId('add-item'))

    const removeButton = screen.getByRole('button', { name: '' }) // Trash icon button
    fireEvent.click(removeButton)
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('displays correct total price', () => {
    render(
      <CartProvider>
        <TestComponent>
          <Cart />
        </TestComponent>
      </CartProvider>
    )

    fireEvent.click(screen.getByTestId('toggle-cart'))
    fireEvent.click(screen.getByTestId('add-item'))
    fireEvent.click(screen.getByTestId('add-item'))

    const prices = screen.getAllByText(`$${mockProduct.price * 2}`)
    expect(prices).toHaveLength(1) // Only in the total
  })
}) 