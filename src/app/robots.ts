import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/cart'],
      },
    ],
    sitemap: 'https://www.ikzienix.nl/sitemap.xml',
    host: 'https://www.ikzienix.nl',
  };
}
