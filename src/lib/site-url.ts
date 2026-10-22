type Env = Record<string, string | undefined>;

const LOCAL_FALLBACK = 'http://localhost:3000';

function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Canonical origin for canonical URLs, sitemap.xml and robots.txt.
 * Order: NEXT_PUBLIC_SITE_URL -> Vercel production domain -> localhost.
 * Preview deployments still resolve to the production domain so canonicals
 * never point at a random preview URL (docs/11-SEO-ACCESSIBILITY.md).
 */
export function resolveSiteUrl(env: Env = process.env): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const origin = normalizeOrigin(explicit);
    if (!origin) throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid http(s) URL: "${explicit}"`);
    return origin;
  }
  const vercelProduction = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) return normalizeOrigin(vercelProduction) ?? LOCAL_FALLBACK;
  return LOCAL_FALLBACK;
}

/** Only production builds may be indexed. Local and preview builds are `noindex`. */
export function isIndexable(env: Env = process.env): boolean {
  if (env.VERCEL_ENV) return env.VERCEL_ENV === 'production';
  return env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
}
