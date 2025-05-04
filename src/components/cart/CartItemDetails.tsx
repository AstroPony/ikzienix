'use client'

import { Product } from '@/types/product'

interface CartItemDetailsProps {
  product: Product
  className?: string
}

export default function CartItemDetails({ product, className = '' }: CartItemDetailsProps) {
  return (
    <div className={`ms-3 flex-grow-1 ${className}`}>
      <h6 className="mb-1">{product.name}</h6>
      <p className="text-muted mb-0">${product.price.toFixed(2)}</p>
    </div>
  )
} 