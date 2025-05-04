import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({ where: { id } })

    if (!product) {
      return new NextResponse('Product not found', { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch product' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const product = await prisma.product.update({
      where: { id },
      data,
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update product' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting product:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete product' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 