import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'ikzienix-admin';

// Fallback to hardcoded defaults if env var not set
const ALLOWED_EMAILS = (process.env.ADMIN_EMAILS ?? 'nightmedow@gmail.com,admin@ikzienix.nl')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function getSecret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error('ADMIN_SECRET env var is not set');
  return new TextEncoder().encode(s);
}

export function isAllowedEmail(email: string) {
  return ALLOWED_EMAILS.includes(email.toLowerCase().trim());
}

export async function signAdminToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { email: string };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
