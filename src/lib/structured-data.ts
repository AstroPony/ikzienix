import { Product } from '@/types/product'

export function generateProductStructuredData(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images[0],
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Ikzienix'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `https://ikzienix.com/product/${product.slug}`
    }
  }
}

export function generateBreadcrumbStructuredData(paths: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: paths.map((path, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: path.name,
      item: `https://ikzienix.com${path.url}`
    }))
  }
} 