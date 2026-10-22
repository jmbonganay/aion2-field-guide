# 08 — Interactive Feature Specifications (Static/Client-only)

## 1. Search (MVP)
**Goal:** find published guides and entities quickly without server services.
- Generate index at build from verified published records; store under static assets.
- Include title, aliases, region, class, category, tags and excerpt; only published documents.
- Keyboard shortcut `Ctrl/Cmd+K` and accessible search input; '/' optional if it does not interfere with typing.
- Results show title, content type, category and excerpt. Exact match ranks first.
- Escape closes dialog; Enter opens selected result; keep aria roles correct.
- Empty query shows recent/featured VERIFIED links, not invented popularity numbers.
- No query logs, tracking, or external search APIs.
- Tests: multiple words, empty query, symbols, nonexistent query, mobile focus, keyboard.

## 2. Filters (MVP)
Directory filters for class, topic, content type, PvE/PvP and currentness. Only show dimensions supported by published records. Client state; URL parameters optional, sanitized and reload-safe.

## 3. Comparison (Phase 3 or later)
- Compare 2–3 records in same family where they have comparable confirmed fields.
- If a stat is missing, show 'Not verified' rather than 0 or fabricated value.
- Show patch/region per item and links to sources.
- No algorithm declaring an item 'best' without test-driven weights + disclosures.

## 4. Personal progress checklist (Phase 3, optional)
- 'Track on this device' using `localStorage` with clear/reset buttons.
- No character sync, no account, no server tracking.
- Clear disclaimer that checking an item does not change anything inside AION 2.
- Graceful hydration and browser storage disabled case.

## 5. Update and currentness banners (MVP)
- Display verified patch/date, source counts and status on relevant detail pages.
- Mark `stale` as unpublished or archived, not as a prominent current recommendation.
- No automatic 'LIVE' labels or relative promises.

## 6. Source and correction pathway (MVP)
- Link primary source URLs and source metadata.
- Corrections via optional public GitHub Issue template, subject to maintainer review.
- Do not collect emails/messages in a backend; no unmoderated comments.

## 7. Future build planner (Phase 5)
- Only after damage/stat formula is verified with game evidence.
- Clearly separate GS thresholds, CS, numerical attack/crit calculations and nonlinearity.
- Unit tests include edge cases (empty slots, thresholds, patches).
- Do NOT begin this just because a visual mockup looks appealing.

## Empty states
- 'No verified guides match this filter' with a clear reset option.
- 'This equipment value is not yet verified for Global' rather than silently blank.
- Error screens have a useful navigation link.

## Nonfunctional
- Search loads on demand, static index compressed, no external requests except links initiated by user.
- Mobile-first, keyboard accessible, honors reduced motion.
