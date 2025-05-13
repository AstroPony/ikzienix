"use client";

import { useEffect, useState } from 'react'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'

interface RelatedProductsProps {
  productId: string
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        const response = await fetch(`/api/products/${productId}/related`)
        if (!response.ok) {
          throw new Error('Failed to fetch related products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError('Error loading related products')
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [productId])

  if (loading) {
    return <div>Loading related products...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
} 