'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Product, defaultProduct } from '@/types/product'
import ProductGallery from '@/components/product/ProductGallery'
import ProductDetails from '@/components/product/ProductDetails'
import ProductPrice from '@/components/product/ProductPrice'
import AddToCartButton from '@/components/product/AddToCartButton'

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch product')
        const data = await response.json()
        // Merge with default values
        setProduct({ ...defaultProduct, ...data } as Product)
      } catch (err) {
        setError('Error loading product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Product not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Product Gallery */}
        <div className="col-md-6">
          <ProductGallery product={product} />
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h1 className="h2 mb-3">{product.name}</h1>
          <div className="mb-3">
            <ProductPrice product={product} className="h3" />
          </div>
          <p className="text-muted mb-4">{product.description}</p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <label className="form-label">Color</label>
              <div className="d-flex gap-2">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className="form-check"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="color"
                      id={`color-${color}`}
                      value={color}
                    />
                    <label className="form-check-label" htmlFor={`color-${color}`}>
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mb-4">
            <AddToCartButton product={product} className="w-100" />
          </div>

          {/* Shipping Info */}
          <div className="card bg-light mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-truck me-2"></i>
                <span>
                  {product.shipping.freeShipping ? 'Free Shipping' : 'Standard Shipping'}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar me-2"></i>
                <span>Estimated Delivery: {product.shipping.estimatedDelivery}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-12 mt-4">
          <ProductDetails product={product} />
        </div>
      </div>
    </div>
  )
} 