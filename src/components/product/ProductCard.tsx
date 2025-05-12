'use client'

import { Product } from '@/types/product'
import { useCart } from '@/lib/cart-context'
import { useComparison } from '@/lib/comparison-context'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from './AddToCartButton'
import CompareButton from './CompareButton'
import WishlistButton from './WishlistButton'
import ProductBadge from './ProductBadge'
import ProductPrice from './ProductPrice'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { dispatch } = useCart()
  const { addToComparison, isInComparison } = useComparison()

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product }
    })
  }

  return (
    <div className={`card h-100 ${className}`}>
      <div className="position-relative">
        <Link href={`/products/${product.slug}`}>
          <div className="position-relative" style={{ height: '200px' }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-fit-contain"
            />
          </div>
        </Link>
        <div className="position-absolute top-0 end-0 p-2">
          <WishlistButton product={product} />
        </div>
        {product.featured && (
          <div className="position-absolute top-0 start-0 p-2">
            <ProductBadge type="new" />
          </div>
        )}
      </div>
      <div className="card-body">
        <h3 className="h5 mb-2">
          <Link href={`/products/${product.slug}`} className="text-decoration-none">
            {product.name}
          </Link>
        </h3>
        <ProductPrice product={product} />
        <p className="text-muted small mb-3">{product.category}</p>
        <div className="d-flex gap-2">
          <AddToCartButton
            product={product}
            className="flex-grow-1"
          />
          <CompareButton product={product} />
        </div>
      </div>
    </div>
  )
} 