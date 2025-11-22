import { type MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/**
 * Robots.txt Generator
 * Next.js will automatically generate robots.txt at build time
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/private/', '/admin/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
