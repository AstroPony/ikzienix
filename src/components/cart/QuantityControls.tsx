'use client'

import { useState, useEffect } from 'react'

interface QuantityControlsProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  className?: string
  disabled?: boolean
}

export default function QuantityControls({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  className = '',
  disabled = false
}: QuantityControlsProps) {
  const [localQuantity, setLocalQuantity] = useState(quantity)

  useEffect(() => {
    setLocalQuantity(quantity)
  }, [quantity])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= min && value <= max) {
      setLocalQuantity(value)
      onQuantityChange(value)
    }
  }

  const handleBlur = () => {
    if (localQuantity < min) {
      setLocalQuantity(min)
      onQuantityChange(min)
    } else if (localQuantity > max) {
      setLocalQuantity(max)
      onQuantityChange(max)
    }
  }

  const increment = () => {
    if (localQuantity < max) {
      const newQuantity = localQuantity + 1
      setLocalQuantity(newQuantity)
      onQuantityChange(newQuantity)
    }
  }

  const decrement = () => {
    if (localQuantity > min) {
      const newQuantity = localQuantity - 1
      setLocalQuantity(newQuantity)
      onQuantityChange(newQuantity)
    }
  }

  return (
    <div className={`input-group input-group-sm ${className}`} style={{ width: '120px' }}>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={decrement}
        disabled={disabled || localQuantity <= min}
        aria-label="Decrease quantity"
      >
        <i className="bi bi-dash" />
      </button>
      <input
        type="number"
        className="form-control text-center"
        value={localQuantity}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        disabled={disabled}
        aria-label="Product quantity"
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={increment}
        disabled={disabled || localQuantity >= max}
        aria-label="Increase quantity"
      >
        <i className="bi bi-plus" />
      </button>
    </div>
  )
} 