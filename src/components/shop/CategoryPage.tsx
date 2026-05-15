import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import { TOTAL_PAIRS } from '@/lib/format';

interface Props {
  category: string;
  heading: string;
  subheading: string;
}

export default async function CategoryPage({ category, heading, subheading }: Props) {
  const products = await prisma.product.findMany({
    where: { category, isVisible: true },
    orderBy: { pairNumber: 'asc' },
  });

  const inStock = products.filter((p) => p.stock > 0);
  const soldOut = products.filter((p) => p.stock === 0);

  return (
    <div className="container-fluid px-3 px-md-4 py-5">
      <Link href="/shop" className="text-secondary small font-monospace mb-4 d-inline-block">
        ← alle zonnebrillen
      </Link>

      <div className="mb-5">
        <p className="font-monospace text-accent small text-uppercase mb-2">{category}</p>
        <h1 className="fw-bold h2 mb-1">{heading}</h1>
        <p className="text-secondary small mb-0">{subheading}</p>
      </div>

      {inStock.length > 0 ? (
        <div className="row g-3 mb-5">
          {inStock.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard product={product} totalPairs={TOTAL_PAIRS} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-secondary font-monospace py-5">Alle {heading.toLowerCase()} zijn claimed.</p>
      )}

      {soldOut.length > 0 && (
        <div className="mt-4">
          <p className="text-secondary font-monospace small text-uppercase mb-3">Al weg</p>
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
