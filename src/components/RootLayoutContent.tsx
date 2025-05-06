'use client'

import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/auth-provider'
import Navigation from '@/components/navigation/Navigation'
import BootstrapClient from '@/components/BootstrapClient'
import { LanguageProvider } from '@/lib/i18n/context'
import LanguageSwitcher from '@/components/language-switcher'

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BootstrapClient />
          <div className="min-vh-100 d-flex flex-column">
            <header className="bg-white shadow" role="banner">
              <Navigation />
            </header>
            <main className="flex-grow-1" role="main">
              {children}
            </main>
            <footer className="bg-white shadow pt-4 pb-2 border-top" role="contentinfo">
              <div className="container">
                <div className="row g-4">
                  <div className="col-12 col-sm-6 col-lg-3">
                    <h5 className="h6 fw-bold mb-3">About Ikzienix</h5>
                    <p className="text-muted small">Premium sunglasses for festivals and outdoor adventures.</p>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <h5 className="h6 fw-bold mb-3">Quick Links</h5>
                    <nav aria-label="Footer navigation">
                      <ul className="list-unstyled">
                        <li><a href="/about" className="text-decoration-none text-muted" aria-label="About Us">About Us</a></li>
                        <li><a href="/contact" className="text-decoration-none text-muted" aria-label="Contact Us">Contact</a></li>
                        <li><a href="/shipping" className="text-decoration-none text-muted" aria-label="Shipping Information">Shipping Info</a></li>
                        <li><a href="/returns" className="text-decoration-none text-muted" aria-label="Returns Policy">Returns</a></li>
                      </ul>
                    </nav>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <h5 className="h6 fw-bold mb-3">Collections</h5>
                    <nav aria-label="Collections navigation">
                      <ul className="list-unstyled">
                        <li><a href="/collections/classic" className="text-decoration-none text-muted" aria-label="Classic Collection">Classic</a></li>
                        <li><a href="/collections/sport" className="text-decoration-none text-muted" aria-label="Sport Collection">Sport</a></li>
                        <li><a href="/collections/retro" className="text-decoration-none text-muted" aria-label="Retro Collection">Retro</a></li>
                        <li><a href="/collections/new" className="text-decoration-none text-muted" aria-label="New Arrivals">New Arrivals</a></li>
                      </ul>
                    </nav>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <h5 className="h6 fw-bold mb-3">Follow Us</h5>
                    <div className="d-flex gap-3">
                      <a href="#" className="text-muted" aria-label="Follow us on Instagram">
                        <i className="bi bi-instagram fs-5"></i>
                      </a>
                    </div>
                    <div className="mt-3">
                      <h5 className="h6 fw-bold mb-3">Language</h5>
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
                <div className="border-top mt-4 pt-4 text-center text-muted small">
                  <p className="mb-0">&copy; {new Date().getFullYear()} Ikzienix. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  )
} 