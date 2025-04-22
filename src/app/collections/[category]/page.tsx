import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 capitalize">{categoryName} Collection</h1>
        <p className="text-xl text-gray-600">
          Browse our selection of {categoryName.toLowerCase()} sunglasses.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/products/${product.id}`}>
              <div className="group relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 