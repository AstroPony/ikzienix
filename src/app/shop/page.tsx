import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop — ikzienix β',
  description: '25 pairs. One of each. Shop the beta drop.',
};

export const dynamic = 'force-dynamic';

const TOTAL_PAIRS = 25;

export default async function ShopPage() {
  const products = await prisma.product.findMany({
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
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
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
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} totalPairs={TOTAL_PAIRS} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
