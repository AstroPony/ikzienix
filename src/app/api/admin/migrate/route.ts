import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/adminAuth';

// One-shot migration endpoint — creates WaitlistEntry table if it doesn't exist
// Call once after deploying with the admin cookie set
export async function POST(req: NextRequest) {
  const token = req.cookies.get('ikzienix-admin')?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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
    return NextResponse.json({ ok: true, message: 'WaitlistEntry table ready' });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
