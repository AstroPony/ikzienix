'use client'

interface QuantityControlsProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  className?: string
}

export default function QuantityControls({ quantity, onQuantityChange, className = '' }: QuantityControlsProps) {
  return (
    <div className={`input-group input-group-sm ${className}`} style={{ width: '100px' }}>
      <button
        className="btn btn-outline-secondary"
        onClick={() => onQuantityChange(quantity - 1)}
      >
        -
      </button>
      <input
        type="number"
        className="form-control text-center"
        value={quantity}
        onChange={(e) => onQuantityChange(parseInt(e.target.value))}
        min="1"
      />
      <button
        className="btn btn-outline-secondary"
        onClick={() => onQuantityChange(quantity + 1)}
      >
        +
      </button>
    </div>
  )
} 