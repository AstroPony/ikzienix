'use client'

import { useComparison } from '@/lib/comparison-context'
import { Product } from '@/types/product'
import { useState } from 'react'

interface CompareButtonProps {
  product: Product
  className?: string
}

export default function CompareButton({ product, className = '' }: CompareButtonProps) {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison()
  const [isHovered, setIsHovered] = useState(false)

  const isComparing = isInComparison(product.id)

  const handleClick = () => {
    if (isComparing) {
      removeFromComparison(product.id)
    } else {
      addToComparison(product)
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`btn btn-sm ${isComparing ? 'btn-primary' : 'btn-outline-primary'} ${className}`}
      title={isComparing ? 'Remove from comparison' : 'Add to comparison'}
    >
      <i className={`bi ${isComparing ? 'bi-check-lg' : 'bi-arrow-left-right'} me-1`} />
      {isHovered || isComparing ? (isComparing ? 'Remove' : 'Compare') : ''}
    </button>
  )
} 