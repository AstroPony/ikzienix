'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types/product'
import ProductBadge from './ProductBadge'

interface ProductGalleryProps {
  product: Product
  className?: string
}

export default function ProductGallery({ product, className = '' }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Combine main image with additional images
  const allImages = [product.image, ...(product.images || [])].filter(Boolean)
  
  if (allImages.length === 0) {
    return (
      <div className={`bg-light rounded-3 p-4 text-center ${className}`}>
        <p className="mb-0">No image available</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Main Image Carousel */}
      <div id="productCarousel" className="carousel slide mb-3" data-bs-ride="carousel">
        <div className="carousel-inner rounded-3">
          {allImages.map((image, index) => (
            <div
              key={index}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
            >
              <div className="position-relative" style={{ paddingTop: '100%' }}>
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-fit-cover rounded-3"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
                {index === 0 && product.sale && <ProductBadge type="sale" />}
                {index === 0 && product.new && <ProductBadge type="new" />}
              </div>
            </div>
          ))}
        </div>
        
        {allImages.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="prev"
              onClick={() => setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="next"
              onClick={() => setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {allImages.length > 1 && (
        <div className="d-flex gap-2 overflow-auto">
          {allImages.map((image, index) => (
            <button
              key={index}
              className={`border-0 p-0 rounded-3 overflow-hidden ${index === activeIndex ? 'border border-primary' : ''}`}
              style={{ width: '80px', height: '80px' }}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={image}
                alt={`${product.name} - Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="object-fit-cover"
                style={{ width: '100%', height: '100%' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 