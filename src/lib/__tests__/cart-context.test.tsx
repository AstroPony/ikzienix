import { render, screen, fireEvent } from '@testing-library/react'
import { CartProvider, useCart } from '../cart-context'
import { Product } from '@/types/product'

const mockProduct: Product = {
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

const mockProduct2: Product = {
  id: '2',
  name: 'Test Product 2',
  price: 149.99,
  image: '/test2.jpg',
  description: 'Test description 2',
  category: 'test',
  collection: 'test',
  inStock: true,
  rating: 4.0,
  reviews: 5,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  featured: true
}

// Test component that uses the cart context
function TestComponent() {
  const { state, dispatch } = useCart()
  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { product: mockProduct } })} data-testid="add-item">
        Add Item
      </button>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { product: mockProduct2 } })} data-testid="add-item-2">
        Add Item 2
      </button>
      <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { productId: mockProduct.id } })} data-testid="remove-item">
        Remove Item
      </button>
      <button onClick={() => dispatch({ type: 'TOGGLE_CART' })} data-testid="toggle-cart">
        Toggle Cart
      </button>
      <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: mockProduct.id, quantity: 2 } })} data-testid="update-quantity">
        Update Quantity
      </button>
      <div data-testid="cart-state">{JSON.stringify(state)}</div>
      <div data-testid="cart-total">
        {state.items.reduce((total, item) => total + item.product.price * item.quantity, 0)}
      </div>
    </div>
  )
}

describe('CartContext', () => {
  it('manages cart items correctly', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    // Add item
    fireEvent.click(screen.getByTestId('add-item'))
    let cartState = JSON.parse(screen.getByTestId('cart-state').textContent || '{}')
    expect(cartState.items).toHaveLength(1)
    expect(cartState.items[0].quantity).toBe(1)

    // Add same item again
    fireEvent.click(screen.getByTestId('add-item'))
    cartState = JSON.parse(screen.getByTestId('cart-state').textContent || '{}')
    expect(cartState.items).toHaveLength(1)
    expect(cartState.items[0].quantity).toBe(2)

    // Update quantity
    fireEvent.click(screen.getByTestId('update-quantity'))
    cartState = JSON.parse(screen.getByTestId('cart-state').textContent || '{}')
    expect(cartState.items[0].quantity).toBe(2)

    // Remove item
    fireEvent.click(screen.getByTestId('remove-item'))
    cartState = JSON.parse(screen.getByTestId('cart-state').textContent || '{}')
    expect(cartState.items).toHaveLength(0)
  })

  it('calculates total price correctly', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    fireEvent.click(screen.getByTestId('add-item'))
    expect(screen.getByTestId('cart-total').textContent).toBe('99.99')

    fireEvent.click(screen.getByTestId('add-item'))
    expect(screen.getByTestId('cart-total').textContent).toBe('199.98')

    fireEvent.click(screen.getByTestId('add-item-2'))
    expect(screen.getByTestId('cart-total').textContent).toBe('249.97')
  })

  it('toggles cart visibility', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    fireEvent.click(screen.getByTestId('toggle-cart'))
    let cartState = JSON.parse(screen.getByTestId('cart-state').textContent || '{}')
    expect(cartState.isOpen).toBe(true)

    fireEvent.click(screen.getByTestId('toggle-cart'))
    cartState = JSON.parse(screen.getByTestId('cart-state').textContent || '{}')
    expect(cartState.isOpen).toBe(false)
  })
}) 