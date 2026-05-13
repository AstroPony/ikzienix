import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/adminAuth';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).default(''),
  price: z.number().positive().max(9999),
  stock: z.number().int().min(0).max(999).default(1),
  category: z.string().max(100).nullable().default(null),
  isLimited: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  pairNumber: z.number().int().min(1).max(999).nullable().default(null),
});

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('ikzienix-admin')?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, description, price, stock, category, isLimited, isVisible, pairNumber } = parsed.data;

  // Generate a unique slug from the name
  const base = toSlug(name) || 'product';
  let slug = base;
  let attempt = 0;
  while (await prisma.product.findUnique({ where: { slug } })) {
    attempt++;
    slug = `${base}-${attempt}`;
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Math.round(price * 100),
        stock,
        category,
        isLimited,
        isVisible,
        pairNumber,
        images: [],
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    console.error('[admin] Product create failed:', e);
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}
