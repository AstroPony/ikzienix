import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache TTLs in seconds
export const CACHE_TTL = {
  PRODUCTS: 3600, // 1 hour
  PRODUCT: 1800, // 30 minutes
  CATEGORIES: 86400, // 24 hours
  ORDERS: 300, // 5 minutes
  REVIEWS: 1800, // 30 minutes
  USER_PROFILE: 300, // 5 minutes
  INSTAGRAM_POSTS: 1800, // 30 minutes
  ANALYTICS: 300, // 5 minutes
}

// Cache instances
export const analyticsCache = {
  get: async <T>(key: string) => getCachedData<T>(`analytics:${key}`),
  set: async <T>(key: string, data: T) => setCachedData(`analytics:${key}`, data, CACHE_TTL.ANALYTICS),
  invalidate: async (pattern: string) => invalidateCache(`analytics:${pattern}`)
}

export const ordersCache = {
  get: async <T>(key: string) => getCachedData<T>(`orders:${key}`),
  set: async <T>(key: string, data: T) => setCachedData(`orders:${key}`, data, CACHE_TTL.ORDERS),
  invalidate: async (pattern: string) => invalidateCache(`orders:${pattern}`)
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key)
    return data
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  ttl: number = CACHE_TTL.PRODUCTS
): Promise<void> {
  try {
    await redis.set(key, data, { ex: ttl })
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Cache invalidation error:', error)
  }
}

// Cache key generators
export const CACHE_KEYS = {
  products: (params?: { category?: string; search?: string; page?: number }) => {
    const key = ['products']
    if (params?.category) key.push(`category:${params.category}`)
    if (params?.search) key.push(`search:${params.search}`)
    if (params?.page) key.push(`page:${params.page}`)
    return key.join(':')
  },
  product: (id: string) => `product:${id}`,
  categories: () => 'categories',
  orders: (userId: string, page?: number) => {
    const key = ['orders', userId]
    if (page) key.push(`page:${page}`)
    return key.join(':')
  },
  order: (id: string) => `order:${id}`,
  reviews: (productId: string, page?: number) => {
    const key = ['reviews', productId]
    if (page) key.push(`page:${page}`)
    return key.join(':')
  },
  userProfile: (userId: string) => `user:${userId}:profile`,
  instagramPosts: () => 'instagram:posts',
} 