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
                <span className="font-medium">{review.userName}</span>
                {review.verifiedPurchase && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold mt-2">{review.title}</h3>
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

          {review.images && review.images.length > 0 && (
            <div className="mt-4 flex gap-2">
              {review.images.map((image, index) => (
                <div key={index} className="relative w-20 h-20">
                  <Image
                    src={image}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => onHelpfulClick?.(review.id)}
              className="text-sm text-gray-500 hover:text-primary flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              Helpful ({review.helpful})
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 