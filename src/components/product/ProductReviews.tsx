"use client";

import { useEffect, useState } from 'react'

interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

interface ReviewStats {
  average: number
  total: number
  distribution: {
    [key: number]: number
  }
}

interface ReviewsResponse {
  stats: ReviewStats
  reviews: Review[]
}

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/products/${productId}/reviews`)
        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }
        const data = await response.json()
        setReviews(data)
      } catch (err) {
        setError('Error loading reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  if (loading) {
    return <div>Loading reviews...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  if (!reviews) {
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{reviews.stats.average.toFixed(1)}</div>
          <div className="text-gray-600">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{reviews.stats.total}</div>
          <div className="text-gray-600">Total Reviews</div>
        </div>
        <div>
          {Object.entries(reviews.stats.distribution).reverse().map(([rating, count]) => (
            <div key={rating} className="flex items-center gap-2 mb-2">
              <div className="w-12 text-gray-600">{rating} stars</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${(count / reviews.stats.total) * 100}%` }}
                />
              </div>
              <div className="w-12 text-gray-600">{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-yellow-400">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
              <div className="text-gray-600">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 