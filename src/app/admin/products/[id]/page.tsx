import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminNav from '@/components/admin/AdminNav';
import ProductEditor from '@/components/admin/ProductEditor';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Edit Product' };
export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export default async function AdminProductEditPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <AdminNav />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          {'// edit product'}
        </p>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2.5rem', color: '#f5f5f5' }}>
          {product.name}
          {product.pairNumber != null && (
            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#c8f135', marginLeft: '0.75rem' }}>
              #{product.pairNumber}
            </span>
          )}
        </h1>
        <ProductEditor product={product} />
      </div>
    </div>
  );
}
