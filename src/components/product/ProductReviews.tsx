"use client";

import { useState, useEffect } from 'react'
import { Review } from '@/types/review'

interface ProductReviewsProps {
  productId: string
}

interface ReviewsResponse {
  reviews: Review[]
  stats: {
    total: number
    average: number
    distribution: {
      [key: number]: number
    }
  }
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewsResponse['stats']>({
    total: 0,
    average: 0,
    distribution: {},
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/products/${productId}/reviews`)
        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }
        const data: ReviewsResponse = await response.json()
        setReviews(data.reviews)
        setStats(data.stats)
      } catch (err) {
        setError('Error loading reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted">{error}</p>
      </div>
    )
  }

  if (stats.total === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted">No reviews yet</p>
        <p className="text-muted small mt-2">Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="product-reviews">
      <h3 className="h4 mb-4">Customer Reviews</h3>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <h4 className="h1 mb-0">{stats.average.toFixed(1)}</h4>
              <div className="text-warning mb-2">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`bi bi-star${i < Math.floor(stats.average) ? '-fill' : ''}`}
                  />
                ))}
              </div>
              <p className="text-muted mb-0">{stats.total} reviews</p>
            </div>
          </div>
          <div className="mb-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="d-flex align-items-center mb-2">
                <div className="text-warning me-2">
                  {rating} <i className="bi bi-star-fill" />
                </div>
                <div className="progress flex-grow-1" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{
                      width: `${((stats.distribution[rating] || 0) / stats.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="ms-2 text-muted small">
                  {stats.distribution[rating] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-8">
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{review.user.name}</h5>
                    <div className="text-warning">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star${i < review.rating ? '-fill' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted small mb-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="card-text">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 