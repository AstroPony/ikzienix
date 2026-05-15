import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import { TOTAL_PAIRS } from '@/lib/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zonnebrillen Kopen — Alle Modellen | ikzienix',
  description: 'Shop 25 unieke ongebrande zonnebrillen van ikzienix. Wayfarers, oversized, sporty, rond en statement stijlen. Prijzen vanaf €24,99. Gratis verzending in Nederland. Beperkte beta drop.',
  alternates: { canonical: 'https://www.ikzienix.nl/shop' },
  openGraph: {
    title: 'Zonnebrillen Kopen — Alle Modellen | ikzienix',
    description: '25 unieke zonnebrillen vanaf €24,99. Gratis verzending in Nederland. Beperkte beta drop uit Amsterdam.',
    url: 'https://www.ikzienix.nl/shop',
  },
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    orderBy: [
      { pairNumber: 'asc' },
      { createdAt: 'asc' },
    ],
  });

  const inStock = products.filter((p) => p.stock > 0);
  const soldOut = products.filter((p) => p.stock === 0);
  const remaining = inStock.length;

  return (
    <div className="container-fluid px-3 px-md-4 py-5">
      {/* Header */}
      <div className="mb-5">
        <p className="font-monospace text-secondary small text-uppercase mb-2">
          Beta drop
        </p>
        <div className="d-flex align-items-baseline gap-3 flex-wrap">
          <h1 className="fw-bold h2 mb-0">The 25</h1>
          {remaining < TOTAL_PAIRS && (
            <span className="font-monospace text-accent small">
              {remaining} of {TOTAL_PAIRS} remaining
            </span>
          )}
        </div>
      </div>

      {/* In-stock grid */}
      {inStock.length > 0 ? (
        <div className="row g-3 mb-5">
          {inStock.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard product={product} totalPairs={TOTAL_PAIRS} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-5 text-center">
          <p className="font-monospace text-secondary">
            All {TOTAL_PAIRS} pairs claimed.
          </p>
          <p className="text-secondary small mt-2">v1.0 incoming.</p>
        </div>
      )}

      {/* Sold-out ghost grid */}
      {soldOut.length > 0 && (
        <div className="mt-4">
          <p className="text-secondary font-monospace small text-uppercase mb-3">
            Already gone
          </p>
          <div className="row g-3">
            {soldOut.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={product} totalPairs={TOTAL_PAIRS} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
