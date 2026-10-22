# 15 — Launch QA sign-off (against `10-QA-CHECKLIST.md`)

Evidence recorded 2026-10-22. Live site: https://aion2-field-guide-liart.vercel.app — source: https://github.com/jmbonganay/aion2-field-guide.
Status key: ✅ done with evidence · ⚠️ partial / accepted risk · ⏳ ongoing duty.

## Automated checks (run by `npm run check`, locally and in GitHub Actions CI)
| Item | Status | Evidence |
|---|---|---|
| Strict typecheck, zero errors | ✅ | `next typegen && tsc --noEmit` |
| ESLint, zero blocking errors | ✅ | `eslint .` |
| Schema rejects missing sources, wrong region, duplicate IDs, invalid dates | ✅ | `tests/schemas.test.ts`, `tests/validation.test.ts` |
| Published fact/related IDs resolve | ✅ | `validateBundle` + publication gate |
| Internal broken-link scan | ✅ | `scripts/verify-export.ts` (all internal links in `out/`) |
| Static export to `out/`, static params only | ✅ | `next build`; `tests/navigation.test.ts` |
| Drafts/fixtures absent from site, search, sitemap | ✅ | `verify-export.ts` scans every exported file |
| Tests for search ranking, filters, selector, status gating, expiry | ✅ | 141 Vitest tests |

## UX smoke tests
| Item | Status | Evidence |
|---|---|---|
| 320–1920 px, no horizontal scroll | ✅ | Headless Chrome sweep of all routes at 320/375/768/1024/1440/1920 |
| Header, nav, search, breadcrumbs, back/forward | ✅ | Puppeteer keyboard/menu/search scripts |
| Focus visible, keyboard reachable | ✅ | axe-core 0 violations (37 page states); manual Tab/Escape checks |
| Tables scroll in their own container | ✅ | `FactTable`, MDX tables wrapped in scroll regions |
| Images alt/decorative | ✅ | All art is decorative inline SVG (`aria-hidden`) |
| JavaScript disabled | ✅ | No-JS render of home/sources/about checked |
| Reduced motion; one H1 per page | ✅ | Computed-style check; `verify-export.ts` H1 count |

## Accuracy / editorial
| Item | Status | Evidence |
|---|---|---|
| Every published page passed the gate, human reviewer ≠ author | ✅ | All published records `reviewedBy: jmbonganay`; author is the AI draft |
| Every actionable number cited | ✅ | `<Fact>`-only numbers enforced at build |
| No fabricated rates/prices/rewards/requirements | ✅ | Only values from official NC sources; open questions listed per page |
| KR/TW not presented as Global | ✅ | Global-only gate; fan databases with KR/TW data rejected (see `docs/research/README.md`) |
| "Last verified" separate from "Updated" | ✅ | Both shown in the verification panel |
| Names checked against Global localization | ✅ | Spelling taken from official Global pages (e.g. "Belluslan" correction) |
| No stale/expired guide advertised as current | ✅ | Patch-currentness rule + `expiresAt` with hourly expiry sweep |
| No unlicensed official assets | ✅ | Original art only (`public/art/original/MANIFEST.md`) |

## Technical / security
| Item | Status | Evidence |
|---|---|---|
| No API routes, DB, auth, cron server, scraping code, secrets | ✅ | Static export; the expiry sweep is a GitHub Action, not site code |
| Dependencies audited, pinned, reproducible | ✅ | `npm audit --omit=dev`: 0; exact pins + lockfile; Dependabot weekly |
| No analytics/cookies | ✅ | None shipped; Privacy page states this |
| Direct deep-URL refresh on Vercel | ✅ | Live curl checks: 200 for all pages, 308 for no-slash, real 404 |

## SEO / performance
| Item | Status | Evidence |
|---|---|---|
| Unique titles/descriptions, canonicals, sitemap, robots | ✅ | Live `sitemap.xml`, `robots.txt`; canonical = production domain |
| Open Graph with rights-cleared art | ✅ | `public/og/field-guide.png` (original) |
| Lighthouse ≥ 90 perf, ≥ 95 a11y | ✅ | Live mobile: 100 / 100 / 100 / 100, LCP 1.2 s, CLS 0 |
| Real-user Core Web Vitals | ⚠️ | Not measured — no analytics by design (ADR-008) |

## Ongoing duties (not one-time items)
| Duty | Status | How |
|---|---|---|
| Review patch notes weekly | ⏳ | Add each to `src/content/patches/` with `changedIds`; affected pages drop until re-verified |
| Re-verify pages every 45 days | ⏳ | Validation warns at 45 days |
| Watch corrections | ⏳ | GitHub Issues "Correction" form |

## Open decisions (owner's call, not blockers)
ADR-011 final name/domain · ADR-013 any licensed official imagery · ADR-014 monetization (would require a Vercel plan review).

**Signed off for public operation:** content and site checks above pass; remaining items are ongoing duties and owner decisions.
