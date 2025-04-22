'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { products } from '@/lib/products'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { dispatch } = useCart()
  const product = products.find(p => p.id === params.id)

  if (!product) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    )
  }

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      }
    })
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-square"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>UV400 protection</li>
              <li>Lightweight and durable frame</li>
              <li>Comfortable fit for all-day wear</li>
              <li>Scratch-resistant lenses</li>
            </ul>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
} 