import CategoryPage from '@/components/shop/CategoryPage';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sport Zonnebrillen — Betaalbaar & Ongebrand | ikzienix',
  description: 'Shop sporty zonnebrillen van ikzienix. Wrap-around frames, lichtgewicht, geen logo. Geschikt voor skaten, fietsen en meer. Vanaf €27,99. Gratis verzending in Nederland.',
  alternates: { canonical: 'https://www.ikzienix.nl/shop/sporty' },
  openGraph: {
    title: 'Sport Zonnebrillen | ikzienix — vanaf €27,99',
    description: 'Betaalbare, ongebrande sport zonnebrillen. Gratis verzending in Nederland.',
    url: 'https://www.ikzienix.nl/shop/sporty',
  },
};

export default function SportyPage() {
  return (
    <CategoryPage
      category="sporty"
      heading="Sport Zonnebrillen"
      subheading="Voor het skatepark. Acceptabel bij de brunch. Ongebrand."
    />
  );
}
