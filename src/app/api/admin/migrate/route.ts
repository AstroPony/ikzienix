import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function runMigration() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "WaitlistEntry" (
      "id"        TEXT NOT NULL,
      "email"     TEXT NOT NULL,
      "source"    TEXT NOT NULL DEFAULT 'popup',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "WaitlistEntry_email_key" ON "WaitlistEntry"("email");
  `);
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  // Accept either ?secret= query param or x-admin-secret header
  const param = req.nextUrl.searchParams.get('secret');
  const header = req.headers.get('x-admin-secret');
  return param === secret || header === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await runMigration();
    return NextResponse.json({ ok: true, message: 'WaitlistEntry table ready' });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await runMigration();
    return NextResponse.json({ ok: true, message: 'WaitlistEntry table ready' });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
