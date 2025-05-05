import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAdmin = token?.role === 'admin'

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect authenticated routes
  if (request.nextUrl.pathname.startsWith('/account') || 
      request.nextUrl.pathname.startsWith('/orders')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/orders/:path*']
} 