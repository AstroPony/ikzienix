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
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
  }

  return (
    <div className="d-flex gap-2">
      <span className="text-muted">Share:</span>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-outline-primary"
        title="Share on Twitter"
      >
        <i className="bi bi-twitter-x" />
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-outline-primary"
        title="Share on Facebook"
      >
        <i className="bi bi-facebook" />
      </a>
      <a
        href={shareLinks.pinterest}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-outline-primary"
        title="Share on Pinterest"
      >
        <i className="bi bi-pinterest" />
      </a>
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-outline-primary"
        title="Share on WhatsApp"
      >
        <i className="bi bi-whatsapp" />
      </a>
    </div>
  )
} 