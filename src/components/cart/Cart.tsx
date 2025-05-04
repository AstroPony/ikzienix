'use client'

import { useCart } from '@/lib/cart-context'
import CartOverlay from './CartOverlay'
import CartHeader from './CartHeader'
import CartFooter from './CartFooter'
import CartItemsList from './CartItemsList'
import { useState } from 'react'

export default function Cart() {
  const { state } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  if (!state.isOpen) return null

  const subtotal = state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement checkout logic
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CartOverlay />
      <div className="cart position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: '400px', zIndex: 1050 }}>
        <div className="d-flex flex-column h-100">
          <CartHeader />
          <CartItemsList />
          {state.items.length > 0 && (
            <CartFooter 
              subtotal={subtotal} 
              onCheckout={handleCheckout}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </>
  )
} 