import { NextRequest, NextResponse } from 'next/server'
import { getCachedData, setCachedData } from './cache'

const rateLimit = (options: {
  uniqueTokenPerInterval?: number
  interval?: number
}) => {
  const { uniqueTokenPerInterval = 500, interval = 60000 } = options

  return async function handler(request: NextRequest) {
    const ip = request.ip ?? '127.0.0.1'
    const key = `ratelimit:${ip}`
    
    const currentCount = await getCachedData<number>(key) || 0
    const tokenCount = currentCount + 1

    if (tokenCount > uniqueTokenPerInterval) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    await setCachedData(key, tokenCount, interval / 1000)
    return null
  }
}

export function withRateLimit(handler: (request: NextRequest) => Promise<NextResponse>, requestsPerMinute: number = 60) {
  const limiter = rateLimit({
    interval: 60000, // 1 minute
    uniqueTokenPerInterval: requestsPerMinute
  })

  return async function rateLimit(request: NextRequest) {
    const response = await limiter(request)
    if (response) {
      return response
    }
    return handler(request)
  }
} 