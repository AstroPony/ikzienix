import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — ikzienix β',
  description: 'ik zie niks. But we see everything.',
};

export default function AboutPage() {
  return (
    <div className="container-fluid px-3 px-md-4 py-5" style={{ maxWidth: 720, margin: '0 auto' }}>
      <p className="font-monospace text-accent small mb-4">{'// about.md'}</p>

      <h1 className="fw-bold mb-5" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 1.1 }}>
        ik zie niks.<br />
        <span className="text-secondary">But we see everything.</span>
      </h1>

      <div className="text-secondary" style={{ lineHeight: 1.9, fontSize: '1.05rem' }}>
        <p>
          ikzienix is the first drop from the{' '}
          <span className="font-monospace text-white">ik</span> brand universe —
          a Dutch label built around the things you can&apos;t do with your senses.
        </p>
        <p>
          <span className="font-monospace text-white">ik zie niks</span> — I can&apos;t see.
          We started with sunglasses. We&apos;re not stopping there.
        </p>
        <p>
          This is the beta. 25 pairs, no logo, no polish. Just the drop.
          If you&apos;re here now, you&apos;re early. That&apos;s the point.
        </p>

        <hr className="border-dark my-5" />

        <div className="row g-4">
          {[
            { label: 'Brand', value: '(ik)zienix' },
            { label: 'Founded', value: 'Amsterdam, 2025' },
            { label: 'Phase', value: 'β — early access' },
            { label: 'Next', value: 'v1.0 — branded, 100 pairs' },
          ].map(({ label, value }) => (
            <div key={label} className="col-6">
              <p className="font-monospace text-secondary small mb-1">{label}</p>
              <p className="text-white fw-semibold mb-0">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <Link href="/shop" className="btn btn-accent fw-bold px-5">
          Shop the drop
        </Link>
      </div>
    </div>
  );
}
