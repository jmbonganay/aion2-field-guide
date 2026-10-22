# AION 2 Field Guide

> **Working title:** AION 2 Field Guide (change before launch if desired)  
> **Project type:** Unofficial, free, non-commercial, read-only fansite  
> **Prepared:** 2026-10-22  
> **Status:** Phase 2 (editorial system + Sorcerer MVP) implemented. Six source-backed pages are drafted `in_review` and await **human** sign-off; nothing is published until a reviewer approves it. NOT a verified game-item database.

## Quick start

Requirements: **Node.js ≥ 20.9** (developed on Node 24.16 / npm 11.13). No accounts, API keys or paid services are needed.

```bash
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 (also serves the dev-only /design-preview/)
npm run check     # lint + typecheck + tests + validated production build
npm start         # serve the static export in out/ on http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server. Also enables `/design-preview/` and `/design-preview/guide/`, which render **design fixtures** (never built). |
| `npm run build` | `content:validate` → `next build` (static export to `out/`) → `verify:export`. Fails on any content or export error. |
| `npm run content:validate` | Schema + cross-record + publication-gate validation of `src/content/`. |
| `npm run verify:export` | Checks `out/`: required files, no fixtures/drafts, sitemap/search contain only published records, one `<h1>` per page, no broken internal links. |
| `npm run lint` / `npm run typecheck` / `npm test` | ESLint (Next core-web-vitals + TS), `tsc --noEmit` (strict), Vitest. |
| `npm run content:review` | Lists every record and what still blocks its publication. Read-only. |
| `npm run content:approve -- <id> --reviewer "Name" --i-checked-the-sources` | **Human reviewer only.** Publishes a record (plus its skills/items) and marks its facts verified. Refuses the author, the fact capturer, and anything that would fail the gate. `--dry-run` to preview. |
| `npm run og:generate` | Re-renders the original share image to `public/og/field-guide.png` (commit the result). |
| `npm run links:check` | Politely checks every source URL is reachable (needs network; not part of the build). |
| `npm run check` | Everything above except review/approve/links, in CI order. |

### Package versions (pinned exactly in `package.json`, locked in `package-lock.json`)
Next.js 16.4.2 · React 19.3.1 · TypeScript 6.0.3 · Tailwind CSS 4.3.3 · Zod 4.3.3 · MiniSearch 7.2.0 · @mdx-js/mdx 3.1.1 · remark-gfm 4.0.1 · yaml 2.9.1 · ESLint 9.39.5 (eslint-config-next 16.4.2) · Vitest 4.1.12 · tsx 4.23.15.

## How the site is put together

```text
src/
  app/                    routes (App Router, static export only)
    page.tsx              home
    guides|classes|dungeons|systems/page.tsx         index pages
    guides|classes|dungeons|systems/[slug]/page.<section>.tsx   detail routes (gated, see below)
    sources|about|disclaimer|privacy|updates/page.tsx
    not-found.tsx, sitemap.ts, robots.ts, search-index.json/route.ts, icon.svg
    design-preview/*.dev.tsx   dev-server-only fixture previews
    review/**/*.dev.tsx        dev-server-only review queue and draft previews
  components/{layout,ui,content,search}/
  config/site.ts          site name, nav (config-driven, per-item `enabled`), disclaimer
  content/                sources.json, facts/, patches/, guides/*.mdx, classes|dungeons|systems|skills|items/*.json(+.mdx)
  content/fixtures/       DESIGN FIXTURES ONLY — never read by public selectors
  lib/                    schemas (Zod), loader, validation, publication gate, search, sitemap
scripts/                  validate-content.ts, verify-export.ts, review-queue.ts, approve.ts, check-links.ts
tests/                    Vitest unit + content tests
```

**Publication gate** (`src/lib/publication.ts`): a record becomes a page, search result or sitemap entry only if it is `status: published`, Global, not a fixture, reviewed by someone other than its author, has a past `lastVerifiedAt`, cites at least one resolvable non-fixture source, cites no disputed / cross-region facts and contains no placeholder text (`TODO`, `TBD`, …). Every public selector runs this gate at build time; CI validation additionally fails the build when a `published` record does not pass.

**Detail routes are gated per section.** Next.js refuses an empty `generateStaticParams()` under `output: 'export'`, and a placeholder slug would export a fake 200 page. So each detail route file is named `page.<section>.tsx`, and `next.config.ts` registers that extension only when the section has at least one published record. Until then, `/guides/anything/` is a real 404.

**Editorial workflow (Phase 2).** Facts record who captured them and, separately, which human verified them. Pages cite facts inline with `<Fact id>`; any uncited number in prose blocks publication, as does a newer official patch that changed the page's subject. Drafts are reviewed on the dev-only `/review/` pages with the real template, then approved by a human with `content:approve`. Research notes for every drafted page are in `docs/research/README.md`.

> **Location.** The project lives at `~/Developer/aion2-fieldguide-planning`, outside iCloud Drive. `~/Desktop/aion2-fieldguide-planning` is a symlink to it. iCloud syncing had created duplicate `name 2` folders inside `node_modules`, `.next` and `out`; keep the project out of synced folders.

**Phase 3 additions.** `/updates/` lists official updates that changed a *published* page (so every summary shown has been reviewed). Directory pages get client-side filters for any dimension with two or more values among published records; filter state is mirrored to sanitized URL parameters. Every page shares an original Open Graph / Twitter image (`public/og/field-guide.png`, regenerate with `npm run og:generate`).

**Audits (2026-10-22, rehearsal build with the six drafts approved by a simulated reviewer):** Lighthouse mobile Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100 (indexable build), LCP ≤ 2.2 s, CLS 0; axe-core: 0 violations across 37 page states (all routes at 375/1440 px, search dialog, mobile menu).

**Adding content:** follow `src/content/README.md`, `docs/05-CONTENT-SCHEMAS.md`, `docs/06-ACCURACY-POLICY.md` and `templates/`. Add the source to `sources.json`, claims to `facts/*.json`, then the guide/record; run `npm run content:validate`.

## Deploying to Vercel (free Hobby plan)

Source: https://github.com/jmbonganay/aion2-field-guide (public). Vercel project `aion2-field-guide` in the owner's Hobby account is linked to it: every push to `main` deploys to production, other branches get preview deployments.

1. Push this folder to a GitHub repository you own (commit `package-lock.json`).
2. In Vercel: **Add New → Project → Import** the repository. Framework preset: **Next.js** (auto-detected). Leave build command (`npm run build`) and output settings at their defaults — Vercel handles `output: 'export'`. Node.js version: 20.x or later.
3. Optional environment variable: `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-project.vercel.app`). If unset, the build uses Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, so canonicals never point at preview URLs.
4. Indexing: production deployments (`VERCEL_ENV=production`) are indexable; preview and local builds emit `robots.txt` → `Disallow: /` and `noindex` meta.
5. After deploying, check `/`, a deep URL refresh (e.g. `/sources/`), `/sitemap.xml`, `/robots.txt` and a nonexistent URL (should return 404).

Hobby is for **personal, non-commercial** use and has usage limits — check https://vercel.com/docs/plans and https://vercel.com/docs/limits before launch and before any monetization. A custom domain is optional and may cost money; infrastructure starting at $0 is not a promise of perpetual free operation.

---

# Project planning pack

## Vision
Build a fast, polished, accessible, source-backed AION 2 reference website for Global players. The design should feel like a premium MMO companion without imitating NCSOFT's branding or redistributing unlicensed art. Start with a deep, accurate Sorcerer section and a reusable information architecture that scales to every class and game system.

## Non-negotiables
1. $0 required ongoing services for an initial personal non-commercial website: Vercel Hobby + GitHub + static assets + local Markdown/MDX and JSON.
2. **Read-only** means visitors cannot create accounts, post, purchase, or modify server data. Optional search/filter and browser-local preferences are allowed.
3. **No unsupported gaming claims.** Never invent drop rates, item stats, recipes, requirements, patch dates, rewards, or rankings.
4. **Global and KR/TW are separate editions.** Never present region-specific claims as Global facts without verification.
5. **No copyrighted game assets without permission/appropriate license.** Use original graphic treatments until asset rights are established.
6. Complete, test, and review one phase before starting the next. Do not generate hundreds of speculative articles to fill pages.
7. Accessible desktop/tablet/mobile design, light JavaScript, excellent UX, and clear source dates.

## Where Claude Code should start
1. Read `AGENTS.md`, `CLAUDE.md`, and `docs/01-PRD.md` through `docs/12-LEGAL-ASSETS.md`.
2. Read `docs/13-SOURCE-REGISTER.md` and `docs/14-DECISIONS.md`.
3. Begin **Phase 1 (foundation)** only, following `docs/09-ROADMAP.md` and `START_HERE_CLAUDE.md`.
4. Use templates in `/templates` for content authoring. Do not publish the templates as pages.

## Files
| File | Purpose |
|---|---|
| `AGENTS.md` | Agent guardrails and operating instructions |
| `CLAUDE.md` | Claude Code handoff and phase boundary |
| `START_HERE_CLAUDE.md` | Short copy/paste kickoff prompt |
| `docs/01-PRD.md` | Goals, audience, requirements, acceptance criteria |
| `docs/02-SITEMAP.md` | Routes, navigation, UX flows |
| `docs/03-DESIGN-SYSTEM.md` | Visual language, tokens, components, responsive behavior |
| `docs/04-ARCHITECTURE.md` | Stack, static export, file structure, deployment |
| `docs/05-CONTENT-SCHEMAS.md` | Content model, metadata, examples, validation |
| `docs/06-ACCURACY-POLICY.md` | Sources, publishing gates, revisions, conflicts |
| `docs/07-CONTENT-BACKLOG.md` | MVP editorial backlog and release sequencing |
| `docs/08-FEATURE-SPECS.md` | Search, filtering, comparison, navigation, local tools |
| `docs/09-ROADMAP.md` | Phases, deliverables, exit gates |
| `docs/10-QA-CHECKLIST.md` | Testing and launch gates |
| `docs/11-SEO-ACCESSIBILITY.md` | Performance, SEO, accessibility |
| `docs/12-LEGAL-ASSETS.md` | Copyright, disclaimer, host restrictions |
| `docs/13-SOURCE-REGISTER.md` | Starting references and research verification queue |
| `docs/14-DECISIONS.md` | Architecture decisions and unresolved choices |
| `templates/GUIDE.template.md` | Guide structure and editorial format |
| `templates/ENTITY.template.md` | Item, skill, dungeon, or creature research record |

## Definition of done
The site builds as a pure static export; no backend or paid dependency is required; published factual claims have usable evidence; no unverified recommendations are represented as facts; all main routes pass mobile/desktop testing; accessibility and SEO work; and Vercel deployment is verified on the free personal tier.

## Official developer references
- Next.js static exports: https://nextjs.org/docs/app/guides/static-exports
- Next.js MDX: https://nextjs.org/docs/app/guides/mdx
- Vercel plans: https://vercel.com/docs/plans
- Vercel limits: https://vercel.com/docs/limits
- AION 2 Global: https://aion2.plaync.com/en-us/index
- Official Steam announcements: https://steamcommunity.com/app/3393110/announcements/

**Note:** Infrastructure can start at $0; labor, an optional custom domain, future commercial usage, or higher traffic can change costs. Never promise perpetual free operation.
