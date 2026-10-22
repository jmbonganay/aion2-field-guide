# 14 — Decision Log / Project Assumptions

| ID | Status | Decision | Rationale / revisit trigger |
|---|---|---|---|
| ADR-001 | Accepted | Working title 'AION 2 Field Guide' | Renameable; branding should be unique/unofficial |
| ADR-002 | Accepted | Global-first content only for MVP | Prevent KR/TW version leakage |
| ADR-003 | Accepted | Static Next.js export on Vercel Hobby | No DB/backend and low hosting cost; personal/non-commercial |
| ADR-004 | Accepted | Local MDX + JSON/TS and evidence registry | Easy Git review and reproducible builds |
| ADR-005 | Accepted | Sorcerer first; data model supports all classes | High-confidence initial editorial focus |
| ADR-006 | Accepted | Hard 'published' gate with reviewer/evidence | Prevent fabricated game mechanics |
| ADR-007 | Accepted | Original fantasy UI visuals until rights are confirmed | Avoid IP risk |
| ADR-008 | Accepted | No visitor analytics, auth, user uploads | Privacy and free infrastructure simplicity |
| ADR-009 | Accepted | Single-language English for MVP | Keep scope focused; other locales later |
| ADR-010 | Provisional | Use CSS/SVG, system fonts initially | Revisit design font/license options later |
| ADR-011 | Open | Precise public launch name + domain | Finalize after initial design review |
| ADR-012 | Open | Who performs human source review | Must be assigned before factual publication |
| ADR-013 | Open | Whether external images have licensed usage | Do not use unless verified |
| ADR-014 | Open | Future monetization | Requires review of hosting terms and legal implications |
| ADR-015 | Accepted (Phase 1) | Stack pinned: Next.js 16.4.2, React 19.3.1, TypeScript 6.0.3, Tailwind 4.3.3, Zod 4.3.3, Vitest 4.1.12 | Latest stable compatible set on 2026-10-22. TypeScript 7.x skipped: typescript-eslint 8 supports <6.1. Revisit when tooling supports TS 7 |
| ADR-016 | Accepted (Phase 1) | Detail routes named `page.<section>.tsx`; `next.config.ts` enables a section's extension only when it has published records | Next 16 rejects empty `generateStaticParams()` with `output: 'export'`; placeholder slugs would export fake 200 pages |
| ADR-017 | Accepted (Phase 1) | Search index is a force-static route handler (`/search-index.json`) instead of a generated file in `public/` | Always built from the same publication gate as pages; no stale artifact to commit. Replaces planned `scripts/build-search-index.ts` |
| ADR-018 | Accepted (Phase 1) | Design fixtures live in `src/content/fixtures/` (TS, `designFixture: true`) and render only on `*.dev.tsx` pages registered on the dev server | Fixtures physically cannot enter `next build`; `verify:export` also scans `out/` for fixture markers |
| ADR-019 | Accepted (Phase 1) | MDX guide bodies compiled at build with `@mdx-js/mdx` `evaluate`; frontmatter parsed with `yaml` | `gray-matter` rejected (pulls vulnerable `js-yaml` 3). MDX is trusted repo content only |
| ADR-020 | Accepted (Phase 1) | Only Vercel production builds are indexable; canonical origin = `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → localhost | Prevents preview URLs being indexed or used as canonicals |
| ADR-021 | Accepted (Phase 1) | Publication gate also requires `reviewedBy` ≠ `author` and Global region; disputed facts block publication | Encodes accuracy-policy reviewer and conflict rules mechanically |
| ADR-022 | Superseded by ADR-031 | Directory filters deferred to Phase 3 | Spec: only show filter dimensions supported by published records; none exist yet |
| ADR-023 | Accepted (Phase 2) | Facts carry `capturedBy`/`capturedAt` separately from `verifiedBy`/`lastVerifiedAt`; published pages need every fact verified by someone other than its capturer | Makes "AI researched, human verified" explicit and enforceable |
| ADR-024 | Accepted (Phase 2) | Skills and items are records without their own routes: skills render on their class page (`#skill-<slug>`, searchable), items on pages that list them | Avoids empty item/skill directories; dedicated item pages (`/gear/`) revisited in Phase 3 |
| ADR-025 | Accepted (Phase 2) | Prose numbers must come from `<Fact>`; `<Fact label>` numbers must match the fact value; `<Term>` exempts names with digits | Enforces "every actionable number traceable" mechanically |
| ADR-026 | Accepted (Phase 2) | Patch records with `changedIds` + `effectiveAt`; a page whose subject changed after its last verification drops out of the site | Currentness rule from 06-ACCURACY-POLICY ("flag stale until updated") |
| ADR-027 | Accepted (Phase 2) | Human approval via `npm run content:approve` (explicit flag, refuses author/capturer, simulates the full gate) and dev-only `/review/` previews | No automatic AI publication; reviewer sees the real page |
| ADR-028 | Accepted (Phase 2) | Search indexes body text with fact values substituted (≈4 KB gzipped for 6 pages) | "Full client-side search across verified pages"; revisit size at ~100 pages |
| ADR-029 | Accepted (Phase 2) | Research uses only official NC sources read in a headless browser (robots allow); third-party databases not used | Avoids licensing/accuracy risk of aggregator data |
| ADR-030 | Accepted (Phase 3) | `/updates/` lists only patches that changed at least one published page | Patch summaries are paraphrases; they reach the public only after being reviewed as part of an affected page's patch history |
| ADR-031 | Accepted (Phase 3) | Directory filters are client-side over server-rendered lists, offered only for dimensions with ≥2 values; URL params sanitized to known values | FR-11 without empty filter UI or no-JS breakage (supersedes ADR-022) |
| ADR-032 | Accepted (Phase 3) | Share image committed as `public/og/field-guide.png` (rendered by `scripts/generate-og.tsx`) instead of the `opengraph-image` route | The route exported an extension-less file and page-level `openGraph` dropped it; an explicit PNG is portable to any static host |
| ADR-033 | Accepted (Phase 3) | Project moved out of iCloud Drive to `~/Developer/`, Desktop path kept as a symlink | iCloud duplicated files inside build/dependency folders; `.nosync` symlinks break Turbopack's dependency detection |
| ADR-034 | Accepted (Phase 3) | The AI author does not act as reviewer, even with owner permission; an automated second-pass fact check is recorded instead | Policy requires a reviewer other than the text generator; a false "Verified" label would defeat the site's purpose |

## Operating assumption
All requirements are defaults chosen to let implementation start now without needing approval for every small choice. If an unresolvable conflict blocks accuracy, build infrastructure and report the blocker rather than guessing.

## Change control
Record decisions on major dependency, content schema, publishing standard, cost, source license, data acquisition or design direction before merging the change.
