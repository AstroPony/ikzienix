'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Product, defaultProduct } from '@/types/product'
import { Review, ReviewStats as ReviewStatsType } from '@/types/review'
import ProductGallery from '@/components/product/ProductGallery'
import ProductDetails from '@/components/product/ProductDetails'
import ProductPrice from '@/components/product/ProductPrice'
import AddToCartButton from '@/components/product/AddToCartButton'
import ReviewStats from '@/components/reviews/ReviewStats'
import ReviewList from '@/components/reviews/ReviewList'
import ReviewForm from '@/components/reviews/ReviewForm'
import { useSession } from 'next-auth/react'
import SocialShare from '@/components/social/SocialShare'
import SizeGuide from '@/components/product/SizeGuide'

export default function ProductPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStatsType | null>(null)
  const [reviewPage, setReviewPage] = useState(1)
  const [hasMoreReviews, setHasMoreReviews] = useState(true)

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/products/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      const data = await response.json()
      // Merge with default values
      setProduct({ ...defaultProduct, ...data } as Product)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const fetchReviews = useCallback(async (page: number) => {
    try {
      const response = await fetch(`/api/reviews?productId=${params.id}&page=${page}&limit=5`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const data = await response.json()
      
      if (page === 1) {
        setReviews(data.reviews)
      } else {
        setReviews(prev => [...prev, ...data.reviews])
      }
      
      setHasMoreReviews(data.pagination.hasNextPage)
      
      // Calculate review stats
      const stats: ReviewStatsType = {
        averageRating: product?.rating || 0,
        totalReviews: data.pagination.totalItems,
        ratingDistribution: data.reviews.reduce((acc: { [key: number]: number }, review: Review) => {
          acc[review.rating] = (acc[review.rating] || 0) + 1
          return acc
        }, {})
      }
      setReviewStats(stats)
    } catch (err) {
      console.error('Error fetching reviews:', err)
    }
  }, [params.id, product?.rating])

  const handleReviewSubmit = async (review: {
    rating: number
    title: string
    comment: string
    images?: string[]
  }) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: params.id,
          ...review
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      // Refresh reviews
      setReviewPage(1)
      fetchReviews(1)
      fetchProduct() // Refresh product to update rating
    } catch (err) {
      console.error('Error submitting review:', err)
    }
  }

  const handleHelpfulClick = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ helpful: true })
      })

      if (!response.ok) {
        throw new Error('Failed to mark review as helpful')
      }

      // Refresh reviews
      fetchReviews(reviewPage)
    } catch (err) {
      console.error('Error marking review as helpful:', err)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  useEffect(() => {
    if (product) {
      fetchReviews(1)
    }
  }, [product, fetchReviews])

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          Error loading product
          <button 
            onClick={fetchProduct} 
            className="btn btn-link text-danger p-0 ms-2"
          >
            try again
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          Product not found
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
          <div className="card mb-4">
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

          {/* Social Share */}
          <div className="mb-4">
            <h3 className="h6 mb-3">Share this product</h3>
            <SocialShare product={product} />
          </div>
        </div>

        {/* Product Details */}
        <div className="col-12 mt-4">
          <ProductDetails product={product} />
        </div>

        {/* Size Guide */}
        <div className="col-12 mt-4">
          <h2 className="h3 mb-4">Size Guide</h2>
          <SizeGuide />
        </div>

        {/* Reviews Section */}
        <div className="col-12 mt-5">
          <h2 className="h3 mb-4">Customer Reviews</h2>
          
          {/* Review Stats */}
          {reviewStats && (
            <ReviewStats stats={reviewStats} className="mb-5" />
          )}

          {/* Review Form */}
          {session?.user && (
            <div className="mb-5">
              <h3 className="h4 mb-4">Write a Review</h3>
              <ReviewForm
                productId={product.id}
                onSubmit={handleReviewSubmit}
              />
            </div>
          )}

          {/* Review List */}
          <div className="mb-4">
            <ReviewList
              reviews={reviews}
              onHelpfulClick={handleHelpfulClick}
            />
          </div>

          {/* Load More Reviews */}
          {hasMoreReviews && (
            <div className="text-center">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  const nextPage = reviewPage + 1
                  setReviewPage(nextPage)
                  fetchReviews(nextPage)
                }}
              >
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 