import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { products } from '@/lib/products'

const categories = [
  {
    id: 'classic',
    name: 'Classic Collection',
    description: 'Timeless designs that never go out of style.',
  },
  {
    id: 'retro',
    name: 'Retro Collection',
    description: 'Vintage-inspired sunglasses with a modern twist.',
  },
  {
    id: 'sport',
    name: 'Sport Collection',
    description: 'Performance sunglasses for active lifestyles.',
  },
  {
    id: 'aviator',
    name: 'Aviator Collection',
    description: 'Classic aviator styles with premium finishes.',
  },
  {
    id: 'cat-eye',
    name: 'Cat Eye Collection',
    description: 'Feminine and stylish cat-eye sunglasses.',
  },
  {
    id: 'wayfarer',
    name: 'Wayfarer Collection',
    description: 'Iconic wayfarer designs with modern features.',
  },
]

export default function CollectionsPage() {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Collections</h1>
        <p className="text-xl text-gray-600">
          Browse our curated collections of premium sunglasses.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => {
          const categoryProducts = products.filter(p => p.category === category.id)
          const featuredProduct = categoryProducts[0]

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/collections/${category.id}`}>
                <div className="group relative aspect-square overflow-hidden rounded-lg">
                  {featuredProduct && (
                    <Image
                      src={featuredProduct.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                      <p className="text-sm mt-2">
                        {categoryProducts.length} {categoryProducts.length === 1 ? 'style' : 'styles'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
} 