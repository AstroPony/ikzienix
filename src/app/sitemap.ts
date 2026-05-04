import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE = 'https://www.ikzienix.nl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  });

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/shop/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...productUrls,
  ];
}
