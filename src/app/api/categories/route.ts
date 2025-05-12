import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/lib/cache'

export async function GET() {
  try {
    // Try to get from cache first
    const cacheKey = CACHE_KEYS.categories()
    const cachedCategories = await getCachedData<string[]>(cacheKey)

    if (cachedCategories) {
      return NextResponse.json(cachedCategories)
    }

    // If not in cache, fetch from database
    const categoriesRef = collection(db, 'categories')
    const snapshot = await getDocs(categoriesRef)
    const categories = snapshot.docs.map(doc => doc.data().name)

    // Cache the categories
    await setCachedData(cacheKey, categories, CACHE_TTL.CATEGORIES)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 