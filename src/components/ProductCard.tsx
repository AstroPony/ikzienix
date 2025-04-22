'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MotionDiv } from './MotionWrapper'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link href={`/products/${id}`}>
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
            width={500}
            height={500}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">{name}</h3>
            <p className="mt-1 text-sm text-gray-500">{category}</p>
          </div>
          <p className="text-sm font-medium text-gray-900">${price.toFixed(2)}</p>
        </div>
      </Link>
    </MotionDiv>
  )
} 