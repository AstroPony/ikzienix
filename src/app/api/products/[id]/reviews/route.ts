import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getReviews, addReview } from '@/lib/data/reviews'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    const reviews = await getReviews(productId)
    // Calculate stats
    const total = reviews.length
    const average = total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : 0
    const distribution = reviews.reduce((acc: { [key: number]: number }, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1
      return acc
    }, {})
    return NextResponse.json({
      reviews,
      stats: { total, average, distribution },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const productId = params.id
    const { rating, comment } = await request.json()
    if (!rating || !comment) {
      return NextResponse.json(
        { error: 'Rating and comment are required' },
        { status: 400 }
      )
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }
    const review = await addReview(productId, {
      userId: session.user.id,
      user: { id: session.user.id, name: session.user.name || 'Anonymous' },
      rating,
      comment,
      productId,
    })
    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
} 