import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Cart from '@/components/Cart'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ikkzienix - Affordable Festival Sunglasses',
  description: 'Premium sunglasses that don\'t break the bank. Perfect for festivals and outdoor adventures.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navigation />
            <Cart />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 