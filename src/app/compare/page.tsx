'use client'

import { useComparison } from '@/lib/comparison-context'
import { Product } from '@/types/product'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ComparePage() {
  const { comparisonProducts, removeFromComparison, clearComparison } = useComparison()
  const router = useRouter()

  useEffect(() => {
    if (comparisonProducts.length === 0) {
      router.push('/products')
    }
  }, [comparisonProducts.length, router])

  if (comparisonProducts.length === 0) {
    return null
  }

  const features = [
    { label: 'Price', key: 'price' },
    { label: 'Frame Material', key: 'frameMaterial' },
    { label: 'Lens Material', key: 'lensMaterial' },
    { label: 'UV Protection', key: 'uvProtection' },
    { label: 'Polarized', key: 'polarized' },
    { label: 'Frame Size', key: 'frameSize' },
    { label: 'Weight', key: 'weight' },
    { label: 'Warranty', key: 'warranty' },
  ]

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Compare Products</h1>
        <button
          onClick={clearComparison}
          className="btn btn-outline-danger"
        >
          Clear All
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: '200px' }}>Features</th>
              {comparisonProducts.map((product) => (
                <th key={product.id} style={{ width: `${100 / comparisonProducts.length}%` }}>
                  <div className="position-relative">
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="btn btn-sm btn-outline-danger position-absolute top-0 end-0"
                      title="Remove from comparison"
                    >
                      <i className="bi bi-x" />
                    </button>
                    <div className="text-center">
                      <div className="position-relative mb-3" style={{ height: '200px' }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-fit-contain"
                        />
                      </div>
                      <h3 className="h5 mb-2">
                        <Link href={`/products/${product.id}`} className="text-decoration-none">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-primary fw-bold mb-0">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(({ label, key }) => (
              <tr key={key}>
                <th>{label}</th>
                {comparisonProducts.map((product) => (
                  <td key={`${product.id}-${key}`}>
                    {product[key as keyof Product]?.toString() || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 