export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images: string[]
  category: string
  collection?: string
  inStock: boolean
  featured: boolean
  new?: boolean
  sale?: boolean
  salePrice?: number
  colors?: string[]
  sizes?: string[]
  rating?: number
  reviews?: number
  createdAt: string
  updatedAt: string
  specifications: {
    frameMaterial: string
    lensMaterial: string
    lensWidth: string
    bridgeWidth: string
    templeLength: string
    weight: string
    uvProtection: string
    polarization?: boolean
  }
  features: string[]
  careInstructions: string[]
  warranty: string
  shipping: {
    freeShipping: boolean
    estimatedDelivery: string
    returnPolicy: string
  }
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