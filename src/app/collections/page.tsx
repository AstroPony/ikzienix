'use client'

import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/lib/products'
import { placeholderImages } from '@/lib/placeholder-images'

const categories = [
  {
    id: 'classic',
    name: 'Classic Collection',
    description: 'Timeless designs that never go out of style.',
    image: placeholderImages['classic-black']
  },
  {
    id: 'retro',
    name: 'Retro Collection',
    description: 'Vintage-inspired sunglasses with a modern twist.',
    image: placeholderImages['retro-round']
  },
  {
    id: 'sport',
    name: 'Sport Collection',
    description: 'Performance sunglasses for active lifestyles.',
    image: placeholderImages['sport-shield']
  },
  {
    id: 'aviator',
    name: 'Aviator Collection',
    description: 'Classic aviator styles with premium finishes.',
    image: placeholderImages['aviator-gold']
  },
  {
    id: 'cat-eye',
    name: 'Cat Eye Collection',
    description: 'Feminine and stylish cat-eye sunglasses.',
    image: placeholderImages['cat-eye']
  },
  {
    id: 'wayfarer',
    name: 'Wayfarer Collection',
    description: 'Iconic wayfarer designs with modern features.',
    image: placeholderImages['wayfarer']
  },
]

export default function CollectionsPage() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Collections</h1>
        <p className="lead text-muted">
          Browse our curated collections of premium sunglasses.
        </p>
      </div>

      <div className="row g-4">
        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.category === category.id)

          return (
            <div key={category.id} className="col-12 col-md-6 col-lg-4">
              <Link href={`/collections/${category.id}`} className="text-decoration-none">
                <div className="position-relative overflow-hidden rounded" style={{ aspectRatio: '1/1' }}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-fit-cover"
                    sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-40"></div>
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4">
                    <div className="text-center text-white">
                      <h3 className="h4 mb-2">{category.name}</h3>
                      <p className="small mb-2">{category.description}</p>
                      <p className="small">
                        {categoryProducts.length} {categoryProducts.length === 1 ? 'style' : 'styles'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
} 