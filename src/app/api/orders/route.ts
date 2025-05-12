import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { Query, CollectionReference } from 'firebase-admin/firestore'
import { ordersCache } from '@/lib/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { withRateLimit } from '@/lib/rate-limit'
import { handleAPIError, successResponse, validateRequiredFields, APIError } from '@/lib/api-utils'

async function getHandler(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const cacheKey = `orders-${page}-${limit}-${userId}-${status}`
    const cachedData = ordersCache.get(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    const ordersRef = db.collection('orders') as CollectionReference
    let ordersQuery: Query = ordersRef

    // If not admin, only show user's orders
    if (session.user.role !== 'admin') {
      ordersQuery = ordersQuery.where('userId', '==', session.user.id)
    } else if (userId) {
      ordersQuery = ordersQuery.where('userId', '==', userId)
    }

    if (status) {
      ordersQuery = ordersQuery.where('status', '==', status)
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

    ordersCache.set(cacheKey, response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

async function postHandler(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new APIError('Unauthorized', 401)
    }

    const data = await request.json()
    validateRequiredFields(data, ['items', 'shippingAddress', 'paymentMethod'])

    // Create order
    const orderRef = await db.collection('orders').add({
      userId: session.user.id,
      items: data.items,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      status: 'pending',
      total: data.total,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Get the created order
    const orderDoc = await orderRef.get()
    const orderData = orderDoc.data()
    
    if (!orderData) {
      throw new APIError('Failed to create order', 500)
    }

    return successResponse({
      id: orderDoc.id,
      ...orderData
    }, 201)
  } catch (error) {
    return handleAPIError(error)
  }
}

// Limit to 30 requests per minute for GET
export const GET = withRateLimit(getHandler, 30)

// Limit to 5 orders per minute for POST
export const POST = withRateLimit(postHandler, 5) 