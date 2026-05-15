import CategoryPage from '@/components/shop/CategoryPage';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Oversized Zonnebrillen — Groot & Betaalbaar | ikzienix',
  description: 'Shop oversized zonnebrillen van ikzienix. Maximale coverage, minimale prijs. Ongebrand streetwear uit Amsterdam. Vanaf €29,99. Gratis verzending in Nederland.',
  alternates: { canonical: 'https://www.ikzienix.nl/shop/oversized' },
  openGraph: {
    title: 'Oversized Zonnebrillen | ikzienix — vanaf €29,99',
    description: 'Betaalbare, ongebrande oversized zonnebrillen. Gratis verzending in Nederland.',
    url: 'https://www.ikzienix.nl/shop/oversized',
  },
};

export default function OversizedPage() {
  return (
    <CategoryPage
      category="oversized"
      heading="Oversized Zonnebrillen"
      subheading="Maximale coverage. Amsterdam-approved. Ongebrand."
    />
  );
}
