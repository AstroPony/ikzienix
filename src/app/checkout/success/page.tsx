import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Achievement unlocked — ikzienix β',
};

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: { orderId?: string };
}

async function getOrderSummary(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
}

async function getClaimedCount() {
  return prisma.product.count({ where: { stock: 0 } });
}

export default async function SuccessPage({ searchParams }: Props) {
  const orderId = searchParams.orderId;
  const [order, claimed] = await Promise.all([
    orderId ? getOrderSummary(orderId) : Promise.resolve(null),
    getClaimedCount(),
  ]);

  return (
    <div
      className="container-fluid px-3 py-5 d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: 'calc(100svh - 160px)' }}
    >
      {/* Achievement frame */}
      <div style={{ maxWidth: 520, width: '100%' }}>
        {/* Status line */}
        <p className="font-monospace text-accent small mb-4" style={{ letterSpacing: '0.1em' }}>
          {'// achievement_unlocked'}
        </p>

        {/* Big statement */}
        <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', lineHeight: 1.1 }}>
          You&apos;re in<br />the beta.
        </h1>

        {/* Pair context */}
        {claimed > 0 && (
          <p className="text-secondary font-monospace small mt-3 mb-5">
            {claimed} of 25 pairs claimed. You&apos;re one of them.
          </p>
        )}

        {/* Order detail card */}
        {order && (
          <div
            className="text-start mb-5 p-4"
            style={{ border: '1px solid #222', background: '#0d0d0d' }}
          >
            <p className="font-monospace text-secondary small mb-3">order confirmed</p>
            <div className="d-flex flex-column gap-2">
              {order.items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between small">
                  <span>
                    {item.product.name}
                    <span className="text-secondary ms-1">×{item.quantity}</span>
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-top border-dark mt-3 pt-3 d-flex justify-content-between">
              <span className="small text-secondary">Shipping to</span>
              <span className="small">{order.city}</span>
            </div>
            <p className="text-secondary small mt-3 mb-0" style={{ fontSize: '0.75rem' }}>
              Confirmation sent to {order.email}
            </p>
          </div>
        )}

        {/* CTA */}
        <Link href="/shop" className="btn btn-outline-light px-5">
          Back to the drop
        </Link>

        <p className="text-secondary font-monospace mt-4 mb-0" style={{ fontSize: '0.7rem', opacity: 0.4 }}>
          Report any style bugs directly to the mirror.
        </p>
      </div>
    </div>
  );
}
