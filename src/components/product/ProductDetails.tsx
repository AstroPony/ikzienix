'use client'

import { useState } from 'react'
import { Product } from '@/types/product'
import ProductGallery from './ProductGallery'
import ProductSpecifications from './ProductSpecifications'
import ProductReviews from './ProductReviews'
import RelatedProducts from './RelatedProducts'
import { useCart } from '@/hooks/useCart'
import { useComparison } from '@/hooks/useComparison'
import { useWishlist } from '@/hooks/useWishlist'

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const { addToCart, isAddingToCart } = useCart()
  const { addToComparison, isInComparison } = useComparison()
  const { addToWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = async () => {
    await addToCart(product.id, selectedColor)
  }

  const handleAddToComparison = () => {
    addToComparison(product)
  }

  const handleAddToWishlist = () => {
    addToWishlist(product)
  }

  return (
    <div className="product-details">
      <div className="row">
        <div className="col-md-6">
          <ProductGallery images={product.images} productName={product.name} />
        </div>
        <div className="col-md-6">
          <div className="product-info">
            <h1 className="h2 mb-2">{product.name}</h1>
            <div className="d-flex align-items-center mb-3">
              <div className="text-warning me-2">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}`}
                  />
                ))}
              </div>
              <span className="text-muted">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
            <div className="mb-3">
              {product.sale ? (
                <div>
                  <span className="text-decoration-line-through text-muted me-2">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="h3 text-danger mb-0">
                    ${product.salePrice?.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="h3 mb-0">${product.price.toFixed(2)}</span>
              )}
            </div>
            <p className="mb-4">{product.description}</p>
            <div className="mb-4">
              <label className="form-label">Color</label>
              <div className="d-flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`btn btn-outline-secondary ${
                      selectedColor === color ? 'active' : ''
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
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
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <ProductSpecifications specifications={product.specifications} />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <ProductReviews productId={product.id} />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <RelatedProducts category={product.category} currentProductId={product.id} />
        </div>
      </div>
    </div>
  )
} 