import { type MetadataRoute } from 'next';

import { categoriesConfig, siteConfig } from '@/config/site';

/**
 * Sitemap Generator
 * Next.js will automatically generate sitemap.xml at build time
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Category sections (anchors on homepage)
  categoriesConfig.forEach((category) => {
    routes.push({
      url: `${baseUrl}#${category.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // TODO: Add individual tool pages when they are created
  // Example:
  // const tools = [
  //   { slug: 'image-compress', lastModified: '2025-01-01' },
  //   { slug: 'json-formatter', lastModified: '2025-01-01' },
  // ];
  // tools.forEach((tool) => {
  //   routes.push({
  //     url: `${baseUrl}/tools/${tool.slug}`,
  //     lastModified: new Date(tool.lastModified),
  //     changeFrequency: 'monthly',
  //     priority: 0.7,
  //   });
  // });

  return routes;
}
