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
            <header className="bg-white shadow">
              <Navigation />
            </header>
            <main className="flex-grow-1">
              {children}
            </main>
            <footer className="bg-white shadow pt-4 pb-2 border-top">
              <div className="container">
                <div className="row g-4">
                  <div className="col-12 col-sm-6 col-lg-3">
                    <h5>About Ikzienix</h5>
                    <p className="text-muted small">Premium sunglasses for festivals and outdoor adventures.</p>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <h5>Quick Links</h5>
                    <ul className="list-unstyled">
                      <li><a href="/about" className="text-decoration-none text-muted">About Us</a></li>
                      <li><a href="/contact" className="text-decoration-none text-muted">Contact</a></li>
                      <li><a href="/shipping" className="text-decoration-none text-muted">Shipping Info</a></li>
                      <li><a href="/returns" className="text-decoration-none text-muted">Returns</a></li>
                    </ul>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <h5>Collections</h5>
                    <ul className="list-unstyled">
                      <li><a href="/collections/classic" className="text-decoration-none text-muted">Classic</a></li>
                      <li><a href="/collections/sport" className="text-decoration-none text-muted">Sport</a></li>
                      <li><a href="/collections/retro" className="text-decoration-none text-muted">Retro</a></li>
                      <li><a href="/collections/new" className="text-decoration-none text-muted">New Arrivals</a></li>
                    </ul>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <h5>Follow Us</h5>
                    <div className="d-flex gap-3">
                      <a href="#" className="text-muted">
                        <i className="bi bi-instagram fs-5"></i>
                      </a>
                    </div>
                    <div className="mt-3">
                      <h5>Language</h5>
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