import { placeholderImages } from './placeholder-images'
import { Product, defaultProduct } from '@/types/product'

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Black',
    description: 'Timeless black sunglasses with UV400 protection and lightweight frame. Perfect for everyday street style.',
    price: 29.99,
    images: [{ id: 'classic-black-1', url: placeholderImages['classic-black'], alt: 'Classic Black' }],
    category: 'classic',
    rating: 4.8,
    featured: true,
    colors: ['Black', 'Tortoise'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sku: 'CLS-BLK-001',
    slug: 'classic-black',
    specifications: {
      frameMaterial: 'Acetate',
      lensMaterial: 'CR-39',
      lensWidth: '55mm',
      bridgeWidth: '18mm',
      templeLength: '145mm',
      weight: '25g',
      uvProtection: 'UV400',
      polarization: true
    },
    features: [
      '100% UV Protection',
      'Polarized Lenses',
      'Lightweight Frame',
      'Includes Microfiber Case'
    ],
    careInstructions: [
      'Clean with microfiber cloth',
      'Store in case when not in use',
      'Avoid extreme temperatures'
    ],
    warranty: '2-year manufacturer warranty',
    shipping: {
      freeShipping: true,
      estimatedDelivery: '2-3 business days',
      returnPolicy: '30 days return policy'
    },
    brand: 'Ikzienix',
    new: false,
    sale: false,
    reviewCount: 0
  },
  {
    id: '2',
    name: 'Retro Round',
    description: 'Vintage-inspired round sunglasses with a modern twist. Channel your inner rockstar with these iconic frames.',
    price: 34.99,
    images: [{ id: 'retro-round-1', url: placeholderImages['retro-round'], alt: 'Retro Round' }],
    category: 'retro',
    rating: 4.7,
    featured: true,
    colors: ['Gold', 'Silver', 'Rose Gold'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sku: 'RTR-RND-002',
    slug: 'retro-round',
    specifications: {
      frameMaterial: 'Metal',
      lensMaterial: 'Glass',
      lensWidth: '50mm',
      bridgeWidth: '16mm',
      templeLength: '140mm',
      weight: '28g',
      uvProtection: 'UV400',
      polarization: true
    },
    features: [
      '100% UV Protection',
      'Polarized Lenses',
      'Metal Frame',
      'Includes Hard Case'
    ],
    careInstructions: [
      'Clean with microfiber cloth',
      'Store in case when not in use',
      'Avoid extreme temperatures'
    ],
    warranty: '2-year manufacturer warranty',
    shipping: {
      freeShipping: true,
      estimatedDelivery: '2-3 business days',
      returnPolicy: '30 days return policy'
    },
    brand: 'Ikzienix',
    new: false,
    sale: false,
    reviewCount: 0
  },
  {
    id: '3',
    name: 'Sport Shield',
    description: 'Performance sunglasses designed for active lifestyles. Stay protected and stylish during your workouts.',
    price: 39.99,
    images: [{ id: 'sport-shield-1', url: placeholderImages['sport-shield'], alt: 'Sport Shield' }],
    category: 'sport',
    rating: 4.9,
    featured: true,
    colors: ['Black', 'Blue', 'Red'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sku: 'SPT-SHL-003',
    slug: 'sport-shield',
    specifications: {
      frameMaterial: 'TR90',
      lensMaterial: 'Polycarbonate',
      lensWidth: '60mm',
      bridgeWidth: '20mm',
      templeLength: '150mm',
      weight: '22g',
      uvProtection: 'UV400',
      polarization: true
    },
    features: [
      '100% UV Protection',
      'Polarized Lenses',
      'Impact Resistant',
      'Non-slip Nose Pads',
      'Includes Sports Case'
    ],
    careInstructions: [
      'Clean with microfiber cloth',
      'Store in case when not in use',
      'Avoid extreme temperatures'
    ],
    warranty: '2-year manufacturer warranty',
    shipping: {
      freeShipping: true,
      estimatedDelivery: '2-3 business days',
      returnPolicy: '30 days return policy'
    },
    brand: 'Ikzienix',
    new: false,
    sale: false,
    reviewCount: 0
  },
  {
    id: '4',
    name: 'Aviator Gold',
    description: 'Classic aviator style with gold-tone frame and mirrored lenses. The ultimate statement piece for any outfit.',
    price: 44.99,
    images: [{ id: 'aviator-gold-1', url: placeholderImages['aviator-gold'], alt: 'Aviator Gold' }],
    category: 'aviator',
    rating: 4.8,
    featured: true,
    colors: ['Gold', 'Silver'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sku: 'AVI-GLD-004',
    slug: 'aviator-gold',
    specifications: {
      frameMaterial: 'Metal',
      lensMaterial: 'Glass',
      lensWidth: '58mm',
      bridgeWidth: '17mm',
      templeLength: '145mm',
      weight: '30g',
      uvProtection: 'UV400',
      polarization: true
    },
    features: [
      '100% UV Protection',
      'Polarized Lenses',
      'Metal Frame',
      'Mirrored Lenses',
      'Includes Premium Case'
    ],
    careInstructions: [
      'Clean with microfiber cloth',
      'Store in case when not in use',
      'Avoid extreme temperatures'
    ],
    warranty: '2-year manufacturer warranty',
    shipping: {
      freeShipping: true,
      estimatedDelivery: '2-3 business days',
      returnPolicy: '30 days return policy'
    },
    brand: 'Ikzienix',
    new: false,
    sale: false,
    reviewCount: 0
  },
  {
    id: '5',
    name: 'Cat Eye',
    description: 'Feminine cat-eye sunglasses with a modern twist. Perfect for adding a touch of retro glam to your look.',
    price: 32.99,
    images: [{ id: 'cat-eye-1', url: placeholderImages['cat-eye'], alt: 'Cat Eye' }],
    category: 'cat-eye',
    rating: 4.6,
    featured: false,
    colors: ['Tortoise', 'Black', 'Crystal'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sku: 'CAT-EYE-005',
    slug: 'cat-eye',
    specifications: {
      frameMaterial: 'Acetate',
      lensMaterial: 'CR-39',
      lensWidth: '52mm',
      bridgeWidth: '17mm',
      templeLength: '140mm',
      weight: '24g',
      uvProtection: 'UV400',
      polarization: true
    },
    features: [
      '100% UV Protection',
      'Polarized Lenses',
      'Cat-Eye Frame',
      'Includes Soft Pouch'
    ],
    careInstructions: [
      'Clean with microfiber cloth',
      'Store in case when not in use',
      'Avoid extreme temperatures'
    ],
    warranty: '2-year manufacturer warranty',
    shipping: {
      freeShipping: true,
      estimatedDelivery: '2-3 business days',
      returnPolicy: '30 days return policy'
    },
    brand: 'Ikzienix',
    new: false,
    sale: false,
    reviewCount: 0
  },
  {
    id: '6',
    name: 'Wayfarer',
    description: 'Iconic wayfarer design with polarized lenses. A timeless classic that never goes out of style.',
    price: 37.99,
    images: [{ id: 'wayfarer-1', url: placeholderImages['wayfarer'], alt: 'Wayfarer' }],
    category: 'wayfarer',
    rating: 4.9,
    featured: true,
    colors: ['Black', 'Tortoise', 'Crystal'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sku: 'WYF-CLS-006',
    slug: 'wayfarer',
    specifications: {
      frameMaterial: 'Acetate',
      lensMaterial: 'CR-39',
      lensWidth: '54mm',
      bridgeWidth: '19mm',
      templeLength: '145mm',
      weight: '26g',
      uvProtection: 'UV400',
      polarization: true
    },
    features: [
      '100% UV Protection',
      'Polarized Lenses',
      'Acetate Frame',
      'Includes Classic Case'
    ],
    careInstructions: [
      'Clean with microfiber cloth',
      'Store in case when not in use',
      'Avoid extreme temperatures'
    ],
    warranty: '2-year manufacturer warranty',
    shipping: {
      freeShipping: true,
      estimatedDelivery: '2-3 business days',
      returnPolicy: '30 days return policy'
    },
    brand: 'Ikzienix',
    new: false,
    sale: false,
    reviewCount: 0
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