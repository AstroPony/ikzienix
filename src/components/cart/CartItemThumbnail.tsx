'use client'

import Image from 'next/image'
import { Product } from '@/types/product'

interface CartItemThumbnailProps {
  product: Product
  className?: string
}

export default function CartItemThumbnail({ product, className = '' }: CartItemThumbnailProps) {
  return (
    <div className={`position-relative ratio ratio-1x1 ${className}`} style={{ width: '80px' }}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-fit-cover rounded"
      />
    </div>
  )
} 