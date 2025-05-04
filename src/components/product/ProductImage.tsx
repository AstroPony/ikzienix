'use client'

import Image from 'next/image'
import { Product } from '@/types/product'
import ProductBadge from './ProductBadge'

interface ProductImageProps {
  product: Product
  className?: string
  style?: React.CSSProperties
}

export default function ProductImage({ product, className = '', style = {} }: ProductImageProps) {
  return (
    <div className={`position-relative ${className}`} style={style}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-fit-cover"
      />
      {product.sale && <ProductBadge type="sale" />}
      {product.new && <ProductBadge type="new" />}
    </div>
  )
} 