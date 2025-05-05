import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function GET() {
  try {
    console.log('Fetching products...')
    const productsRef = db.collection('products')
    const snapshot = await productsRef.get()
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
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
    const docRef = await db.collection('products').add({
      ...product,
      featured: product.featured || false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const newProduct = {
      id: docRef.id,
      ...product,
      featured: product.featured || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
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