'use client'

import { useCart } from '@/lib/cart-context'

export default function CartOverlay() {
  const { state, dispatch } = useCart()

  if (!state.isOpen) return null

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
      style={{ zIndex: 1040 }}
      onClick={() => dispatch({ type: 'TOGGLE_CART' })}
    />
  )
} 