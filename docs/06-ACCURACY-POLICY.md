# 06 — Data Accuracy, Evidence & Editorial Policy

## Why this is central
AION 2 guides change with patches; Global differs from other services, names are localized, and community advice may be anecdotal. A beautiful inaccurate guide is a failed product.

## Evidence hierarchy
1. **Primary:** NCSOFT official Global announcements, patch notes, current in-game UI/tooltips and official statements.
2. **Strong secondary:** independently verifiable data extraction with methods, build/version, provenance, and permissible use.
3. **Firsthand:** documented in-game test, timestamp, server/region, screenshots or repeatable steps.
4. **Community:** well-labeled player reports, comparisons, guides and discussions; useful for hypotheses, not definitive rates without corroboration.
5. **Unacceptable alone:** AI summaries, unsourced aggregator copy, old conversation answers, content from another region represented as Global, unsupported guesses.

## Publication gate (ALL mandatory)
- [ ] Claim checked for correct game (AION 2, not original AION), Global service, patch and faction.
- [ ] Named item/skill/dungeon cross-checked against Global in-game text or source.
- [ ] Each actionable numeric claim links to a source and shows a last-verification date.
- [ ] For advice based on 'best', explain use case, tradeoffs and evidence. DPS claims need actual tests or labeled estimates.
- [ ] Every paid/crafting recommendation checks current cost, limitations, success rates and whether items transfer.
- [ ] Any date/time uses named region/timezone and source publication context.
- [ ] Reviewer other than text generator approves high-impact content before `published` status.
- [ ] No copied long passages, ripped images or unapproved map assets.
- [ ] Internal and external links checked; no accidental template or 'TBD' in public content.

## Claim classes
| Severity | Example | Evidence needed |
|---|---|---|
| Critical | Spend premium currency; irreversible upgrade; gear loss; risky exploit | Primary official/in-game evidence plus review |
| High | Dungeon gate, guaranteed loot, rates, class 'best build', recipe | Current first-party or 2 corroborating verifiable sources |
| Medium | Suggested farming route, performance optimization | Solid source + caveats where variables matter |
| Low | General navigation tips and UI explanation | Recent firsthand proof or current official UI |

## When sources disagree
1. Compare region, date, difficulty, item rarity, and whether claims refer to reward cubes or monster drops.
2. Prefer directly observable Global mechanics over unversioned guide summaries.
3. Mark disputed information `in_review`; do not fabricate compromise values or present as fact.
4. Create an evidence note documenting conflict and test/verification required.
5. Keep stale guide out of current recommendation results until resolved.

## Patch maintenance
- Manually review official patch notes at least weekly during active season.
- Map changed skills, items, dungeons and systems to affected content IDs.
- Flag those guides `stale` or `in_review` until updated. A build from 2026-10-14 must not appear newly verified merely because CSS changed.
- Show visible 'Last verified' on detail pages and affected version tag.
- Archive historical guides instead of erasing their history.

## Source registry requirements
Each source: original URL, article title, publisher, evidence grade, game region, publication date if known, date inspected, specific facts supported, licensing status when media.

## Research workflow for one guide
1. Write the reader question and intended decision.
2. Gather primary Global sources and game-client screenshots where available.
3. Create fact records per numeric or actionable claim.
4. Cross-check independent alternatives and conflicting details.
5. Draft guide following `templates/GUIDE.template.md`.
6. Run schema validation and link checker.
7. Human/editor reviews recommendations; set `published` and `lastVerifiedAt` only after evidence inspection.
8. Re-review after relevant patch.

## High-risk hallucination watchlist
- Global vs KR/TW caps, patches and item levels.
- Gear Score vs Combat Score effects of upgrades.
- Currency spelling (Kina/Kinah) and Bound/unbound conversion.
- Set bonuses, equipment transfer rules, Manastone/Thestone engraving and loss.
- Guaranteed reward cycles, Odyle cost, drop rates and entry limits.
- Pet soul counts, owned bonuses, specific spawn locations.
- Real-time event dates and shop inventory.
- 'Free vs paid' value assessments lacking complete live reward tables.

## User-facing correction policy
Show a lightweight Sources & Corrections footer link on each guide. Optional GitHub Issues form/link can receive corrections without backend; do not imply it is monitored continuously unless maintained. Corrections should include guide URL, claim, screenshot/URL evidence, region, patch, and date. Store decisions via Git commit history; no public comments initially.

## Transparency rules
- Label 'Editorial recommendation' vs 'Game mechanic'.
- 'Verified' = evidence was reviewed by a responsible editor; never assign it automatically on save.
- Avoid subjective 'best' without clearly stated goal and competing alternatives.
- If evidence unavailable, publish an honest non-numeric explainer or defer the page.
- No claim of 100% future accuracy; track uncertainty and patch applicability.
