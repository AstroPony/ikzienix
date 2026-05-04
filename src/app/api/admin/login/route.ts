import { NextRequest, NextResponse } from 'next/server';
import { isAllowedEmail, signAdminToken } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!isAllowedEmail(email) || password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signAdminToken(email);

  const res = NextResponse.json({ ok: true });
  res.cookies.set('ikzienix-admin', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return res;
}
