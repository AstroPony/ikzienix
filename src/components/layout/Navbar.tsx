'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="site-navbar navbar navbar-expand-md navbar-dark px-3 px-md-4">
      <div className="container-fluid">
        {/* Brand */}
        <Link href="/" className="navbar-brand fw-bold text-uppercase">
          ik<span className="text-accent">zienix</span>
          <span className="beta-badge ms-2">β</span>
        </Link>

        {/* Mobile: cart icon + toggler */}
        <div className="d-flex align-items-center gap-2 d-md-none">
          <Link
            href="/cart"
            className="text-white position-relative d-flex align-items-center justify-content-center"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <i className="bi bi-bag fs-5" />
            {totalItems > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-black"
                style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-accent)', minWidth: 18, minHeight: 18 }}
              >
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f5f5f5',
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <i className={`bi ${open ? 'bi-x' : 'bi-list'} fs-4`} />
          </button>
        </div>

        {/* Nav links */}
        <div className={`navbar-collapse ${open ? 'show' : 'collapse'}`}>
          <ul className="navbar-nav ms-auto align-items-md-center gap-md-2 py-2 py-md-0">
            <li className="nav-item">
              <Link
                href="/shop"
                className="nav-link text-white"
                style={{ minHeight: 44, display: 'flex', alignItems: 'center' }}
              >
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/about"
                className="nav-link text-white"
                style={{ minHeight: 44, display: 'flex', alignItems: 'center' }}
              >
                About
              </Link>
            </li>
            <li className="nav-item d-none d-md-block">
              <Link href="/cart" className="nav-link text-white position-relative">
                <i className="bi bi-bag fs-5" />
                {totalItems > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-black"
                    style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-accent)' }}
                  >
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
