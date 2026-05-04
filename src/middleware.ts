import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'ikzienix-admin';

function getSecret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin/login')) return NextResponse.next();

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const secret = getSecret();

    if (!token || !secret) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
