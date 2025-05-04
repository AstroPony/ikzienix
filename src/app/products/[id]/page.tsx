'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Product } from '@/types/product'

export default function ProductPage() {
  const params = useParams()
  const { dispatch } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const productResponse = await fetch(`/api/products/${params.id}`)
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product')
        }
        const data = await productResponse.json()
        setProduct(data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Error loading product')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    dispatch({
      type: 'ADD_ITEM',
      payload: { product },
    })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h1 className="display-5 mb-4">Error</h1>
          <p className="lead text-muted">{error}</p>
          <Link href="/" className="btn btn-dark mt-3">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h1 className="display-5 mb-4">{product.name}</h1>
          <p className="lead text-muted">{product.description}</p>
          <p className="h3 mb-4">${product.price.toFixed(2)}</p>
          {showSuccess && (
            <div className="alert alert-success mb-3" role="alert">
              Added to cart!
            </div>
          )}
          {product.inStock ? (
            <button
              className="btn btn-dark btn-lg"
              onClick={handleAddToCart}
              data-testid="add-to-cart"
            >
              <i className="bi bi-bag me-2"></i>
              Add to Cart
            </button>
          ) : (
            <p className="text-danger">Out of Stock</p>
          )}
        </div>
      </div>
      {/* Optionally, render related products here if you implement that logic */}
    </div>
  )
} 