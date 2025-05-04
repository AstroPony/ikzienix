'use client'

import Image from 'next/image'
import { Product } from '@/types/product'

interface CartItemThumbnailProps {
  product: Product
  className?: string
  style?: React.CSSProperties
}

export default function CartItemThumbnail({ product, className = '', style = {} }: CartItemThumbnailProps) {
  return (
    <div className={`position-relative ${className}`} style={{ width: '80px', height: '80px', ...style }}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-fit-cover rounded"
      />
    </div>
  )
} 