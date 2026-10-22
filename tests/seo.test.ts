import { describe, expect, it } from 'vitest';
import { detailRouteExtensions } from '@/lib/route-gating';
import { isIndexable, resolveSiteUrl } from '@/lib/site-url';
import { buildSitemap } from '@/lib/sitemap';
import { bundleOf, guide, NOW, source } from './helpers';

describe('site URL', () => {
  it('prefers NEXT_PUBLIC_SITE_URL, then the Vercel production domain, then localhost', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://guide.example.org/some/path' })).toBe('https://guide.example.org');
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'my-guide.vercel.app' })).toBe('https://my-guide.vercel.app');
    expect(resolveSiteUrl({})).toBe('http://localhost:3000');
  });

  it('rejects a malformed explicit site URL', () => {
    expect(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'ftp://nope' })).toThrow();
  });

  it('only indexes Vercel production (or an explicit opt-in)', () => {
    expect(isIndexable({ VERCEL_ENV: 'production' })).toBe(true);
    expect(isIndexable({ VERCEL_ENV: 'preview' })).toBe(false);
    expect(isIndexable({})).toBe(false);
    expect(isIndexable({ NEXT_PUBLIC_ALLOW_INDEXING: 'true' })).toBe(true);
  });
});

describe('sitemap', () => {
  it('lists static routes and published records only', () => {
    const bundle = bundleOf({
      sources: [source()],
      records: [guide(), guide({ id: 'guide:draft' as never, slug: 'draft', status: 'draft' }), guide({ id: 'guide:fx' as never, slug: 'fx', designFixture: true })],
    });
    const urls = buildSitemap(bundle, 'https://example.org', ['/', '/guides/'], { now: NOW }).map((e) => e.url);
    expect(urls).toEqual(['https://example.org/', 'https://example.org/guides/', 'https://example.org/guides/test-guide/']);
  });
});

describe('route gating', () => {
  it('maps published kinds to detail-route page extensions', () => {
    expect(detailRouteExtensions([])).toEqual([]);
    expect(detailRouteExtensions(['guide', 'class'])).toEqual(['guides.tsx', 'classes.tsx']);
  });
});
