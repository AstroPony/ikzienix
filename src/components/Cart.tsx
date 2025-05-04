'use client'

import { useCart } from '@/lib/cart-context'
import CartItem from './cart/CartItem'
import CartFooter from './cart/CartFooter'
import EmptyCart from './cart/EmptyCart'

export default function Cart() {
  const { state, dispatch } = useCart()
  const { items, isOpen, isLoading, error } = state

  if (!isOpen) return null

  const subtotal = items.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity
  }, 0)

  const handleCheckout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      dispatch({ type: 'CLEAR_CART' })
      dispatch({ type: 'TOGGLE_CART' })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to process checkout' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h5 className="mb-0">Shopping Cart</h5>
        <button
          className="btn-close"
          onClick={() => dispatch({ type: 'TOGGLE_CART' })}
          aria-label="Close cart"
        />
      </div>

      <div className="cart-content">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <CartItem
                  key={item.product?.id}
                  product={item.product}
                  quantity={item.quantity}
                />
              ))}
            </div>

            <CartFooter
              subtotal={subtotal}
              onCheckout={handleCheckout}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  )
} 