'use client'

import { useCart } from '@/lib/cart-context'

export default function CartHeader() {
  const { dispatch } = useCart()

  return (
    <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Shopping Cart</h5>
      <button
        className="btn btn-link p-0"
        onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      >
        <i className="bi bi-x-lg"></i>
      </button>
    </div>
  )
} 