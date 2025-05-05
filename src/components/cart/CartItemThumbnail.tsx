'use client'

import Image from 'next/image'
import { Product } from '@/types/product'
import { useState } from 'react'

interface CartItemThumbnailProps {
  product: Product
  className?: string
  style?: React.CSSProperties
}

export default function CartItemThumbnail({ product, className = '', style = {} }: CartItemThumbnailProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className={`position-relative ${className}`} style={{ width: '80px', height: '80px', ...style }}>
      <Image
        src={imageError ? '/placeholder.png' : product.image}
        alt={product.name}
        fill
        className="object-fit-cover rounded"
        onError={() => setImageError(true)}
        sizes="80px"
        loading="lazy"
      />
    </div>
  )
} 