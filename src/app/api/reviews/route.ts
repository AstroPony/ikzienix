import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { withRateLimit } from '@/lib/rate-limit'
import { handleAPIError, successResponse, validateRequiredFields, APIError } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('productId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!productId) {
      throw new APIError('Product ID is required', 400)
    }

    const reviewsRef = db.collection('reviews')
    const reviewsQuery = reviewsRef
      .where('productId', '==', productId)
      .orderBy('createdAt', 'desc')
      .offset((page - 1) * limit)
      .limit(limit)

    const totalDocs = await reviewsQuery.count().get()
    const totalReviews = totalDocs.data().count

    const reviews = await reviewsQuery.get()
    const reviewData = reviews.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const totalPages = Math.ceil(totalReviews / limit)

    return successResponse({
      reviews: reviewData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

async function handler(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new APIError('Unauthorized', 401)
    }

    const { productId, rating, title, comment, images } = await req.json()

    validateRequiredFields({ productId, rating, title, comment }, ['productId', 'rating', 'title', 'comment'])

    // Check if user has purchased the product
    const ordersRef = db.collection('orders')
    const ordersQuery = ordersRef
      .where('userId', '==', session.user.id)
      .where('status', '==', 'completed')
      .where('items', 'array-contains', { productId })

    const orders = await ordersQuery.get()
    const hasPurchased = !orders.empty

    // Create review
    const reviewRef = await db.collection('reviews').add({
      productId,
      userId: session.user.id,
      userName: session.user.name || 'Anonymous',
      rating,
      title,
      comment,
      images: images || [],
      verifiedPurchase: hasPurchased,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Get the created review
    const reviewDoc = await reviewRef.get()
    const reviewData = reviewDoc.data()
    
    if (!reviewData) {
      throw new APIError('Failed to create review', 500)
    }

    // Update product rating
    const productRef = db.collection('products').doc(productId)
    const productDoc = await productRef.get()
    
    if (productDoc.exists) {
      const productData = productDoc.data()
      const currentRating = productData?.rating || 0
      const currentReviews = productData?.reviews || 0
      
      const newRating = ((currentRating * currentReviews) + rating) / (currentReviews + 1)
      
      await productRef.update({
        rating: newRating,
        reviews: currentReviews + 1,
        updatedAt: new Date()
      })
    }

    return successResponse({
      id: reviewDoc.id,
      ...reviewData
    }, 201)
  } catch (error) {
    return handleAPIError(error)
  }
}

export const POST = withRateLimit(handler, 5) // 5 reviews per minute 