import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — not found',
};

export default function NotFound() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center px-3"
      style={{ minHeight: 'calc(100svh - 200px)', gap: '1.5rem' }}
    >
      <p className="font-monospace text-secondary small text-uppercase mb-0">
        // error 404
      </p>
      <h1 className="fw-bold mb-0" style={{ fontSize: 'clamp(4rem, 16vw, 10rem)', lineHeight: 1 }}>
        <span className="text-accent">4</span>0<span className="text-accent">4</span>
      </h1>
      <p className="text-secondary font-monospace" style={{ maxWidth: 360 }}>
        This pair doesn&apos;t exist. Might have been claimed. Might never have existed.
      </p>
      <div className="d-flex gap-3 flex-wrap justify-content-center">
        <Link href="/shop" className="btn btn-accent fw-bold px-5">
          Back to the drop
        </Link>
        <Link href="/" className="btn btn-outline-secondary px-4">
          Home
        </Link>
      </div>
      <p className="font-monospace text-secondary mt-4" style={{ fontSize: '0.65rem', opacity: 0.4 }}>
        v0.1-beta · build 404
      </p>
    </div>
  );
}
