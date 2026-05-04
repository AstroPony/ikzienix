import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-top border-dark mt-auto py-5 px-3">
      <div className="container-fluid">
        <div className="row g-4 mb-4">
          {/* Brand column */}
          <div className="col-12 col-md-5">
            <p className="fw-bold mb-1">
              ik<span className="text-accent">zienix</span>
            </p>
            <p className="text-secondary small mb-0" style={{ maxWidth: 280, lineHeight: 1.7 }}>
              First drop from the{' '}
              <span className="font-monospace text-white">ik</span> universe.
              25 pairs. No logo yet. v1.0 incoming.
            </p>
          </div>

          {/* Nav */}
          <div className="col-6 col-md-3">
            <p className="font-monospace text-secondary small text-uppercase mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
              Shop
            </p>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              <li><Link href="/shop" className="text-secondary small footer-link">The 25</Link></li>
              <li><Link href="/shop" className="text-secondary small footer-link">Wayfarers</Link></li>
              <li><Link href="/shop" className="text-secondary small footer-link">Oversized</Link></li>
              <li><Link href="/shop" className="text-secondary small footer-link">Statement</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <p className="font-monospace text-secondary small text-uppercase mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
              Info
            </p>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              <li><Link href="/about" className="text-secondary small footer-link">About</Link></li>
              <li>
                <a
                  href="https://www.instagram.com/ikzienix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary small footer-link"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-top border-dark pt-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
          <span className="text-secondary small">
            © {year} ikzienix — part of the{' '}
            <span className="font-monospace">ik</span> universe
          </span>
          <span className="text-secondary small font-monospace" style={{ opacity: 0.5 }}>
            v0.1-beta · ik zie niks
          </span>
        </div>
      </div>
    </footer>
  );
}
