import { NextResponse } from 'next/server'
import { products } from '@/lib/products'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await request.json()
    const index = products.findIndex((p) => p.id === params.id)
    
    if (index === -1) {
      return new NextResponse('Product not found', { status: 404 })
    }
    
    products[index] = { ...products[index], ...product }
    return NextResponse.json(products[index])
  } catch (error) {
    return new NextResponse('Error updating product', { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = products.findIndex((p) => p.id === params.id)
  
  if (index === -1) {
    return new NextResponse('Product not found', { status: 404 })
  }
  
  products.splice(index, 1)
  return new NextResponse(null, { status: 204 })
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    return new NextResponse('Product not found', { status: 404 })
  }

  return NextResponse.json(product)
} 