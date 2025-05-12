export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  createdAt: string
  updatedAt: string
  verifiedPurchase: boolean
  helpful: number
  images?: string[]
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    [key: number]: number
  }
} 