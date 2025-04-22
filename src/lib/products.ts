export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Black',
    description: 'Timeless black sunglasses with UV400 protection and lightweight frame.',
    price: 29.99,
    image: '/products/classic-black.jpg',
    category: 'classic'
  },
  {
    id: '2',
    name: 'Retro Round',
    description: 'Vintage-inspired round sunglasses perfect for any occasion.',
    price: 34.99,
    image: '/products/retro-round.jpg',
    category: 'retro'
  },
  {
    id: '3',
    name: 'Sport Shield',
    description: 'Performance sunglasses designed for active lifestyles.',
    price: 39.99,
    image: '/products/sport-shield.jpg',
    category: 'sport'
  },
  {
    id: '4',
    name: 'Aviator Gold',
    description: 'Classic aviator style with gold-tone frame and mirrored lenses.',
    price: 44.99,
    image: '/products/aviator-gold.jpg',
    category: 'aviator'
  },
  {
    id: '5',
    name: 'Cat Eye',
    description: 'Feminine cat-eye sunglasses with a modern twist.',
    price: 32.99,
    image: '/products/cat-eye.jpg',
    category: 'cat-eye'
  },
  {
    id: '6',
    name: 'Wayfarer',
    description: 'Iconic wayfarer design with polarized lenses.',
    price: 37.99,
    image: '/products/wayfarer.jpg',
    category: 'wayfarer'
  }
] 