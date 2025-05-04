'use client'

import { useCart } from '@/lib/cart-context'
import { Product } from '@/types/product'
import CartItemThumbnail from './CartItemThumbnail'
import CartItemDetails from './CartItemDetails'
import QuantityControls from './QuantityControls'
import RemoveItemButton from './RemoveItemButton'

interface CartItemProps {
  product: Product
  quantity: number
}

export default function CartItem({ product, quantity }: CartItemProps) {
  const { dispatch } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId: product.id, quantity: newQuantity }
    })
  }

  const handleRemove = () => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId: product.id }
    })
  }

  return (
    <div className="cart-item d-flex align-items-center py-3 border-bottom">
      <CartItemThumbnail product={product} />
      <CartItemDetails product={product} />
      <div className="d-flex align-items-center">
        <QuantityControls
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
        />
        <RemoveItemButton onClick={handleRemove} className="ms-3" />
      </div>
    </div>
  )
} 