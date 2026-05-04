import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/format';
import AddToCartButton from '@/components/shop/AddToCartButton';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return {};
  return {
    title: `${product.name} — ikzienix β`,
    description: product.description,
  };
}

export const dynamic = 'force-dynamic';

const TOTAL_PAIRS = 25;

function StockIndicator({ stock, pairNumber }: { stock: number; pairNumber: number | null }) {
  if (stock === 0) {
    return (
      <div className="d-flex align-items-center gap-2 mb-4">
        <span
          className="font-monospace small"
          style={{ color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px' }}
        >
          claimed — gone
        </span>
      </div>
    );
  }

  if (stock === 1) {
    return (
      <div className="mb-4">
        <span className="font-monospace small" style={{ color: '#ff6b35', border: '1px solid #ff6b35', padding: '3px 10px' }}>
          last one. seriously.
        </span>
      </div>
    );
  }

  if (stock <= 3) {
    return (
      <div className="mb-4">
        <span className="font-monospace small" style={{ color: '#ff6b35', border: '1px solid rgba(255,107,53,0.4)', padding: '3px 10px' }}>
          {stock} left — not a drill
        </span>
      </div>
    );
  }

  if (pairNumber != null) {
    return (
      <div className="mb-4">
        <span className="font-monospace small text-secondary">
          beta pair #{pairNumber} of {TOTAL_PAIRS}
        </span>
      </div>
    );
  }

  return null;
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) notFound();

  const thumbnail = product.images[0] ?? '/images/placeholder.jpg';
  const isSoldOut = product.stock === 0;

  return (
    <div className="container-fluid px-3 px-md-4 py-5">
      <div className="row g-4 g-md-5 justify-content-center" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Image column */}
        <div className="col-12 col-md-6">
          <div className="position-relative" style={{ aspectRatio: '1/1', background: '#0d0d0d' }}>
            <Image
              src={thumbnail}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority
            />
            {product.pairNumber != null && (
              <span className="pair-badge">
                #{product.pairNumber}
                <span className="pair-badge-total"> of {TOTAL_PAIRS}</span>
              </span>
            )}
            {isSoldOut && (
              <div className="claimed-overlay">
                <span className="claimed-label">claimed</span>
              </div>
            )}
          </div>

          {/* Additional images */}
          {product.images.length > 1 && (
            <div className="d-flex gap-2 mt-2">
              {product.images.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="position-relative flex-shrink-0"
                  style={{ width: 72, height: 72, background: '#0d0d0d' }}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 2}`}
                    fill
                    sizes="72px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info column */}
        <div className="col-12 col-md-6 d-flex flex-column">
          <Link href="/shop" className="text-secondary small font-monospace mb-4 d-inline-block">
            ← back to the drop
          </Link>

          <StockIndicator stock={product.stock} pairNumber={product.pairNumber} />

          <h1 className="fw-bold h2 mb-3">{product.name}</h1>

          <p className="text-secondary mb-4" style={{ lineHeight: 1.75, maxWidth: 400 }}>
            {product.description}
          </p>

          <div className="mb-5">
            <span className="fw-bold" style={{ fontSize: '1.6rem' }}>
              {formatPrice(product.price)}
            </span>
            <span className="text-secondary small ms-2">· gratis verzending NL</span>
          </div>

          <div className="mt-auto">
            <AddToCartButton product={product} />
            {!isSoldOut && (
              <Link
                href="/cart"
                className="btn btn-link w-100 text-secondary small mt-2 p-0"
              >
                View cart
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
