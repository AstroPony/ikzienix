import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { motion } from 'framer-motion'

const collections = {
  aviators: {
    name: 'Aviators',
    description: 'Classic aviator sunglasses with a modern twist. Perfect for everyday wear with UV400 protection.',
    products: [
      {
        id: '1',
        name: 'Classic Aviator',
        price: 49.99,
        image: '/products/aviator.jpg',
      },
      {
        id: '4',
        name: 'Gold Aviator',
        price: 54.99,
        image: '/products/gold-aviator.jpg',
      },
      {
        id: '5',
        name: 'Silver Aviator',
        price: 52.99,
        image: '/products/silver-aviator.jpg',
      },
    ],
  },
  round: {
    name: 'Round Frames',
    description: 'Vintage-inspired round frame sunglasses with a contemporary edge.',
    products: [
      {
        id: '2',
        name: 'Round Frame',
        price: 39.99,
        image: '/products/round.jpg',
      },
      {
        id: '6',
        name: 'Tortoise Round',
        price: 44.99,
        image: '/products/tortoise-round.jpg',
      },
      {
        id: '7',
        name: 'Black Round',
        price: 42.99,
        image: '/products/black-round.jpg',
      },
    ],
  },
  square: {
    name: 'Square Frames',
    description: 'Modern square frame sunglasses with a bold statement.',
    products: [
      {
        id: '3',
        name: 'Square Frame',
        price: 44.99,
        image: '/products/square.jpg',
      },
      {
        id: '8',
        name: 'Oversized Square',
        price: 49.99,
        image: '/products/oversized-square.jpg',
      },
      {
        id: '9',
        name: 'Wayfarer',
        price: 47.99,
        image: '/products/wayfarer.jpg',
      },
    ],
  },
}

export default function CollectionPage({ params }: { params: { id: string } }) {
  const collection = collections[params.id as keyof typeof collections]

  if (!collection) {
    notFound()
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">{collection.name}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {collection.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collection.products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>
    </div>
  )
} 