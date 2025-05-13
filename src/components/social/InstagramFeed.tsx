'use client'

import { useState, useEffect } from 'react'
import { InstagramPost } from '@/types/social'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface InstagramFeedProps {
  hashtag: string
  limit?: number
  className?: string
}

interface InstagramError {
  message: string
  code?: string
}

export default function InstagramFeed({ hashtag, limit = 6, className = '' }: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<InstagramError | null>(null)

  useEffect(() => {
    async function fetchInstagramPosts() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/instagram/${hashtag}?limit=${limit}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch Instagram posts: ${response.statusText}`)
        }
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Error loading Instagram posts',
          code: 'INSTAGRAM_FETCH_ERROR'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInstagramPosts()
  }, [hashtag, limit])

  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <LoadingSpinner size="lg" />
        <p className="text-muted mt-3">Loading Instagram feed...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error.message}
        </div>
        <p className="text-muted mt-3">
          Please try again later or check our social media directly.
        </p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted">No Instagram posts found for #{hashtag}</p>
        <p className="text-muted small mt-2">
          Be the first to share your style! Tag us with #{hashtag}
        </p>
      </div>
    )
  }

  return (
    <div className={`instagram-feed ${className}`}>
      <div className="row g-3">
        {posts.map((post) => (
          <div key={post.id} className="col-6 col-md-4">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <div className="card h-100 border-0 shadow-sm">
                <div className="position-relative">
                  <img
                    src={post.imageUrl}
                    alt={post.caption || 'Instagram post'}
                    className="card-img-top"
                    style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-50 text-white small">
                    <i className="bi bi-heart-fill me-1"></i>
                    {post.likes}
                    <i className="bi bi-chat-fill ms-2 me-1"></i>
                    {post.comments}
                  </div>
                </div>
                {post.caption && (
                  <div className="card-body p-3">
                    <p className="card-text small text-muted mb-0">
                      {post.caption.length > 100
                        ? `${post.caption.substring(0, 100)}...`
                        : post.caption}
                    </p>
                  </div>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
} 