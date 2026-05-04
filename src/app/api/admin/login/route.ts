import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAllowedEmail, signAdminToken } from '@/lib/adminAuth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { email, password } = parsed.data;

  if (!isAllowedEmail(email) || password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signAdminToken(email);

  const res = NextResponse.json({ ok: true });
  res.cookies.set('ikzienix-admin', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
