'use client'

import { useState } from 'react'
import ReviewStars from './ReviewStars'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface ReviewFormProps {
  productId: string
  onSubmit: (review: {
    rating: number
    title: string
    comment: string
    images?: string[]
  }) => void
}

const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
  images: z.array(z.string()).optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>

export default function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: '', comment: '', images: [] },
  })
  const images = watch('images') || []

  const onFormSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newImages = Array.from(files).map(file => URL.createObjectURL(file))
    setValue('images', [...images, ...newImages])
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <ReviewStars
          rating={watch('rating')}
          size="lg"
          interactive
          onChange={val => setValue('rating', val, { shouldValidate: true })}
        />
        {errors.rating && <div className="text-danger small">{errors.rating.message}</div>}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.title ? 'is-invalid' : ''}`}
        />
        {errors.title && <div className="text-danger small">{errors.title.message}</div>}
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Review
        </label>
        <textarea
          id="comment"
          {...register('comment')}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.comment ? 'is-invalid' : ''}`}
          rows={4}
        />
        {errors.comment && <div className="text-danger small">{errors.comment.message}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images (optional)
        </label>
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-24 h-24">
              <Image
                src={image}
                alt={`Review image ${index + 1}`}
                fill
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() => setValue('images', images.filter((_, i) => i !== index))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-primary">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </label>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || watch('rating') === 0}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
} 