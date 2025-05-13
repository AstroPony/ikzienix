import { placeholderImages } from './placeholder-images'
import { Product, defaultProduct } from '@/types/product'

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Black',
    description: 'Timeless black sunglasses with UV400 protection and lightweight frame.',
    price: 29.99,
    image: placeholderImages['classic-black'],
    images: [],
    category: 'classic',
    rating: 0,
    reviews: 0,
    featured: false,
    colors: [],
    inStock: true,
    createdAt: '',
    updatedAt: '',
    sku: '',
    slug: '',
    specifications: {
      frameMaterial: '',
      lensMaterial: '',
      lensWidth: '',
      bridgeWidth: '',
      templeLength: '',
      weight: '',
      uvProtection: '',
      polarization: false
    },
    features: [],
    careInstructions: [],
    warranty: '',
    shipping: {
      freeShipping: false,
      estimatedDelivery: '3-5 business days',
      returnPolicy: '30 days return policy'
    }
  },
  {
    id: '2',
    name: 'Retro Round',
    description: 'Vintage-inspired round sunglasses perfect for any occasion.',
    price: 34.99,
    image: placeholderImages['retro-round'],
    images: [],
    category: 'retro',
    rating: 0,
    reviews: 0,
    featured: false,
    colors: [],
    inStock: true,
    createdAt: '',
    updatedAt: '',
    sku: '',
    slug: '',
    specifications: {
      frameMaterial: '',
      lensMaterial: '',
      lensWidth: '',
      bridgeWidth: '',
      templeLength: '',
      weight: '',
      uvProtection: '',
      polarization: false
    },
    features: [],
    careInstructions: [],
    warranty: '',
    shipping: {
      freeShipping: false,
      estimatedDelivery: '3-5 business days',
      returnPolicy: '30 days return policy'
    }
  },
  {
    id: '3',
    name: 'Sport Shield',
    description: 'Performance sunglasses designed for active lifestyles.',
    price: 39.99,
    image: placeholderImages['sport-shield'],
    images: [],
    category: 'sport',
    rating: 0,
    reviews: 0,
    featured: false,
    colors: [],
    inStock: true,
    createdAt: '',
    updatedAt: '',
    sku: '',
    slug: '',
    specifications: {
      frameMaterial: '',
      lensMaterial: '',
      lensWidth: '',
      bridgeWidth: '',
      templeLength: '',
      weight: '',
      uvProtection: '',
      polarization: false
    },
    features: [],
    careInstructions: [],
    warranty: '',
    shipping: {
      freeShipping: false,
      estimatedDelivery: '3-5 business days',
      returnPolicy: '30 days return policy'
    }
  },
  {
    id: '4',
    name: 'Aviator Gold',
    description: 'Classic aviator style with gold-tone frame and mirrored lenses.',
    price: 44.99,
    image: placeholderImages['aviator-gold'],
    images: [],
    category: 'aviator',
    rating: 0,
    reviews: 0,
    featured: false,
    colors: [],
    inStock: true,
    createdAt: '',
    updatedAt: '',
    sku: '',
    slug: '',
    specifications: {
      frameMaterial: '',
      lensMaterial: '',
      lensWidth: '',
      bridgeWidth: '',
      templeLength: '',
      weight: '',
      uvProtection: '',
      polarization: false
    },
    features: [],
    careInstructions: [],
    warranty: '',
    shipping: {
      freeShipping: false,
      estimatedDelivery: '3-5 business days',
      returnPolicy: '30 days return policy'
    }
  },
  {
    id: '5',
    name: 'Cat Eye',
    description: 'Feminine cat-eye sunglasses with a modern twist.',
    price: 32.99,
    image: placeholderImages['cat-eye'],
    images: [],
    category: 'cat-eye',
    rating: 0,
    reviews: 0,
    featured: false,
    colors: [],
    inStock: true,
    createdAt: '',
    updatedAt: '',
    sku: '',
    slug: '',
    specifications: {
      frameMaterial: '',
      lensMaterial: '',
      lensWidth: '',
      bridgeWidth: '',
      templeLength: '',
      weight: '',
      uvProtection: '',
      polarization: false
    },
    features: [],
    careInstructions: [],
    warranty: '',
    shipping: {
      freeShipping: false,
      estimatedDelivery: '3-5 business days',
      returnPolicy: '30 days return policy'
    }
  },
  {
    id: '6',
    name: 'Wayfarer',
    description: 'Iconic wayfarer design with polarized lenses.',
    price: 37.99,
    image: placeholderImages['wayfarer'],
    images: [],
    category: 'wayfarer',
    rating: 0,
    reviews: 0,
    featured: false,
    colors: [],
    inStock: true,
    createdAt: '',
    updatedAt: '',
    sku: '',
    slug: '',
    specifications: {
      frameMaterial: '',
      lensMaterial: '',
      lensWidth: '',
      bridgeWidth: '',
      templeLength: '',
      weight: '',
      uvProtection: '',
      polarization: false
    },
    features: [],
    careInstructions: [],
    warranty: '',
    shipping: {
      freeShipping: false,
      estimatedDelivery: '3-5 business days',
      returnPolicy: '30 days return policy'
    }
  }
]

export async function getProduct(slug: string): Promise<Product | null> {
  // TODO: Implement actual product fetching from your database
  // This is a placeholder implementation
  return null
}

export async function getAllProducts(): Promise<Product[]> {
  // TODO: Implement actual products fetching from your database
  // This is a placeholder implementation
  return []
} 