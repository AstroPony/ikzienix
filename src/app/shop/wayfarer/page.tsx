import CategoryPage from '@/components/shop/CategoryPage';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Wayfarer Zonnebrillen — Betaalbaar & Ongebrand | ikzienix',
  description: 'Shop betaalbare wayfarer zonnebrillen van ikzienix. Tijdloze silhouetten, geen logo, geen opsmuk. Vanaf €24,99. Gratis verzending in Nederland.',
  alternates: { canonical: 'https://www.ikzienix.nl/shop/wayfarer' },
  openGraph: {
    title: 'Wayfarer Zonnebrillen | ikzienix — vanaf €24,99',
    description: 'Betaalbare, ongebrande wayfarer zonnebrillen. Gratis verzending in Nederland.',
    url: 'https://www.ikzienix.nl/shop/wayfarer',
  },
};

export default function WayfarerPage() {
  return (
    <CategoryPage
      category="wayfarer"
      heading="Wayfarer Zonnebrillen"
      subheading="Tijdloze silhouetten. Ongebrand. Geen logo. Gewoon goed."
    />
  );
}
