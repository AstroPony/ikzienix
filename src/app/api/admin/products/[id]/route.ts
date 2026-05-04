import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/adminAuth';
import { z } from 'zod';

interface Props {
  params: { id: string };
}

const patchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive().max(9999).optional(),
  stock: z.number().int().min(0).max(100).optional(),
  category: z.string().max(100).nullable().optional(),
  isLimited: z.boolean().optional(),
  images: z.array(z.string().url()).max(10).optional(),
});

export async function PATCH(req: NextRequest, { params }: Props) {
  const token = req.cookies.get('ikzienix-admin')?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, description, price, stock, category, isLimited, images } = parsed.data;

  try {
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Math.round(price * 100) }),
        ...(stock !== undefined && { stock }),
        ...(category !== undefined && { category }),
        ...(isLimited !== undefined && { isLimited }),
        ...(images !== undefined && { images }),
      },
    });
    return NextResponse.json(product);
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    console.error('[admin] Product update failed:', e);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
