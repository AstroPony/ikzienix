import CategoryPage from '@/components/shop/CategoryPage';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Statement Zonnebrillen — Opvallend & Betaalbaar | ikzienix',
  description: 'Shop limited edition statement zonnebrillen van ikzienix. Niet subtiel, niet sorry. Ongebrand streetwear uit Amsterdam. Vanaf €29,99. Gratis verzending in Nederland.',
  alternates: { canonical: 'https://www.ikzienix.nl/shop/statement' },
  openGraph: {
    title: 'Statement Zonnebrillen | ikzienix — vanaf €29,99',
    description: 'Limited edition statement zonnebrillen. Niet subtiel. Gratis verzending in Nederland.',
    url: 'https://www.ikzienix.nl/shop/statement',
  },
};

export default function StatementPage() {
  return (
    <CategoryPage
      category="statement"
      heading="Statement Zonnebrillen"
      subheading="Niet subtiel. Niet sorry. Pure ikzienix energie. Limited."
    />
  );
}
