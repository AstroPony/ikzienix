import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { handleAPIError, successResponse, APIError } from '@/lib/api-utils'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewDoc = await db.collection('reviews').doc(params.id).get()
    
    if (!reviewDoc.exists) {
      throw new APIError('Review not found', 404)
    }

    const reviewData = reviewDoc.data()
    if (!reviewData) {
      throw new APIError('Review data not found', 404)
    }

    return successResponse({
      id: reviewDoc.id,
      ...reviewData
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new APIError('Unauthorized', 401)
    }

    const { helpful } = await req.json()
    if (typeof helpful !== 'boolean') {
      throw new APIError('Helpful status is required', 400)
    }

    const reviewRef = db.collection('reviews').doc(params.id)
    const reviewDoc = await reviewRef.get()

    if (!reviewDoc.exists) {
      throw new APIError('Review not found', 404)
    }

    const reviewData = reviewDoc.data()
    if (!reviewData) {
      throw new APIError('Review data not found', 404)
    }

    // Update helpful count
    const newHelpfulCount = helpful ? reviewData.helpful + 1 : Math.max(0, reviewData.helpful - 1)
    
    await reviewRef.update({
      helpful: newHelpfulCount,
      updatedAt: new Date()
    })

    return successResponse({
      id: reviewDoc.id,
      ...reviewData,
      helpful: newHelpfulCount
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new APIError('Unauthorized', 401)
    }

    const reviewRef = db.collection('reviews').doc(params.id)
    const reviewDoc = await reviewRef.get()

    if (!reviewDoc.exists) {
      throw new APIError('Review not found', 404)
    }

    const reviewData = reviewDoc.data()
    if (!reviewData) {
      throw new APIError('Review data not found', 404)
    }

    // Only allow users to delete their own reviews or admins
    if (reviewData.userId !== session.user.id && session.user.role !== 'admin') {
      throw new APIError('Unauthorized', 401)
    }

    // Update product rating
    const productRef = db.collection('products').doc(reviewData.productId)
    const productDoc = await productRef.get()
    
    if (productDoc.exists) {
      const productData = productDoc.data()
      const currentRating = productData?.rating || 0
      const currentReviews = productData?.reviews || 0
      
      if (currentReviews > 1) {
        const newRating = ((currentRating * currentReviews) - reviewData.rating) / (currentReviews - 1)
        await productRef.update({
          rating: newRating,
          reviews: currentReviews - 1,
          updatedAt: new Date()
        })
      } else {
        await productRef.update({
          rating: 0,
          reviews: 0,
          updatedAt: new Date()
        })
      }
    }

    await reviewRef.delete()
    return successResponse({ success: true })
  } catch (error) {
    return handleAPIError(error)
  }
} 