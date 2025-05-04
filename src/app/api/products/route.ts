import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching products...')
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: true,
        inStock: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    console.log(`Found ${products.length} products`)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch products' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json()
    console.log('Creating new product:', product)
    const newProduct = await prisma.product.create({
      data: {
        ...product,
        featured: product.featured || false,
      },
    })
    console.log('Product created:', newProduct)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create product' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 