"use client";

import { useEffect, useState } from 'react'
import { Product } from '@/types/product'
import ProductCard from './ProductCard'

interface RelatedProductsProps {
  category: string
  currentProductId: string
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        const response = await fetch(`/api/products?category=${category}&limit=4`)
        if (!response.ok) {
          throw new Error('Failed to fetch related products')
        }
        const data = await response.json()
        // Filter out the current product
        const filteredProducts = data.products.filter(
          (product: Product) => product.id !== currentProductId
        )
        setProducts(filteredProducts)
      } catch (err) {
        setError('Error loading related products')
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [category, currentProductId])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="related-products">
      <h3 className="h4 mb-4">Related Products</h3>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-6 col-md-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
} 