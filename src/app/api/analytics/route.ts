import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { Query, CollectionReference } from 'firebase-admin/firestore'
import { analyticsCache } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const cacheKey = `analytics-${page}-${limit}-${startDate}-${endDate}`
    const cachedData = analyticsCache.get(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    const ordersRef = db.collection('orders') as CollectionReference
    let ordersQuery: Query = ordersRef

    if (startDate && endDate) {
      ordersQuery = ordersQuery
        .where('createdAt', '>=', new Date(startDate))
        .where('createdAt', '<=', new Date(endDate))
    }

    const totalDocs = await ordersQuery.count().get()
    const totalOrders = totalDocs.data().count

    const orders = await ordersQuery
      .orderBy('createdAt', 'desc')
      .offset((page - 1) * limit)
      .limit(limit)
      .get()

    const orderData = orders.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const totalPages = Math.ceil(totalOrders / limit)

    const response = {
      orders: orderData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }

    analyticsCache.set(cacheKey, response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
} 