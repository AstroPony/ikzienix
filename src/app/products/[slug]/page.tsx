import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/api'
import { Product } from '@/types/product'
import AddToCartButton from '@/components/product/AddToCartButton'
import CompareButton from '@/components/product/CompareButton'
import ProductGallery from '@/components/product/ProductGallery'
import ProductSpecifications from '@/components/product/ProductSpecifications'
import ProductFeatures from '@/components/product/ProductFeatures'
import ProductReviews from '@/components/product/ProductReviews'
import RelatedProducts from '@/components/product/RelatedProducts'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await getProduct(params.slug)
    if (!product) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ProductGallery product={product} />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="flex gap-4 mb-6">
              <AddToCartButton product={product} />
              <CompareButton product={product} />
            </div>

            {!product.inStock && (
              <p className="text-red-600 font-semibold mb-6">Out of Stock</p>
            )}

            <ProductSpecifications specifications={product.specifications} />
            <ProductFeatures features={product.features} />
          </div>
        </div>

        <div className="mt-12">
          <Suspense fallback={<div>Loading reviews...</div>}>
            <ProductReviews productId={product.id} />
          </Suspense>
        </div>

        <div className="mt-12">
          <Suspense fallback={<div>Loading related products...</div>}>
            <RelatedProducts productId={product.id} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading product</h1>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
} 