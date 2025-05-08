'use client'

import Image from 'next/image'
import { Product } from '@/types/product'
import ProductBadge from './ProductBadge'

interface ProductImageProps {
  product: Product
  className?: string
}

export default function ProductImage({ product, className = '' }: ProductImageProps) {
  return (
    <div className={`position-relative ratio ratio-1x1 ${className}`}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-fit-cover rounded"
      />
      {product.sale && <ProductBadge type="sale" />}
      {product.new && <ProductBadge type="new" />}
    </div>
  )
} 