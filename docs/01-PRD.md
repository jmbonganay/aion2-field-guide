# 01 — Product Requirements Document

## 1. Problem
AION 2 players must jump between patch notes, guides, databases, and Discord to understand gear progression, class builds, resources, and dungeon rewards. Information is often outdated or derived from another region. Build a trustworthy Global-focused companion reference with excellent information retrieval.

## 2. Product vision
A premium-feeling **unofficial** AION 2 encyclopedia that answers: (a) What should I do next? (b) Where can I obtain this? (c) Which build suits my class and game mode? (d) What evidence supports this recommendation?

## 3. Target audiences
- New player: beginner progression and systems explanations.
- Returning/midgame player: next dungeon, gear replacement, farming paths.
- Endgame optimizer: skills, stat priorities, nuanced tradeoffs, patch impact.
- Mobile reader: concise quick answers while playing on PC.

## 4. Business model and constraints
- Read-only public website; no authentication, accounts or paywalls.
- Initially personal, non-commercial; free on Vercel Hobby, subject to plan limits.
- No external database, server APIs, secrets, or paid subscriptions.
- Editors commit content to Git and redeploy. No visitor editing.
- English and Global-first; other regions only with explicit segregation, later.

## 5. MVP outcomes
1. Readers can locate a topic in at most 3 deliberate navigational actions, or via client-side search.
2. Every published factual game guide identifies applicability, source links, and last-verified date.
3. One Sorcerer PvE build page has a complete, verifiable step-by-step structure (only after review).
4. All entity-detail templates (item, dungeon, class, guide) support future scale without route redesign.
5. Keyboard-only and mobile experiences are fully usable.
6. Pure static export works on Vercel; zero mandatory server runtime.

## 6. Functional requirements (prioritized)
| ID | Priority | Requirement | Acceptance signal |
|---|---|---|---|
| FR-01 | Must | Home with clear navigation and game-mode entry points | No dead links |
| FR-02 | Must | Class directory and class guide template | Correct navigation and filters |
| FR-03 | Must | Guide index and detail with source box | Source metadata rendered |
| FR-04 | Must | Dungeon index/detail with requirements and rewards | Only verified values shown |
| FR-05 | Must | Search across published content | Query, keyboard, zero-results work |
| FR-06 | Must | Type-safe local content with validation | Bad records fail CI |
| FR-07 | Must | Region, patch, and evidence labels | Every numerical claim traceable |
| FR-08 | Must | Responsive site navigation | Pass mobile smoke tests |
| FR-09 | Must | Source register, corrections and disclaimers | Links and status visible |
| FR-10 | Should | Gear progression guide and upgrade checklist | Client-side only, no data collection |
| FR-11 | Should | Filter by class, PvE/PvP, level and content type | URLs/back button sensible |
| FR-12 | Should | Compare equipment with clear data provenance | No guessed values |
| FR-13 | Later | Pet spawn atlas/maps | Only licensed map data/permission |
| FR-14 | Later | Build planner and calculations | Formula/version/source tested |
| FR-15 | Later | Patch-diff highlights | Human-reviewed, manual content |

## 7. Core page UX
- **Guide:** TL;DR, applicability, currentness, recommendations with rationale, steps, alternatives, pitfalls, source citations, update history.
- **Dungeon:** entry details, group size, location (verified), rewards, class considerations, boss overview, patch applicability.
- **Class:** PvE/PvP guide separation, gear priority, skill and Stigma synergies, progression stage, uncertainty and tradeoffs.
- **Item:** identification, rarity, slot, tradability, documented source, compatible classes, relevant stats and corroboration.
- **Resources:** steps and alternate sources; distinguish free/paid, daily/weekly, one-time/repeatable.

## 8. Content principles
- A shorter accurate answer beats a comprehensive fabricated one.
- Quantitative claims need source, patch/region applicability and last verification.
- 'Best-in-slot' is conditional on encounter, patch, budget and goals; show rationale, not absolute rankings without data.
- Use plain language, progressive disclosure, cited game terminology.

## 9. Non-functional requirements
- Static, fast, secure by default, no personal user data or analytics initially.
- Content checks and build deterministic; sources stored locally.
- Targets: mobile Lighthouse Performance >= 90 on representative public pages (best-effort lab target), Accessibility >= 95, zero severe a11y issues; responsive from 320px to 1920px; CWV aims LCP <= 2.5s, CLS <= 0.1, INP <= 200ms (measured real-world when available).
- Deploy via GitHub/Vercel and free `*.vercel.app` subdomain initially.

## 10. Out of scope for initial launch
Login, user comments, forums, player profiles, embedded Discord bots, real-time market/server availability, automated scraping, payments, premium subscription, localization, affiliate ads, AI-generated auto-published guides, official game API integration.

## 11. Success measures
- Published pages have 100% required metadata and evidence fields.
- No release-blocking broken links, missing images, or contradictory thresholds.
- 100% configured published routes export to static HTML.
- A first-time tester finds 'how to farm X' and 'where to get Y' in <= 3 actions.
- Zero known, material uncited recommendations on launch.

## 12. Open decisions
Working brand name, number of vetted articles at launch, game icon/image asset rights, editorial ownership, and eventual monetization. Defaults captured in `14-DECISIONS.md`.
