import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order confirmed — ikzienix β',
  robots: { index: false, follow: false },
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

  const remainingPairs = 25 - claimed;

  return (
    <div
      className="container-fluid px-3 py-5 d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: 'calc(100svh - 160px)' }}
    >
      <div style={{ maxWidth: 500, width: '100%' }}>

        {/* Terminal status line */}
        <p className="font-monospace mb-4" style={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
          {'// order.status = confirmed'}
        </p>

        {/* Hero */}
        <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(2.2rem, 9vw, 3.8rem)', lineHeight: 1.05 }}>
          You&apos;re in<br />
          <span className="text-accent">the beta.</span>
        </h1>

        {/* Pair count context */}
        <p className="font-monospace mt-3 mb-0" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
          {claimed} of 25 pairs claimed.
          {remainingPairs > 0
            ? ` ${remainingPairs} still out there.`
            : ' The drop is closed.'}
        </p>

        {/* Order detail card */}
        {order ? (
          <div
            className="text-start mt-5 mb-5 p-4"
            style={{ border: '1px solid #1e1e1e', background: '#0a0a0a' }}
          >
            <p className="font-monospace mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
              order confirmed
            </p>

            <div className="d-flex flex-column gap-2 mb-3">
              {order.items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between small">
                  <span>{item.product.name}</span>
                  <span className="text-secondary">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between small mb-2" style={{ borderTop: '1px solid #1e1e1e', paddingTop: '0.75rem' }}>
              <span className="text-secondary">Shipping</span>
              <span className="font-monospace" style={{ color: 'var(--color-accent)', fontSize: '0.75rem' }}>free</span>
            </div>

            <div className="d-flex justify-content-between small mb-3">
              <span className="text-secondary">Shipping to</span>
              <span>{order.city}</span>
            </div>

            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', margin: 0 }}>
              Confirmation sent to {order.email}
            </p>
          </div>
        ) : (
          <div className="mt-5 mb-5 p-4" style={{ border: '1px solid #1e1e1e', background: '#0a0a0a' }}>
            <p className="font-monospace text-secondary small mb-0">
              Payment received. Check your email for confirmation.
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="d-flex flex-column gap-3">
          <a
            href="https://www.instagram.com/ikzienix"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent fw-bold px-5"
          >
            Follow on Instagram
          </a>
          <Link href="/shop" className="btn btn-outline-light px-5">
            Back to the drop
          </Link>
        </div>

        {/* Sign-off */}
        <p className="font-monospace mt-5 mb-0" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1.7 }}>
          No logo yet. Just the shape.<br />
          v0.1-beta · ik zie niks
        </p>
      </div>
    </div>
  );
}
