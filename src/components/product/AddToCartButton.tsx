'use client'

import { Product } from '@/types/product'
import { useCart } from '@/lib/cart-context'

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const { dispatch } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({
      type: 'ADD_ITEM',
      payload: { product }
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