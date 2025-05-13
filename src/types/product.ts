export interface ProductImage {
  id: string
  url: string
  alt: string
}

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
  slug: string
  description: string
  price: number
  salePrice?: number
  images: ProductImage[]
  specifications: ProductSpecifications
  category: string
  brand: string
  inStock: boolean
  featured: boolean
  new: boolean
  sale: boolean
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
  sku: string
  colors: string[]
  features: string[]
  careInstructions: string[]
  warranty: string
  shipping: ProductShipping
}

export const defaultProduct: Partial<Product> = {
  images: [],
  colors: [],
  rating: 0,
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