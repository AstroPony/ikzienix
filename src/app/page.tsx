import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';

export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="d-flex flex-column justify-content-center position-relative"
        style={{
          minHeight: 'calc(100svh - 96px)',
          padding: '4rem 1.5rem',
          backgroundColor: '#080808',
        }}
      >
        {/* Hero background image at reduced opacity */}
        <div
          className="position-absolute"
          style={{
            inset: 0,
            backgroundImage: 'url(/images/hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
            zIndex: 0,
          }}
          aria-hidden="true"
        />
        {/* Dark gradient fade — stronger at top and bottom so text stays readable */}
        <div
          className="position-absolute"
          style={{
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(8,8,8,0.6) 0%, rgba(8,8,8,0.2) 40%, rgba(8,8,8,0.2) 60%, rgba(8,8,8,0.85) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
        <div className="container-fluid position-relative" style={{ maxWidth: 960, zIndex: 2 }}>
          <p className="text-secondary font-monospace small mb-3 text-uppercase">
            Beta drop — 25 pairs
          </p>
          <h1
            className="fw-bold mb-4 lh-1"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}
          >
            ik zie niks.
          </h1>
          <p
            className="text-secondary mb-5"
            style={{ maxWidth: 480, fontSize: '1.1rem', lineHeight: 1.6 }}
          >
            But we see everything.
            <br />
            First drop from the{' '}
            <span className="font-monospace text-white">ik</span> universe.
            Unbranded. Unfiltered.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-accent btn-lg px-5 fw-bold">
              Shop the drop
            </Link>
            <Link href="/about" className="btn btn-outline-light btn-lg px-4">
              What is this?
            </Link>
          </div>
        </div>

        <div
          className="position-absolute bottom-0 start-50 translate-middle-x pb-4 text-secondary small font-monospace d-none d-md-block"
          style={{ opacity: 0.4, zIndex: 2 }}
          aria-hidden="true"
        >
          ↓ scroll
        </div>
      </section>

      {/* ── Featured products ───────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-5 border-top border-dark">
          <div className="container-fluid px-3 px-md-4">
            <div className="d-flex align-items-baseline justify-content-between mb-4">
              <h2 className="h5 fw-bold text-uppercase mb-0">Available now</h2>
              <Link href="/shop" className="small text-accent font-monospace">
                All pairs →
              </Link>
            </div>
            <div className="row g-3">
              {featured.map((product) => (
                <div key={product.id} className="col-12 col-sm-6 col-md-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Beta framing ────────────────────────────────────────── */}
      <section className="py-5 border-top border-dark">
        <div className="container-fluid px-3 px-md-4" style={{ maxWidth: 720 }}>
          <p className="font-monospace text-accent small mb-3">{'// build 0.1'}</p>
          <p className="text-secondary" style={{ lineHeight: 1.8 }}>
            ikzienix is in early access. 25 pairs, one of each style.
            No logo yet — that comes in v1.0.
            What you get now is the drop before the drop.
            <br /><br />
            <span className="text-white">
              Report any style bugs directly to the mirror.
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
