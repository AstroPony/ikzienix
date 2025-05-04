export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  collection: string
  inStock: boolean
  featured?: boolean
  new?: boolean
  sale?: boolean
  salePrice?: number
  colors?: string[]
  sizes?: string[]
  rating?: number
  reviews?: number
  createdAt: string
  updatedAt: string
} 