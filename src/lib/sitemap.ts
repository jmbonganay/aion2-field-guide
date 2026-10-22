import type { MetadataRoute } from 'next';
import type { ContentBundle } from './bundle';
import { hrefFor } from './links';
import { selectRoutablePublished } from './publication';

/** Sitemap entries: static routes + published records only. Never drafts or fixtures. */
export function buildSitemap(bundle: ContentBundle, siteUrl: string, staticRoutes: string[], options: { now?: Date } = {}): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteUrl).toString();
  const records = selectRoutablePublished(bundle, options)
    .map((record) => ({ url: url(hrefFor(record)), lastModified: record.updatedAt }))
    .sort((a, b) => a.url.localeCompare(b.url));
  return [...staticRoutes.map((path) => ({ url: url(path) })), ...records];
}
