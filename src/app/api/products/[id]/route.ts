import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { Product } from '@/types/product'
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL, invalidateCache } from '@/lib/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Try to get from cache first
    const cacheKey = CACHE_KEYS.product(id)
    const cachedProduct = await getCachedData<Product>(cacheKey)

    if (cachedProduct) {
      return NextResponse.json(cachedProduct)
    }

    // If not in cache, fetch from database
    const productRef = doc(db, 'products', id)
    const productDoc = await getDoc(productRef)

    if (!productDoc.exists()) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = {
      id: productDoc.id,
      ...productDoc.data()
    } as Product

    // Cache the product
    await setCachedData(cacheKey, product, CACHE_TTL.PRODUCT)

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    const productRef = doc(db, 'products', id)
    await updateDoc(productRef, {
      ...data,
      updatedAt: new Date().toISOString()
    })

    // Invalidate cache for this product and the products list
    await Promise.all([
      invalidateCache(CACHE_KEYS.product(id)),
      invalidateCache('products:*')
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const productRef = doc(db, 'products', id)
    await deleteDoc(productRef)

    // Invalidate cache for this product and the products list
    await Promise.all([
      invalidateCache(CACHE_KEYS.product(id)),
      invalidateCache('products:*')
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
} 