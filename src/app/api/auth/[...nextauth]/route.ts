import NextAuth from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
} 