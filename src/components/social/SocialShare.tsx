'use client'

import { useState } from 'react'
import { Product } from '@/types/product'

interface SocialShareProps {
  product?: Product
  url?: string
  title?: string
  description?: string
  image?: string
  className?: string
}

export default function SocialShare({
  product,
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Check this out!',
  description = 'Discover amazing products at Ikzienix',
  image,
  className = '',
}: SocialShareProps) {
  const [isCopied, setIsCopied] = useState(false)

  const shareData = {
    url: product ? `${url}/products/${product.id}` : url,
    title: product ? product.name : title,
    description: product ? product.description : description,
    image: product ? product.images?.[0]?.url : image,
  }

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareData.url)}&media=${encodeURIComponent(shareData.image || '')}&description=${encodeURIComponent(shareData.description)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareData.title} ${shareData.url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.description}\n\n${shareData.url}`)}`,
  }

  const handleShare = (platform: keyof typeof shareUrls) => {
    const shareUrl = shareUrls[platform]
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  return (
    <div className={`d-flex gap-2 ${className}`}>
      <button
        onClick={() => handleShare('facebook')}
        className="btn btn-outline-primary"
        title="Share on Facebook"
      >
        <i className="bi bi-facebook" />
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="btn btn-outline-info"
        title="Share on Twitter"
      >
        <i className="bi bi-twitter" />
      </button>
      <button
        onClick={() => handleShare('pinterest')}
        className="btn btn-outline-danger"
        title="Share on Pinterest"
      >
        <i className="bi bi-pinterest" />
      </button>
      <button
        onClick={() => handleShare('whatsapp')}
        className="btn btn-outline-success"
        title="Share on WhatsApp"
      >
        <i className="bi bi-whatsapp" />
      </button>
      <button
        onClick={() => handleShare('email')}
        className="btn btn-outline-secondary"
        title="Share via Email"
      >
        <i className="bi bi-envelope" />
      </button>
      <button
        onClick={handleCopyLink}
        className="btn btn-outline-dark"
        title="Copy Link"
      >
        {isCopied ? (
          <i className="bi bi-check2" />
        ) : (
          <i className="bi bi-link-45deg" />
        )}
      </button>
    </div>
  )
} 