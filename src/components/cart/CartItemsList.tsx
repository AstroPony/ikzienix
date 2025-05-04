'use client'

import { useCart } from '@/lib/cart-context'
import CartItem from './CartItem'
import EmptyCart from './EmptyCart'

export default function CartItemsList() {
  const { state } = useCart()

  return (
    <div className="flex-grow-1 overflow-auto p-3">
      {state.items.length === 0 ? (
        <EmptyCart />
      ) : (
        state.items.map((item) => (
          <CartItem
            key={item.product.id}
            product={item.product}
            quantity={item.quantity}
          />
        ))
      )}
    </div>
  )
} 