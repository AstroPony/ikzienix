import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, limit, startAfter, getDocs, addDoc } from 'firebase/firestore'
import { Product } from '@/types/product'
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 12

    // Try to get from cache first
    const cacheKey = CACHE_KEYS.products({ category, search, page })
    const cachedData = await getCachedData<{
      products: Product[]
      hasMore: boolean
    }>(cacheKey)

    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // If not in cache, fetch from database
    const productsRef = collection(db, 'products')
    let productsQuery = query(productsRef)

    if (category) {
      productsQuery = query(productsQuery, where('category', '==', category))
    }

    if (search) {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple contains check on the name field
      productsQuery = query(
        productsQuery,
        where('name', '>=', search),
        where('name', '<=', search + '\uf8ff')
      )
    }

    // Add pagination
    productsQuery = query(
      productsQuery,
      orderBy('createdAt', 'desc'),
      limit(pageSize + 1) // Fetch one extra to check if there are more
    )

    if (page > 1) {
      const lastDoc = await getDocs(
        query(
          collection(db, 'products'),
          orderBy('createdAt', 'desc'),
          limit((page - 1) * pageSize)
        )
      )
      const lastVisible = lastDoc.docs[lastDoc.docs.length - 1]
      productsQuery = query(productsQuery, startAfter(lastVisible))
    }

    const snapshot = await getDocs(productsQuery)
    const products = snapshot.docs
      .slice(0, pageSize)
      .map((doc) => ({ id: doc.id, ...doc.data() } as Product))

    const hasMore = snapshot.docs.length > pageSize

    const responseData = {
      products,
      hasMore,
    }

    // Cache the results
    await setCachedData(cacheKey, responseData, CACHE_TTL.PRODUCTS)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json()
    console.log('Creating new product:', product)
    const docRef = await addDoc(collection(db, 'products'), {
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