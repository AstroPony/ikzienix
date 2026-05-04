import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/adminAuth';

interface Props {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const token = req.cookies.get('ikzienix-admin')?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, price, stock, category, isLimited, images } = body;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Math.round(Number(price) * 100) }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(category !== undefined && { category }),
      ...(isLimited !== undefined && { isLimited }),
      ...(images !== undefined && { images }),
    },
  });

  return NextResponse.json(product);
}
