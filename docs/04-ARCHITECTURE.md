# 04 — Architecture & Vercel Deployment

## Recommended stack
- Next.js App Router (stable compatible release verified when creating project)
- React + TypeScript (`strict: true`), Tailwind CSS
- Local MDX for authored guides, local JSON/TS for normalized game records
- Zod (optional but strongly recommended) for build-time content validation
- Tiny client-side search (MiniSearch or Fuse.js if needed; avoid server search)
- Vitest or equivalent unit tests; Playwright for smoke checks; ESLint
- GitHub public or private source repository; Vercel Hobby deployment for eligible **personal, non-commercial** usage

## Static-only invariant
```ts
// next.config.ts
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
```
Use `generateStaticParams()` + `dynamicParams = false` for every dynamic route, generated from published validated records. `next build` must succeed and output `out/`. If Vercel framework handles the output automatically, use its defaults; otherwise set static output as required after validation.

Unsupported in static export: Server Actions, API routes requiring a request, SSR personalization, cookies, redirects/rewrites, incremental static regeneration, default image optimization, runtime data fetching for essential content. **Do not sneak any of them in.**

## Suggested source tree
```text
src/
  app/
    layout.tsx
    page.tsx
    not-found.tsx
    classes/page.tsx
    classes/[slug]/page.tsx
    guides/page.tsx
    guides/[slug]/page.tsx
    gear/page.tsx
    gear/[slug]/page.tsx
    dungeons/page.tsx
    dungeons/[slug]/page.tsx
    systems/page.tsx
    systems/[slug]/page.tsx
    sources/page.tsx
    about/page.tsx
    disclaimer/page.tsx
    privacy/page.tsx
  components/
    layout/ ui/ guides/ data/
  content/
    guides/*.mdx
    entities/*.json
    patches/*.json
    sources.json
  lib/
    content.ts
    schemas.ts
    search.ts
    links.ts
    constants.ts
  styles/
  tests/
public/
  art/original/
  icons/original/
scripts/
  validate-content.ts
  build-search-index.ts
```
Static docs can live in repository `/docs` while content and source files live under `/src/content`.

## Data flow
1. Editor adds a researched source entry and a guide/record in Git.
2. CI validates region, status, source links, numeric claim references, related IDs, expiry and cross-page consistency.
3. Build selects only records with `status: published`, `verifiedAt`, named reviewer and evidence.
4. Next.js produces HTML and JS static assets; build outputs source-driven search index.
5. Vercel CDN serves static pages; no per-visitor database or game API usage.

## Content isolation
- `src/content/fixtures/` is NEVER included in published lists/routes/search/sitemap.
- Only `published` records pass the public selector. Type-level status is not sufficient; runtime schemas and validation are required.
- Keep time-sensitive information (`shop price`, `event expiry`, `server status`) versioned and flagged; never display 'live' if not live.

## Media handling
- Generate custom original SVG/CSS imagery for common categories.
- For permitted game screenshots, record source owner, permission/license and attribution in `media-manifest.json` before use.
- No hotlinking competitor assets or CDN URLs without permission.
- Use WebP/AVIF when applicable, image dimensions, lazy loading below the fold.

## Deployment and free-tier limits
- No paid Vercel features or storage; no scheduled server jobs.
- Use Vercel's included `*.vercel.app` URL unless user buys domain separately.
- Monitor Hobby bandwidth/build limits and Vercel's personal/non-commercial restrictions: https://vercel.com/docs/plans and https://vercel.com/docs/limits
- Future ads/sponsorships require a host/plan policy review; don't assume commercial hosting is free.
- Never say deployment occurred without verifying URL and build outcome.

## Version discipline
- Use compatible stable versions, lockfile checked in, and no `latest` floating dependency pins.
- Check version-specific Next.js docs locally; document package versions in README.
- CI: npm run lint; npm run typecheck; npm run content:validate; npm run test; npm run build.

## Failure modes to test
1. Invalid content fails build with useful error.
2. A removed guide no longer appears in search or sitemap.
3. Browser-refreshing detail URL resolves on Vercel.
4. Javascript disabled: core static content still readable.
5. Failed or missing image has accessible fallback; no layout shifts.
6. No URL includes a template/fixture article.

## Implementation references
- https://nextjs.org/docs/app/guides/static-exports
- https://nextjs.org/docs/app/guides/mdx
- https://vercel.com/docs/plans
- https://vercel.com/docs/limits
