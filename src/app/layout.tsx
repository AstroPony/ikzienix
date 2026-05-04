import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import BetaBanner from '@/components/ui/BetaBanner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'ikzienix β — ik zie niks',
  description: 'First drop. 25 pairs. Unbranded. Unfiltered.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={spaceGrotesk.variable}>
      <body>
        <CartProvider>
          <BetaBanner />
          <Navbar />
          <main>{children}</main>
          <Footer />
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
