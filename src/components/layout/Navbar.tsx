'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="site-navbar navbar navbar-expand-md navbar-dark px-3 px-md-4">
      <div className="container-fluid">
        {/* Brand */}
        <Link href="/" className="navbar-brand fw-bold text-uppercase">
          ik<span className="text-accent">zienix</span>
          <span className="beta-badge ms-2">β</span>
        </Link>

        {/* Mobile: cart icon + toggler */}
        <div className="d-flex align-items-center gap-3 d-md-none">
          <Link href="/cart" className="text-white position-relative">
            <i className="bi bi-bag fs-5" />
            {totalItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-black" style={{ fontSize: '0.6rem', backgroundColor: 'var(--color-accent)' }}>
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="navbar-toggler border-0 p-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
            aria-controls="navMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list fs-4 text-white" />
          </button>
        </div>

        {/* Nav links */}
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-md-center gap-md-2 mt-3 mt-md-0">
            <li className="nav-item">
              <Link href="/shop" className="nav-link text-white">Shop</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link text-white">About</Link>
            </li>
            <li className="nav-item d-none d-md-block">
              <Link href="/cart" className="nav-link text-white position-relative">
                <i className="bi bi-bag fs-5" />
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-black" style={{ fontSize: '0.6rem', backgroundColor: 'var(--color-accent)' }}>
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
