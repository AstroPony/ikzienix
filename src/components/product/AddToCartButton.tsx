'use client'

import { Product } from '@/types/product'
import { useCart } from '@/lib/cart-context'

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity: 1 }
    })
  }

  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={handleAddToCart}
      disabled={!product.inStock}
    >
      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
    </button>
  )
} 