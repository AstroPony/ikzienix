'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types/product'
import { useCart } from '@/hooks/useCart'
import { useComparison } from '@/hooks/useComparison'
import { useWishlist } from '@/hooks/useWishlist'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart()
  const { addToComparison, isInComparison } = useComparison()
  const { addToWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = async () => {
    const defaultColor = product.colors.length > 0 ? product.colors[0] : 'Default'
    await addToCart(product.id, defaultColor)
  }

  const handleAddToComparison = () => {
    addToComparison(product)
  }

  const handleAddToWishlist = () => {
    addToWishlist(product)
  }

  return (
    <div className="product-card">
      <Link href={`/products/${product.slug}`} className="text-decoration-none">
        <div className="position-relative ratio ratio-1x1 rounded-3 overflow-hidden mb-3">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            fill
            className="object-fit-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.sale && (
            <span className="position-absolute top-0 start-0 badge bg-danger m-2">Sale</span>
          )}
          {product.new && (
            <span className="position-absolute top-0 end-0 badge bg-primary m-2">New</span>
          )}
        </div>
        <h3 className="h6 mb-2 text-dark">{product.name}</h3>
        <div className="d-flex align-items-center mb-2">
          <div className="text-warning me-2">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}`}
              />
            ))}
          </div>
          <span className="text-muted small">({product.reviewCount})</span>
        </div>
        <div className="mb-3">
          {product.sale ? (
            <div>
              <span className="text-decoration-line-through text-muted me-2">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-danger">${product.salePrice?.toFixed(2)}</span>
            </div>
          ) : (
            <span>${product.price.toFixed(2)}</span>
          )}
        </div>
      </Link>
      <div className="d-grid gap-2">
        <button
          className="btn btn-primary"
          onClick={handleAddToCart}
          disabled={isAddingToCart || !product.inStock}
        >
          {isAddingToCart ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Adding...
            </>
          ) : product.inStock ? (
            'Add to Cart'
          ) : (
            'Out of Stock'
          )}
        </button>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary flex-grow-1"
            onClick={handleAddToComparison}
            disabled={isInComparison(product.id)}
          >
            {isInComparison(product.id) ? 'In Comparison' : 'Compare'}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleAddToWishlist}
            disabled={isInWishlist(product.id)}
          >
            <i className={`bi bi-heart${isInWishlist(product.id) ? '-fill' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  )
} 