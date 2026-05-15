import CategoryPage from '@/components/shop/CategoryPage';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ronde Zonnebrillen — Betaalbaar & Ongebrand | ikzienix',
  description: 'Shop ronde zonnebrillen van ikzienix. Klein, groot of precies goed — allemaal ongebrand. Vanaf €24,99. Gratis verzending in Nederland.',
  alternates: { canonical: 'https://www.ikzienix.nl/shop/round' },
  openGraph: {
    title: 'Ronde Zonnebrillen | ikzienix — vanaf €24,99',
    description: 'Betaalbare, ongebrande ronde zonnebrillen. Gratis verzending in Nederland.',
    url: 'https://www.ikzienix.nl/shop/round',
  },
};

export default function RoundPage() {
  return (
    <CategoryPage
      category="round"
      heading="Ronde Zonnebrillen"
      subheading="Klein, groot of precies goed. Altijd ongebrand."
    />
  );
}
