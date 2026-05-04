import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/format';
import AddToCartButton from '@/components/shop/AddToCartButton';
import ImageGallery from '@/components/shop/ImageGallery';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return {};
  const image = product.images[0];
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `https://www.ikzienix.nl/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} — ikzienix β`,
      description: product.description,
      url: `https://www.ikzienix.nl/shop/${product.slug}`,
      images: image ? [{ url: image, width: 600, height: 600, alt: product.name }] : [],
    },
  };
}

export const dynamic = 'force-dynamic';

const BASE = 'https://www.ikzienix.nl';
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

  const isSoldOut = product.stock === 0;
  const priceFormatted = (product.price / 100).toFixed(2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images[0] ? [product.images[0]] : [],
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'ikzienix' },
    offers: {
      '@type': 'Offer',
      url: `${BASE}/shop/${product.slug}`,
      priceCurrency: 'EUR',
      price: priceFormatted,
      availability: isSoldOut
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'ikzienix' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-fluid px-3 px-md-4 py-5">
        <div className="row g-4 g-md-5 justify-content-center" style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Image column */}
          <div className="col-12 col-md-6">
            <div className="position-relative">
              {product.pairNumber != null && (
                <span className="pair-badge" style={{ zIndex: 5 }}>
                  #{product.pairNumber}
                  <span className="pair-badge-total"> of {TOTAL_PAIRS}</span>
                </span>
              )}
              {isSoldOut && (
                <div className="claimed-overlay" style={{ zIndex: 5 }}>
                  <span className="claimed-label">claimed</span>
                </div>
              )}
              <ImageGallery images={product.images} productName={product.name} />
            </div>
          </div>

          {/* Info column */}
          <div className="col-12 col-md-6 d-flex flex-column">
            <Link href="/shop" className="text-secondary small font-monospace mb-4 d-inline-block">
              ← back to the drop
            </Link>

            <StockIndicator stock={product.stock} pairNumber={product.pairNumber} />

            <h1 className="fw-bold h2 mb-3">{product.name}</h1>

            {product.category && (
              <p className="font-monospace text-secondary mb-2" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {product.category}
                {product.isLimited && <span className="text-accent ms-2">· limited</span>}
              </p>
            )}

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
                <Link href="/cart" className="btn btn-link w-100 text-secondary small mt-2 p-0">
                  View cart
                </Link>
              )}
              <p className="text-secondary mt-4" style={{ fontSize: '0.72rem', lineHeight: 1.6 }}>
                Beta drop — one of 25. No restocks. No logo yet.
                Free shipping in the Netherlands.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
