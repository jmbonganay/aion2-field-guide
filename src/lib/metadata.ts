import type { Metadata } from 'next';
import { site } from '@/config/site';

/** Original share image (public/og/field-guide.png, regenerate with `npm run og:generate`). */
export const SHARE_IMAGE = {
  url: '/og/field-guide.png',
  width: 1200,
  height: 630,
  alt: `${site.name} — an unofficial, source-checked AION 2 Global companion`,
  type: 'image/png',
};

type PageMetaInput = {
  title: string;
  description: string;
  /** Site-relative path with trailing slash, e.g. `/guides/`. */
  path: string;
  noindex?: boolean;
};

/** Unique title/description + canonical URL for a page. */
export function pageMetadata({ title, description, path, noindex = false }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: `${site.name} (unofficial)`,
      title: `${title} · ${site.name}`,
      description,
      url: path,
      locale: 'en_US',
      images: [SHARE_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: `${title} · ${site.name}`, description, images: [SHARE_IMAGE.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
