'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="mb-3">Ikzienix</h5>
            <p className="text-muted">
              Your premier destination for high-quality eyewear. Discover our curated collection of stylish and comfortable glasses.
            </p>
          </div>
          <div className="col-md-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/collections" className="text-muted text-decoration-none">
                  Collections
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/about" className="text-muted text-decoration-none">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="text-muted text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                123 Fashion Street, Style City
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                +1 234 567 890
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                info@ikzienix.com
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-muted">
              © {new Date().getFullYear()} Ikzienix. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="social-links">
              <a href="#" className="text-muted me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-muted me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-muted me-3">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-pinterest"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 