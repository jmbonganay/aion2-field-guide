# 09 — Phased Delivery Roadmap

## Phase 0 — Planning (this package)
Deliverables: PRD, sitemap, design system, architecture, schema, evidence protocol, editorial backlog, QA and legal strategy. Exit: docs coherent and no missing critical decisions to start a frontend scaffold.

## Phase 1 — Foundation & Design System (START HERE)
**Goal:** polished, functioning static skeleton with validated content plumbing.
- Initialize Next.js App Router/TypeScript/Tailwind; configure `output: 'export'`.
- Apply visual tokens and design responsive header/footer/nav, home layout, card/index/detail templates.
- Implement directory pages and accessible search shell. Mark sample fixtures as nonpublic.
- Add Zod schemas (or equivalent) + robust file validation. Build source registry and published-content selector.
- Implement 404, basic metadata, disclaimer, about, sources and skeleton legal pages.
- Establish lint, typecheck, content tests, `next build` and Vercel-compatible static output.
**Exit:** static build passes, mobile UI visually reviewed, no paid/runtime services, no fictitious game data published. Stop for review.

## Phase 2 — Editorial System + Sorcerer MVP
- Validate guide authoring and fact/source mapping end-to-end.
- Research/review a core Sorcerer page, two systems guides and one dungeon page using sources.
- Add real source-backed templates for skills, gear, dungeons and items.
- Wire full client-side search across verified pages.
- Run content-link and currentness checks. Verify each actionable number.
**Exit:** at least four complete verified pages with traceable claims, production-ready responsive design and no placeholder facts. Stop for review.

## Phase 3 — Public MVP Content & Polish
- Add prioritized content to approach 10–15 reviewed public entries, subject to evidence availability.
- Finish indices, crosslinks, search/filter, share metadata, optional local checklist.
- Optimize SEO, responsiveness, typography, a11y, bundle size and images.
- Verify current patch references and source rights.
**Exit:** editorial/public release QA passes and representative guides are independently reviewed. Stop for review.

## Phase 4 — GitHub + Vercel Launch
- Connect user-owned GitHub repo to Vercel Hobby, check eligibility and quota.
- Configure builds, inspect generated static pages, robots, sitemap, 404, and CSS/assets on preview/prod.
- Final permission/licensing audit and source-currentness sweep.
- Verify live site in mobile and desktop, including direct route refresh.
**Exit:** accessible verified deployment URL, production checklist signed off. Stop for review.

## Phase 5 — Expand Database/Tools
- Populate all class and dungeon areas with vetted content.
- Add item/pet indexes, validated comparisons, client-only planner where math is proven.
- Establish patch-diff workflow, consistent review cadence, corrections process.
**Exit:** no drop in accuracy, performance or free-plan eligibility; scope approved per sprint.

## Execution rules
- An agent works on **one phase only** per user instruction.
- No deployment without user's explicit request and account access.
- No generated content mass-filling pages without sources.
- Each phase report lists routes/components/data files added, tests run, deferred work and unresolved risks.

## Sample work breakdown for Phase 1
1. Project scaffold/lockfile and npm scripts.
2. Design tokens and global layout.
3. Navigation, mobile menu and accessible search shell.
4. Generic cards, typography and detail content containers.
5. Schema and source registry validator.
6. Published content selector with strict draft exclusion.
7. Static route templates and 404.
8. Unit/CI basics and production build verification.
9. Phase handoff with screenshots and 'what next'.
