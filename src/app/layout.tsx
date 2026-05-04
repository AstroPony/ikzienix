import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import BetaBanner from '@/components/ui/BetaBanner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WaitlistPopup from '@/components/ui/WaitlistPopup';
import { prisma } from '@/lib/prisma';
import '@/styles/globals.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ikzienix.nl'),
  title: {
    default: 'ikzienix β — ik zie niks',
    template: '%s — ikzienix',
  },
  description: 'First drop. 25 pairs. Unbranded. Unfiltered. Dutch streetwear zonnebrillen in early access.',
  keywords: ['ikzienix', 'zonnebril', 'sunglasses', 'streetwear', 'amsterdam', 'unbranded', 'limited edition', 'beta drop', 'ik zie niks', 'dutch fashion'],
  authors: [{ name: 'ikzienix', url: 'https://www.ikzienix.nl' }],
  creator: 'ikzienix',
  publisher: 'ikzienix',
  alternates: {
    canonical: 'https://www.ikzienix.nl',
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://www.ikzienix.nl',
    siteName: 'ikzienix',
    title: 'ikzienix β — ik zie niks',
    description: 'First drop. 25 pairs. Unbranded. Unfiltered.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ikzienix — ik zie niks. First drop.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ikzienix β — ik zie niks',
    description: 'First drop. 25 pairs. Unbranded. Unfiltered.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

async function getStockInfo() {
  const products = await prisma.product.findMany({ select: { stock: true } });
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  return { totalStock, totalProducts: products.length };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { totalStock, totalProducts } = await getStockInfo();

  return (
    <html lang="nl" className={spaceGrotesk.variable}>
      <body>
        <CartProvider>
          <BetaBanner />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WaitlistPopup totalStock={totalStock} totalProducts={totalProducts} />
        </CartProvider>

        {/* Bootstrap JS — needed for navbar collapse on mobile */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          defer
        />
      </body>
    </html>
  );
}
