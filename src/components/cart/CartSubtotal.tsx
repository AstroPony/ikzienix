'use client'

interface CartSubtotalProps {
  subtotal: number
  className?: string
}

export default function CartSubtotal({ subtotal, className = '' }: CartSubtotalProps) {
  return (
    <div className={`d-flex justify-content-between mb-3 ${className}`}>
      <span>Subtotal</span>
      <span className="fw-bold">${subtotal.toFixed(2)}</span>
    </div>
  )
} 