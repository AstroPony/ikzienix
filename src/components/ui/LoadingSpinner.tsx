interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  text = 'Loading...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  }

  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`}>
      <div
        className={`spinner-border text-primary ${sizeClasses[size]}`}
        role="status"
        aria-label={text}
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <span className="ms-2 text-muted">{text}</span>}
    </div>
  )
} 