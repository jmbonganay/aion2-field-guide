import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { enabled, legalNav, primaryNav, staticRoutes, utilityNav } from '@/config/site';

const APP = path.join(process.cwd(), 'src/app');
const routeExists = (href: string) => fs.existsSync(path.join(APP, href, 'page.tsx'));

describe('navigation config', () => {
  const all = [...primaryNav, ...utilityNav, ...legalNav];

  it('every enabled link has a page (no dead links)', () => {
    for (const item of enabled(all)) expect(routeExists(item.href), item.href).toBe(true);
  });

  it('disabled sections have no page yet (no empty categories)', () => {
    for (const item of all.filter((i) => !i.enabled)) expect(routeExists(item.href), item.href).toBe(false);
  });

  it('hrefs use trailing slashes and are unique', () => {
    const hrefs = all.map((i) => i.href);
    for (const href of hrefs) expect(href).toMatch(/^\/([a-z-]+\/)*$/);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('sitemap static routes are exactly home + enabled nav', () => {
    expect(staticRoutes).toEqual(['/', ...enabled(all).map((i) => i.href)]);
  });

  it('Phase 1 required routes exist', () => {
    for (const href of ['/', '/guides/', '/classes/', '/dungeons/', '/systems/', '/sources/', '/about/', '/disclaimer/', '/privacy/']) {
      expect(routeExists(href), href).toBe(true);
    }
    expect(fs.existsSync(path.join(APP, 'not-found.tsx'))).toBe(true);
  });

  it('every detail route uses static params with dynamicParams = false', () => {
    for (const section of ['guides', 'classes', 'dungeons', 'systems']) {
      const file = path.join(APP, section, '[slug]', `page.${section}.tsx`);
      const text = fs.readFileSync(file, 'utf8');
      expect(text).toContain('export const dynamicParams = false');
      expect(text).toContain('generateStaticParams');
    }
  });
});
