'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { Product } from '@/types/product'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()
  const [imageError, setImageError] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product
      }
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setWishlisted((prev) => !prev)
  }

  return (
    <div className="h-100 position-relative">
      {/* Floating icon buttons */}
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 8, zIndex: 2 }}>
        <button
          onClick={handleAddToCart}
          className="btn btn-light btn-sm border-0"
          aria-label={`Quick add ${product.name} to cart`}
          disabled={!product.inStock}
        >
          <i className="bi bi-cart-plus fs-5"></i>
        </button>
        <button
          onClick={handleWishlist}
          className="btn btn-light btn-sm border-0"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          {wishlisted ? (
            <i className="bi bi-heart-fill fs-5 text-danger"></i>
          ) : (
            <i className="bi bi-heart fs-5"></i>
          )}
        </button>
      </div>
      <Link href={`/products/${product.id}`} className="text-decoration-none">
        <div className="card h-100 border-0 shadow-sm">
          <div className="position-relative" style={{ aspectRatio: '1/1' }}>
            <Image
              src={imageError ? '/placeholder.png' : product.image}
              alt={product.name}
              className="card-img-top object-fit-cover"
              fill
              sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
          <div className="card-body">
            <h3 className="h6 card-title mb-1">{product.name}</h3>
            <p className="text-muted small mb-2">{product.category}</p>
            <p className="h6 mb-0">${product.price.toFixed(2)}</p>
          </div>
        </div>
      </Link>
    </div>
  )
} 