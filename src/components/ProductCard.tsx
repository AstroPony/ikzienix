'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { Product } from '@/types/product'
import OptimizedImage from './common/OptimizedImage'
import CompareButton from './product/CompareButton'
import AddToCartButton from './product/AddToCartButton'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <Link href={`/products/${product.id}`} className="text-decoration-none">
        <div className="card h-100 border-0 shadow-sm">
          <div className="position-relative" style={{ aspectRatio: '1/1' }}>
            <OptimizedImage
              src={product.image}
              alt={product.name}
              className="card-img-top object-fit-cover"
              fill
              sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
              loading="lazy"
              quality={85}
            />
          </div>
          <div className="card-body">
            <h3 className="h6 card-title mb-1">{product.name}</h3>
            <p className="text-muted small mb-2">{product.category}</p>
            <p className="h6 mb-0">${product.price.toFixed(2)}</p>
          </div>
          <div className="d-flex gap-2">
            <AddToCartButton product={product} className="flex-grow-1" />
            <CompareButton product={product} />
          </div>
        </div>
      </Link>
    </div>
  )
} 