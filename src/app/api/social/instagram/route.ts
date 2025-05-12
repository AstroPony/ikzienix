import { NextResponse } from 'next/server'
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/lib/cache'

const INSTAGRAM_API_URL = 'https://graph.instagram.com/me/media'
const FIELDS = 'id,caption,media_type,media_url,permalink,thumbnail_url'

export async function GET() {
  try {
    // Try to get from cache first
    const cacheKey = CACHE_KEYS.instagramPosts()
    const cachedPosts = await getCachedData(cacheKey)

    if (cachedPosts) {
      return NextResponse.json({ posts: cachedPosts })
    }

    // If not in cache, fetch from Instagram API
    const response = await fetch(
      `${INSTAGRAM_API_URL}?fields=${FIELDS}&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram posts')
    }

    const data = await response.json()
    const posts = data.data.slice(0, 6) // Get only the 6 most recent posts

    // Cache the posts
    await setCachedData(cacheKey, posts, CACHE_TTL.INSTAGRAM_POSTS)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Instagram API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    )
  }
} 