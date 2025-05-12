'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

export default function NewsletterSubscription() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      setIsSubmitting(true)
      setSubscriptionStatus('idle')

      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Subscription failed')
      }

      setSubscriptionStatus('success')
      reset()
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setSubscriptionStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-light rounded-3 p-4">
      <h3 className="h5 mb-3">Subscribe to Our Newsletter</h3>
      <p className="text-muted small mb-3">
        Stay updated with our latest products, exclusive offers, and fashion trends.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-3">
        <div className="input-group">
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="Enter your email"
            {...register('email')}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
        {errors.email && (
          <div className="invalid-feedback d-block">
            {errors.email.message}
          </div>
        )}
      </form>

      {subscriptionStatus === 'success' && (
        <div className="alert alert-success mb-0" role="alert">
          Thank you for subscribing! Please check your email to confirm your subscription.
        </div>
      )}

      {subscriptionStatus === 'error' && (
        <div className="alert alert-danger mb-0" role="alert">
          Oops! Something went wrong. Please try again later.
        </div>
      )}

      <p className="text-muted small mb-0 mt-3">
        By subscribing, you agree to our{' '}
        <a href="/privacy-policy" className="text-decoration-none">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
} 