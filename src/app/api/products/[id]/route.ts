import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docRef = db.collection('products').doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return new NextResponse('Product not found', { status: 404 })
    }

    const product = {
      id: doc.id,
      ...doc.data()
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
    
    const docRef = db.collection('products').doc(id)
    await docRef.update({
      ...data,
      updatedAt: new Date()
    })

    const updatedDoc = await docRef.get()
    const product = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    }

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
    await db.collection('products').doc(id).delete()
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting product:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete product' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 