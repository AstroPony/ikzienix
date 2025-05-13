'use client'

import { Product } from '@/types/product'

interface ProductShareProps {
  product: Product
}

export default function ProductShare({ product }: ProductShareProps) {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`
  const shareText = `Check out these ${product.name} from Ikzienix! 🕶️`

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(product.images?.[0]?.url || '')}&description=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
  }

  return (
    <div>
      {/* Render your share links here */}
    </div>
  )
}
