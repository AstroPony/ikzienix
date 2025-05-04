'use client'

import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/lib/products'

interface CollectionPageProps {
  params: {
    category: string
  }
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const categoryProducts = products.filter(p => p.category === params.category)
  const categoryName = categoryProducts[0]?.category || 'Collection'

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3 text-capitalize">{categoryName} Collection</h1>
        <p className="lead text-muted">
          Browse our selection of {categoryName.toLowerCase()} sunglasses.
        </p>
      </div>

      <div className="row g-4">
        {categoryProducts.map((product) => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4">
            <Link href={`/products/${product.id}`} className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm">
                <div className="position-relative" style={{ aspectRatio: '1/1' }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="card-img-top object-fit-cover"
                    sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="card-body">
                  <h3 className="h5 card-title mb-2">{product.name}</h3>
                  <p className="card-text text-muted">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
} 