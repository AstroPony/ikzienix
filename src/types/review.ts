export interface Review {
  id: string
  productId: string
  userId: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    [key: number]: number
  }
} 