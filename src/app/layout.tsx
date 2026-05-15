import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { unstable_cache } from 'next/cache';
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
    default: 'ikzienix — Affordable Unbranded Sunglasses | Amsterdam',
    template: '%s | ikzienix',
  },
  description: 'ikzienix is een nieuw Amsterdams designer zonnebrillen merk. Betaalbare, ongebrande zonnebrillen vanaf €24,99 — 25 unieke modellen. Niche, vers, beperkte oplage. Gratis verzending in Nederland.',
  keywords: [
    'ikzienix', 'zonnebril', 'zonnebrillen', 'sunglasses', 'betaalbare zonnebrillen',
    'goedkope zonnebrillen', 'affordable sunglasses', 'unbranded sunglasses',
    'designer zonnebrillen', 'niche zonnebrillen', 'amsterdam zonnebrillen',
    'amsterdam sunglasses', 'streetwear zonnebril', 'wayfarer zonnebril',
    'oversized zonnebril', 'zonnebrillen kopen', 'dutch fashion', 'ik zie niks',
    'nieuw zonnebrillen merk', 'limited edition zonnebrillen',
  ],
  authors: [{ name: 'ikzienix', url: 'https://www.ikzienix.nl' }],
  creator: 'ikzienix',
  publisher: 'ikzienix',
  alternates: { canonical: 'https://www.ikzienix.nl' },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://www.ikzienix.nl',
    siteName: 'ikzienix',
    title: 'ikzienix — Designer Zonnebrillen, Ungebrand & Niche | Amsterdam',
    description: 'ikzienix is een Amsterdams designer zonnebrillen merk. 25 unieke ongebrande niche modellen — v1.0 lancering met logo volgt. Gratis verzending in Nederland.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ikzienix — Betaalbare Zonnebrillen vanaf €24,99',
    description: '25 unieke ongebrande zonnebrillen. Gratis verzending in Nederland.',
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
    icon: [{ url: '/images/ikzienix-pm-icon.png', type: 'image/png' }],
    shortcut: '/images/ikzienix-pm-icon.png',
    apple: '/images/ikzienix-pm-icon.png',
  },
};

// Cache stock check for 60s — avoids a DB call on every single page render
const getTotalStock = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({ where: { isVisible: true }, select: { stock: true } });
    return products.reduce((sum, p) => sum + p.stock, 0);
  },
  ['total-stock'],
  { revalidate: 60 }
);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const totalStock = await getTotalStock();

  return (
    <html lang="nl" className={spaceGrotesk.variable}>
      <body>
        <CartProvider>
          <BetaBanner />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WaitlistPopup totalStock={totalStock} />
        </CartProvider>

      </body>
    </html>
  );
}
