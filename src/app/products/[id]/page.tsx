'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { products } from '@/lib/products'
import { Product } from '@/types/product'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { dispatch } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, relatedResponse] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch(`/api/products/related/${params.id}`),
        ])

        if (!productResponse.ok) {
          throw new Error('Failed to fetch product')
        }

        const productData = await productResponse.json()
        setProduct(productData)

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          setRelatedProducts(relatedData)
        }
      } catch (err) {
        setError('Error loading product')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product
      },
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

      {relatedProducts.length > 0 && (
        <div className="mt-5">
          <h2 className="h3 mb-4">Related Products</h2>
          <div className="row">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="col-md-4">
                <div className="card h-100">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    width={300}
                    height={300}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{relatedProduct.name}</h5>
                    <p className="card-text">${relatedProduct.price.toFixed(2)}</p>
                    <Link
                      href={`/products/${relatedProduct.id}`}
                      className="btn btn-outline-dark"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 