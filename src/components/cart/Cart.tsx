'use client'

import { useCart } from '@/lib/cart-context'
import CartOverlay from './CartOverlay'
import CartHeader from './CartHeader'
import CartFooter from './CartFooter'
import CartItemsList from './CartItemsList'

export default function Cart() {
  const { state } = useCart()

  if (!state.isOpen) return null

  const subtotal = state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  return (
    <>
      <CartOverlay />
      <div className="cart position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: '400px', zIndex: 1050 }}>
        <div className="d-flex flex-column h-100">
          <CartHeader />
          <CartItemsList />
          {state.items.length > 0 && <CartFooter subtotal={subtotal} />}
        </div>
      </div>
    </>
  )
} 