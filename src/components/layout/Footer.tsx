'use client'

import Link from 'next/link'
import NewsletterSubscription from '../newsletter/NewsletterSubscription'

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="mb-3">About Ikzienix</h5>
            <p className="text-muted mb-0">
              Your one-stop destination for trendy fashion and accessories.
              Discover the latest styles and shop with confidence.
            </p>
          </div>

          <div className="col-md-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/products" className="text-decoration-none text-muted">
                  Shop All
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/about" className="text-decoration-none text-muted">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="text-decoration-none text-muted">
                  Contact
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/privacy-policy" className="text-decoration-none text-muted">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-decoration-none text-muted">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5 className="mb-3">Stay Updated</h5>
            <NewsletterSubscription />
          </div>

          <div className="col-6 col-md-3">
            <h5 className="h6 mb-3">Customer Service</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/contact" className="text-decoration-none text-muted">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/shipping" className="text-decoration-none text-muted">
                  Shipping & Returns
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/size-guide" className="text-decoration-none text-muted">
                  Size Guide
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/faq" className="text-decoration-none text-muted">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-muted">
              &copy; {new Date().getFullYear()} Ikzienix. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted"
              >
                <i className="bi bi-facebook fs-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted"
              >
                <i className="bi bi-instagram fs-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted"
              >
                <i className="bi bi-twitter fs-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 