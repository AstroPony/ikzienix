import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { motion } from 'framer-motion'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  const { dispatch } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({
      type: 'ADD_ITEM',
      payload: { id, name, price, image },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/product/${id}`}>
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={image}
            alt={name}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-sm text-gray-700">{name}</h3>
          <p className="mt-1 text-lg font-medium text-gray-900">
            ${price.toFixed(2)}
          </p>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        className="mt-4 w-full btn btn-primary"
      >
        Add to Cart
      </button>
    </motion.div>
  )
} 