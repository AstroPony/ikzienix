import { Product } from '@/types/product'

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${slug}`)
    if (!response.ok) {
      return null
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
} 