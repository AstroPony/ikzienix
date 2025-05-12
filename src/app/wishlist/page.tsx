'use client'

import { useWishlist } from '@/context/WishlistContext'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default function WishlistPage() {
  const { wishlist } = useWishlist()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link
            href="/collections"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
} 