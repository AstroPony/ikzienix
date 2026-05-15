import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen — Zonnebrillen | ikzienix',
  description: 'Veelgestelde vragen over ikzienix zonnebrillen. Prijzen, verzending, stijlen, en meer. Betaalbare ongebrande zonnebrillen vanaf €24,99 met gratis verzending in Nederland.',
  alternates: { canonical: 'https://www.ikzienix.nl/faq' },
  openGraph: {
    title: 'FAQ — ikzienix Zonnebrillen',
    description: 'Alles over ikzienix: prijzen, verzending, stijlen en meer.',
    url: 'https://www.ikzienix.nl/faq',
  },
};

const faqs = [
  {
    q: 'Wat kosten ikzienix zonnebrillen?',
    a: 'Onze zonnebrillen kosten tussen €24,99 en €34,99. Dit is de beta drop — bewust betaalbaar gehouden. v1.0 wordt duurder.',
  },
  {
    q: 'Zijn de zonnebrillen voorzien van UV-bescherming?',
    a: 'Ja. Alle glazen bieden UV-bescherming. Meer technische details volgen bij de officiële v1.0 lancering.',
  },
  {
    q: 'Is de verzending gratis?',
    a: 'Ja. Gratis verzending binnen Nederland op alle bestellingen. Geen minimumbedrag.',
  },
  {
    q: 'Sturen jullie ook naar het buitenland?',
    a: 'Op dit moment verzenden we alleen binnen Nederland. Internationele verzending volgt bij v1.0.',
  },
  {
    q: 'Waarom geen logo?',
    a: 'Dit is de beta drop. 25 paar, geen logo, geen opsmuk — gewoon het product. Het logo komt bij v1.0. Als je er nu bij bent, ben je vroeg. Dat is het punt.',
  },
  {
    q: 'Hoeveel paar zijn er beschikbaar?',
    a: 'Exact 25 paar. Eén van elk model. Geen nabestellingen. Als het op is, is het op.',
  },
  {
    q: 'Welke stijlen zijn er?',
    a: 'Wayfarer, oversized, rond, sporty en statement. Elk model is uniek — eén per stijl, eén per kleur.',
  },
  {
    q: 'Kan ik een zonnebril retourneren?',
    a: 'Retourinformatie volgt officieel bij v1.0. Heb je een probleem met je bestelling? Mail ons via Instagram.',
  },
  {
    q: 'Wat is de beta drop precies?',
    a: '25 paar ongebrande zonnebrillen — het allereerste product van ikzienix. Geen website-launch, geen PR. Just the drop. Als het bevalt, komt v1.0 met logo, meer modellen en meer paar.',
  },
  {
    q: 'Wanneer komt v1.0?',
    a: 'Dat hangt af van hoe snel de beta drop uitverkocht raakt. Meld je aan voor de waitlist om als eerste te weten wanneer v1.0 live gaat.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container-fluid px-3 px-md-4 py-5" style={{ maxWidth: 760, margin: '0 auto' }}>
        <p className="font-monospace text-accent small mb-4">{'// faq.md'}</p>
        <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>
          Veelgestelde vragen
        </h1>
        <p className="text-secondary mb-5">
          Over de zonnebrillen, de drop, en alles daartussenin.
        </p>

        <div className="d-flex flex-column gap-0">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className="py-4"
              style={{ borderTop: '1px solid #1a1a1a' }}
            >
              <h2 className="fw-semibold mb-2" style={{ fontSize: '1rem' }}>{q}</h2>
              <p className="text-secondary mb-0" style={{ lineHeight: 1.75, fontSize: '0.95rem' }}>{a}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4" style={{ borderTop: '1px solid #1a1a1a' }}>
          <Link href="/shop" className="btn btn-accent fw-bold px-5">
            Shop de drop
          </Link>
          <Link href="/about" className="btn btn-link text-secondary ms-3 small">
            Over ikzienix →
          </Link>
        </div>
      </div>
    </>
  );
}
