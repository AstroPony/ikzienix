import { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ikzienix.com'
  
  // Get all products
  const products = await getAllProducts()
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/collections',
    '/cart',
    '/checkout',
    '/account',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Product routes
  const productRoutes = products.map(product => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
} 