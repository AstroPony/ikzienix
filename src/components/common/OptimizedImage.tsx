'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { placeholderImages } from '@/lib/placeholder-images'

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackImage?: string
  showLoadingState?: boolean
}

export default function OptimizedImage({
  src,
  alt,
  fallbackImage = '/placeholder.png',
  showLoadingState = true,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`position-relative ${className}`}>
      {showLoadingState && isLoading && (
        <div className="position-absolute inset-0 bg-light animate-pulse" />
      )}
      <Image
        src={error ? fallbackImage : src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        {...props}
      />
    </div>
  )
} 