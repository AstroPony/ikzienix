import { placeholderImages } from './placeholder-images'

export const mockProducts = [
  {
    id: '1',
    name: 'Classic Black',
    description: 'Timeless black sunglasses perfect for any occasion',
    price: 29.99,
    image: '/images/classic-black.jpg',
    category: 'classic',
    stock: 100
  },
  {
    id: '2',
    name: 'Retro Gold',
    description: 'Vintage-inspired gold frame sunglasses',
    price: 34.99,
    image: '/images/retro-gold.jpg',
    category: 'retro',
    stock: 75
  },
  {
    id: '3',
    name: 'Sport Red',
    description: 'Durable sports sunglasses with red frame',
    price: 39.99,
    image: '/images/sport-red.jpg',
    category: 'sport',
    stock: 50
  },
  {
    id: '4',
    name: 'Aviator Silver',
    description: 'Classic aviator style with silver metal frame',
    price: 44.99,
    image: '/images/aviator-silver.jpg',
    category: 'aviator',
    stock: 60
  },
  {
    id: '5',
    name: 'Round Brown',
    description: 'Trendy round sunglasses with brown frame',
    price: 32.99,
    image: '/images/round-brown.jpg',
    category: 'round',
    stock: 80
  },
  {
    id: '6',
    name: 'Cat Eye Black',
    description: 'Elegant cat eye sunglasses in black',
    price: 37.99,
    image: '/images/cat-eye-black.jpg',
    category: 'cat-eye',
    stock: 45
  }
]

export const mockCollections = [
  {
    id: 'classic',
    name: 'Classic Collection',
    description: 'Timeless designs that never go out of style',
    image: placeholderImages['classic-black']
  },
  {
    id: 'retro',
    name: 'Retro Collection',
    description: 'Vintage-inspired frames with modern comfort',
    image: placeholderImages['retro-round']
  },
  {
    id: 'sport',
    name: 'Sport Collection',
    description: 'Durable and comfortable sunglasses for active lifestyles',
    image: placeholderImages['sport-shield']
  },
  {
    id: 'aviator',
    name: 'Aviator Collection',
    description: 'Classic aviator styles for a bold look',
    image: placeholderImages['aviator-gold']
  },
  {
    id: 'round',
    name: 'Round Collection',
    description: 'Trendy round frames for a unique style',
    image: placeholderImages['retro-round']
  },
  {
    id: 'cat-eye',
    name: 'Cat Eye Collection',
    description: 'Elegant cat eye frames for a sophisticated look',
    image: placeholderImages['cat-eye']
  }
] 