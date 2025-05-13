import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { handleAPIError, successResponse } from '@/lib/api-utils'
import { Review } from '@/types/review'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get all reviews for the product
    const reviewsRef = db.collection('reviews')
    const reviewsQuery = reviewsRef
      .where('productId', '==', id)
      .orderBy('createdAt', 'desc')

    const reviews = await reviewsQuery.get()
    const reviewData = reviews.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Review[]

    // Calculate stats
    const total = reviewData.length
    const average = total > 0
      ? reviewData.reduce((acc, review) => acc + review.rating, 0) / total
      : 0

    // Calculate distribution
    const distribution = reviewData.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1
      return acc
    }, {} as { [key: number]: number })

    return successResponse({
      stats: {
        average,
        total,
        distribution
      },
      reviews: reviewData
    })
  } catch (error) {
    return handleAPIError(error)
  }
} 