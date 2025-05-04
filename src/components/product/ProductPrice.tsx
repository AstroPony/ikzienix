'use client'

import { Product } from '@/types/product'

interface ProductPriceProps {
  product: Product
  className?: string
}

export default function ProductPrice({ product, className = '' }: ProductPriceProps) {
  return (
    <div className={className}>
      {product.sale && product.salePrice ? (
        <>
          <span className="text-danger me-2">${product.salePrice}</span>
          <span className="text-muted text-decoration-line-through">${product.price}</span>
        </>
      ) : (
        <span>${product.price}</span>
      )}
    </div>
  )
} 