import { Product } from '@/types/product'
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from './cache'

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    // Try to get from cache first
    const cacheKey = CACHE_KEYS.product(slug)
    const cachedProduct = await getCachedData<Product>(cacheKey)
    
    if (cachedProduct) {
      return cachedProduct
    }

    // If not in cache, fetch from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${slug}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch product')
    }

    const product = await response.json()
    
    // Cache the product
    await setCachedData(cacheKey, product, CACHE_TTL.PRODUCT)
    
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function getProducts(params?: {
  category?: string
  search?: string
  page?: number
}): Promise<{
  products: Product[]
  hasMore: boolean
}> {
  try {
    // Try to get from cache first
    const cacheKey = CACHE_KEYS.products(params)
    const cachedData = await getCachedData<{
      products: Product[]
      hasMore: boolean
    }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    // If not in cache, fetch from API
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.page) searchParams.set('page', params.page.toString())

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/products?${searchParams.toString()}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await response.json()
    
    // Cache the results
    await setCachedData(cacheKey, data, CACHE_TTL.PRODUCTS)
    
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      products: [],
      hasMore: false
    }
  }
} 