import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './globals.css'
import RootLayoutContent from '@/components/RootLayoutContent'
import { WishlistProvider } from '@/context/WishlistContext'
import { ComparisonProvider } from '@/lib/comparison-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Izkienix',
  description: 'Your one-stop shop for all your needs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ComparisonProvider>
          <WishlistProvider>
            <RootLayoutContent>
              {children}
            </RootLayoutContent>
          </WishlistProvider>
        </ComparisonProvider>
      </body>
    </html>
  )
} 