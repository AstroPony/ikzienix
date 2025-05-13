'use client'

interface ReviewStarsProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export default function ReviewStars({ 
  rating, 
  size = 'md', 
  interactive = false,
  onChange,
  className = ''
}: ReviewStarsProps) {
  const sizeClasses = {
    sm: 'fs-6',
    md: 'fs-5',
    lg: 'fs-4'
  }

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className={`d-flex align-items-center gap-1 ${className}`} role={interactive ? 'radiogroup' : 'img'} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type={interactive ? 'button' : undefined}
          onClick={() => handleClick(value)}
          className={`btn btn-link p-0 ${interactive ? 'cursor-pointer' : 'cursor-default'} ${sizeClasses[size]} text-warning`}
          disabled={!interactive}
          aria-label={`${value} stars`}
          aria-pressed={interactive ? value <= rating : undefined}
          role={interactive ? 'radio' : undefined}
        >
          <i className={`bi bi-star${value <= rating ? '-fill' : ''}`} />
        </button>
      ))}
    </div>
  )
} 