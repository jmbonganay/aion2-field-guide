import type { MetadataRoute } from 'next';
import { site, staticRoutes } from '@/config/site';
import { getBundle } from '@/lib/content';
import { buildSitemap } from '@/lib/sitemap';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(getBundle(), site.url, staticRoutes);
}
