'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product
      }
    })
  }

  return (
    <div className="h-100">
      <Link href={`/products/${product.id}`} className="text-decoration-none">
        <div className="card h-100 border-0 shadow-sm">
          <div className="position-relative" style={{ aspectRatio: '1/1' }}>
            <Image
              src={product.image}
              alt={product.name}
              className="card-img-top object-fit-cover"
              fill={true}
              sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div className="card-body">
            <h3 className="h6 card-title mb-1">{product.name}</h3>
            <p className="text-muted small mb-2">{product.category}</p>
            <p className="h6 mb-0">${product.price.toFixed(2)}</p>
            <button
              onClick={handleAddToCart}
              className="btn btn-dark w-100 mt-3"
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
} 