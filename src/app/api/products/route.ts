import { NextResponse } from 'next/server'
import { products } from '@/lib/products'

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const product = await request.json()
    
    // In a real app, this would save to a database
    // For now, we'll just add it to the in-memory array
    const newProduct = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
    }
    products.push(newProduct)
    
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return new NextResponse('Error creating product', { status: 400 })
  }
} 