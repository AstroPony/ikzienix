export interface ProductSpecifications {
  frameMaterial: string
  lensMaterial: string
  lensWidth: string
  bridgeWidth: string
  templeLength: string
  weight: string
  uvProtection: string
  polarization: boolean
}

export interface ProductShipping {
  freeShipping: boolean
  estimatedDelivery: string
  returnPolicy: string
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  images: string[]
  description: string
  category: string
  rating: number
  reviews: number
  featured: boolean
  colors: string[]
  inStock: boolean
  createdAt: string
  updatedAt: string
  sku: string
  slug: string
  specifications: ProductSpecifications
  features: string[]
  careInstructions: string[]
  warranty: string
  shipping: ProductShipping
}

export const defaultProduct: Partial<Product> = {
  images: [],
  colors: [],
  sizes: [],
  rating: 0,
  reviews: 0,
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