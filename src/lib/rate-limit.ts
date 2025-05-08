import { NextRequest, NextResponse } from 'next/server'
import { Cache } from './cache'

const tokenCache = new Cache<number>()

const rateLimit = (options: {
  uniqueTokenPerInterval?: number
  interval?: number
}) => {
  const { uniqueTokenPerInterval = 500, interval = 60000 } = options

  return async function handler(request: NextRequest) {
    const ip = request.ip ?? '127.0.0.1'
    const tokenCount = (tokenCache.get(ip) || 0) + 1

    if (tokenCount > uniqueTokenPerInterval) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    tokenCache.set(ip, tokenCount)
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