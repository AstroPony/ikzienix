'use client'

import { Product } from '@/types/product'
import ProductImage from './ProductImage'
import ProductPrice from './ProductPrice'
import AddToCartButton from './AddToCartButton'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card h-100">
      <ProductImage
        product={product}
        style={{ height: '200px' }}
      />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted">{product.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <ProductPrice product={product} />
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
} 