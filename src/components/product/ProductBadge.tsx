'use client'

interface ProductBadgeProps {
  type: 'sale' | 'new'
  className?: string
}

export default function ProductBadge({ type, className = '' }: ProductBadgeProps) {
  const badgeStyles = {
    sale: {
      text: 'Sale',
      bgColor: 'bg-danger',
      position: 'end-0'
    },
    new: {
      text: 'New',
      bgColor: 'bg-primary',
      position: 'start-0'
    }
  }

  const style = badgeStyles[type]

  return (
    <div className={`position-absolute top-0 ${style.position} ${style.bgColor} text-white px-2 py-1 m-2 rounded ${className}`}>
      {style.text}
    </div>
  )
} 