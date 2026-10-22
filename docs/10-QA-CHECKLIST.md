# 10 — Quality Assurance & Release Checklist

## Mandatory automated checks
- [ ] TypeScript strict typecheck succeeds with zero errors.
- [ ] ESLint succeeds with zero blocking errors.
- [ ] Schema validation rejects missing sources, wrong region, duplicate IDs and invalid dates.
- [ ] All published fact IDs and related IDs resolve to known records.
- [ ] Broken-link scan passes for internal routes; official external links spot-checked at review.
- [ ] Production `next build` produces `out/`; no unsupported static export features.
- [ ] Dynamic detail pages are generated with static params only.
- [ ] Drafts and demo fixtures absent from exported site/search/sitemap.
- [ ] Unit tests for search ranking, filters, published selector, status gating.

## UX manual smoke tests
- [ ] At widths 320, 375, 768, 1024, 1440, 1920: no horizontal scroll/cut-off.
- [ ] Header, navigation, search, breadcrumbs and back/forward work on mobile and desktop.
- [ ] Touch targets comfortable; focus states visible; all interactive elements reachable by keyboard.
- [ ] Search open/close (Escape), results, no-results, wrong-type query.
- [ ] Tables adapt or scroll within their own containers (no whole-page overflow).
- [ ] All images have purposeful alt text or are marked decorative; no broken media.
- [ ] Browser with JavaScript disabled can read core guide content and links.
- [ ] Reduced motion tested; headings semantically ordered, only one main H1.

## Accuracy/editorial blockers
- [ ] Every published guide passed `06-ACCURACY-POLICY.md`.
- [ ] Every actionable number has cited current region/patch evidence.
- [ ] There are no fabricated drop rates, prices, rewards or access requirements.
- [ ] KR/TW content is not misrepresented as Global.
- [ ] 'Last verified' is not confused with 'Last edited'.
- [ ] Item names/spellings and map/dungeon names are checked against correct localization.
- [ ] Irreversible/restricted actions mention costs and consequences based on evidence.
- [ ] No stale/archived guide advertised as current.
- [ ] No uncovered use of official copyrighted assets, font files or third-party images.

## Technical/security
- [ ] No API routes, database, auth, cron, scraping code or secret values shipped.
- [ ] Third-party packages audited; license-compatible, reasonably current, minimal.
- [ ] No analytics or cookies unless approved and disclosures updated.
- [ ] Public assets optimized and properly cached.
- [ ] Build/release can be reproduced from lockfile.
- [ ] Direct navigation to statically generated deep URLs works in Vercel deployment.

## SEO/performance
- [ ] Unique titles/descriptions, canonical URLs, sitemap.xml, robots.txt.
- [ ] Meaningful Open Graph metadata (only rights-cleared art).
- [ ] Lighthouse target desktop/mobile performance >=90 (aim), accessibility >=95.
- [ ] Measured Core Web Vitals targets recorded; optimize heavy images/fonts.
- [ ] No dead ends, irrelevant index pages, duplicate content or invented featured content.

## Launch smoke script
Open `/`, `/guides/`, a real guide, `/classes/`, Sorcerer class page, a dungeon, `/sources/`, `/about/`, `/disclaimer/`, a nonexistent route; then search for a known item, clear query and test keyboard navigation. Verify sources and live public asset URLs.

## Release gate
A phase is not 'complete' until actual command/test evidence is recorded. If a blocking issue remains, report it without claiming success.
