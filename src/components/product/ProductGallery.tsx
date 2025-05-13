'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductImage } from '@/types/product'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  return (
    <div className="product-gallery">
      <div className="position-relative ratio ratio-1x1 rounded-3 overflow-hidden mb-3">
        <Image
          src={selectedImage.url}
          alt={`${productName} - ${selectedImage.alt}`}
          fill
          className="object-fit-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="row g-2">
          {images.map((image) => (
            <div key={image.id} className="col-3">
              <button
                className={`position-relative ratio ratio-1x1 rounded-3 overflow-hidden border-0 p-0 ${
                  selectedImage.id === image.id ? 'border-primary' : 'border-secondary'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image.url}
                  alt={`${productName} - ${image.alt}`}
                  fill
                  className="object-fit-cover"
                  sizes="(max-width: 768px) 25vw, 12vw"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 