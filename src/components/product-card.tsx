'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, Button } from 'react-bootstrap'
import { useCart } from '@/lib/cart-context'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { dispatch } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
    })
  }

  return (
    <Card className="h-100">
      <div className="position-relative" style={{ height: '200px' }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-fit-cover"
        />
      </div>
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text className="h5">${product.price.toFixed(2)}</Card.Text>
      </Card.Body>
      <Card.Footer className="bg-white border-top-0">
        <div className="d-grid gap-2">
          <Button
            variant="outline-dark"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            View Details
          </Button>
          <Button variant="dark" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
} 