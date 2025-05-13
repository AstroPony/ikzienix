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
import InstagramFeed from '@/components/social/InstagramFeed'
import ProductShare from '@/components/social/ProductShare'

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
            <div className="sticky top-4">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                {product.rating > 0 && (
                  <div className="text-warning">
                    {'★'.repeat(Math.round(product.rating))}
                    {'☆'.repeat(5 - Math.round(product.rating))}
                  </div>
                )}
                <span className="text-muted">({product.reviews} reviews)</span>
              </div>
              <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <div className="flex gap-4 mb-6">
                <AddToCartButton product={product} />
                <CompareButton product={product} />
              </div>

              {!product.inStock && (
                <p className="text-red-600 font-semibold mb-6">Out of Stock</p>
              )}

              <div className="mb-6">
                <ProductShare product={product} />
              </div>

              <ProductSpecifications specifications={product.specifications} />
              <ProductFeatures features={product.features} />
            </div>
          </div>
        </div>

        {/* Community Content Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Community Love</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Suspense fallback={<div>Loading reviews...</div>}>
                <ProductReviews productId={product.id} />
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<div>Loading Instagram feed...</div>}>
                <InstagramFeed hashtag={product.slug} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Related Products */}
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
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-4">Don't worry, it's not you - it's us! 😅</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
} 