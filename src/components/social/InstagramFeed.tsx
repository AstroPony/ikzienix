'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface InstagramPost {
  id: string
  media_url: string
  permalink: string
  caption: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  thumbnail_url?: string
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const response = await fetch('/api/social/instagram')
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts')
        }
        const data = await response.json()
        setPosts(data.posts)
      } catch (error) {
        console.error('Error fetching Instagram posts:', error)
        setError('Failed to load Instagram feed')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstagramPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="row g-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="col-4">
            <div className="ratio ratio-1x1 bg-light rounded-3 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-warning mb-0" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="row g-3">
      {posts.map((post) => (
        <div key={post.id} className="col-4">
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="d-block position-relative ratio ratio-1x1 rounded-3 overflow-hidden"
          >
            <Image
              src={post.media_type === 'VIDEO' ? post.thumbnail_url! : post.media_url}
              alt={post.caption || 'Instagram post'}
              fill
              className="object-fit-cover"
              sizes="(max-width: 768px) 33vw, 25vw"
            />
            {post.media_type === 'VIDEO' && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <i className="bi bi-play-circle-fill text-white fs-1" />
              </div>
            )}
            {post.media_type === 'CAROUSEL_ALBUM' && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <i className="bi bi-images text-white fs-1" />
              </div>
            )}
          </a>
        </div>
      ))}
    </div>
  )
} 