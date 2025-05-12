import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''
  const category = searchParams.get('category')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  try {
    const products = await getAllProducts()
    
    let filteredProducts = products.filter(product => {
      const matchesQuery = product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      
      const matchesCategory = !category || product.category === category
      
      const matchesPrice = (!minPrice || product.price >= Number(minPrice)) &&
        (!maxPrice || product.price <= Number(maxPrice))
      
      return matchesQuery && matchesCategory && matchesPrice
    })

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
} 