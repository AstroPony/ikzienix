'use client'

import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/lib/cart-context'
import Navigation from '@/components/navigation/Navigation'
import Footer from './Footer'
import BootstrapClient from '@/components/BootstrapClient'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <CartProvider>
            <div className="d-flex flex-column min-vh-100">
              <Navigation />
              <main className="flex-grow-1">
                {children}
              </main>
              <Footer />
            </div>
            <BootstrapClient />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
} 