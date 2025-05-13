import { Review } from '@/types/review'
import { getDataBackend } from './backend'

// --- FIREBASE IMPLEMENTATION ---
async function getReviewsFirebase(productId: string): Promise<Review[]> {
  // TODO: Implement Firestore query here
  return []
}

async function addReviewFirebase(productId: string, review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
  // TODO: Implement Firestore add here
  throw new Error('Not implemented')
}

// --- PRISMA IMPLEMENTATION ---
import { prisma } from '@/lib/prisma'

interface PrismaReview {
  id: string
  productId: string
  userId: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string
    image: string | null
  }
}

async function getReviewsPrisma(productId: string): Promise<Review[]> {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return reviews.map((review: PrismaReview) => ({
    id: review.id,
    productId: review.productId,
    userId: review.userId,
    user: {
      id: review.user.id,
      name: review.user.name,
      avatar: review.user.image || undefined,
    },
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  }))
}

async function addReviewPrisma(productId: string, review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
  const created = await prisma.review.create({
    data: {
      productId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
    },
    include: { user: { select: { id: true, name: true, image: true } } },
  })
  return {
    id: created.id,
    productId: created.productId,
    userId: created.userId,
    user: {
      id: created.user.id,
      name: created.user.name,
      avatar: created.user.image || undefined,
    },
    rating: created.rating,
    comment: created.comment,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  }
}

// --- EXPORTED ABSTRACTION ---
export async function getReviews(productId: string): Promise<Review[]> {
  const backend = getDataBackend()
  if (backend === 'firebase') return getReviewsFirebase(productId)
  return getReviewsPrisma(productId)
}

export async function addReview(productId: string, review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
  const backend = getDataBackend()
  if (backend === 'firebase') return addReviewFirebase(productId, review)
  return addReviewPrisma(productId, review)
} 