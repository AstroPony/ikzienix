import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { email, source = 'popup' } = parsed.data;

  try {
    await prisma.waitlistEntry.upsert({
      where: { email },
      update: {},
      create: { email, source },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not save' }, { status: 500 });
  }
}
