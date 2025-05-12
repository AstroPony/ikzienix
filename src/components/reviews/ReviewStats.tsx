'use client'

import { ReviewStats as ReviewStatsType } from '@/types/review'
import ReviewStars from './ReviewStars'

interface ReviewStatsProps {
  stats: ReviewStatsType
  className?: string
}

export default function ReviewStats({ stats, className = '' }: ReviewStatsProps) {
  const totalReviews = stats.totalReviews
  const averageRating = stats.averageRating
  const ratingDistribution = stats.ratingDistribution

  return (
    <div className={className}>
      <div className="d-flex align-items-center mb-4">
        <div className="me-4">
          <h2 className="h1 mb-0">{averageRating.toFixed(1)}</h2>
          <ReviewStars rating={averageRating} size="lg" />
          <p className="text-muted mb-0">{totalReviews} reviews</p>
        </div>
        <div className="flex-grow-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
            
            return (
              <div key={rating} className="d-flex align-items-center mb-2">
                <div className="me-2" style={{ width: '40px' }}>
                  {rating} stars
                </div>
                <div className="flex-grow-1 me-2">
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{ width: `${percentage}%` }}
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
                <div style={{ width: '40px' }}>
                  {count}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 