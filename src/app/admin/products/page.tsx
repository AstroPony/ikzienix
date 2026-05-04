import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminNav from '@/components/admin/AdminNav';
import { formatPrice } from '@/lib/format';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Products' };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { pairNumber: 'asc' },
  });

  const totalOrders = await prisma.order.count({ where: { status: 'PAID' } });
  const claimed = products.filter(p => p.stock === 0).length;

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <AdminNav />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'total pairs', value: products.length },
            { label: 'claimed', value: `${claimed} / 25` },
            { label: 'paid orders', value: totalOrders },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', padding: '1.25rem' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', margin: 0 }}>
                {label}
              </p>
              <p style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.25rem 0 0', color: '#f5f5f5' }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Product table */}
        <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          {'// products'}
        </p>

        <div style={{ border: '1px solid #1e1e1e' }}>
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '2.5rem 1fr 6rem 5rem 5rem 4rem',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.9rem 1.25rem',
                borderBottom: i < products.length - 1 ? '1px solid #1a1a1a' : 'none',
                background: '#0a0a0a',
                color: '#f5f5f5',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#111')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0a0a0a')}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#c8f135', opacity: 0.8 }}>
                #{p.pairNumber ?? '—'}
              </span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.name}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                {p.category ?? '—'}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                {formatPrice(p.price)}
              </span>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: p.stock === 0 ? 'rgba(255,255,255,0.25)' : p.stock <= 2 ? '#ff6b35' : 'rgba(255,255,255,0.6)',
              }}>
                {p.stock === 0 ? 'claimed' : `${p.stock} left`}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>
                {p.images.length} img{p.images.length !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
