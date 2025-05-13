'use client'

import { Review } from '@/types/review'
import ReviewStars from './ReviewStars'
import Image from 'next/image'
import { useState } from 'react'

interface ReviewListProps {
  reviews: Review[]
  onHelpfulClick?: (reviewId: string) => void
}

export default function ReviewList({ reviews, onHelpfulClick }: ReviewListProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())

  const toggleReview = (reviewId: string) => {
    setExpandedReviews(prev => {
      const next = new Set(prev)
      if (next.has(reviewId)) {
        next.delete(reviewId)
      } else {
        next.add(reviewId)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ReviewStars rating={review.rating} size="sm" />
                <span className="font-medium">{review.user.name}</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-2">
            <p className={`text-gray-600 ${!expandedReviews.has(review.id) && 'line-clamp-3'}`}>
              {review.comment}
            </p>
            {review.comment.length > 200 && (
              <button
                onClick={() => toggleReview(review.id)}
                className="text-primary hover:text-primary-dark text-sm mt-1"
              >
                {expandedReviews.has(review.id) ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 