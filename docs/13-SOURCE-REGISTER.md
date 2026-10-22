# 13 — Research Source Register (Starting Set)

> **Not an imported item database.** These links were checked as starting reference locations on 2026-10-22. Their presence does NOT verify any specific dungeon drop, skill build, crafting rate, or item stat. Re-open relevant pages when researching each guide.

## Primary sources
| ID | Source | URL | Allowed purpose |
|---|---|---|---|
| SRC-001 | Official AION 2 Global website | https://aion2.plaync.com/en-us/index | Game announcements and links |
| SRC-002 | Official AION 2 Steam announcements | https://steamcommunity.com/app/3393110/announcements/ | Patch notes, event dates, system changes |
| SRC-003 | Official Steam game page | https://store.steampowered.com/app/3393110/AION_2/ | Current release/platform context |
| SRC-004 | NCSOFT official corporate announcement | https://about.ncsoft.com/en/news/article/aion2_update_20261021 | Official release context |

## Technical / platform primary sources
| ID | Source | URL |
|---|---|---|
| TECH-001 | Next.js Static Exports | https://nextjs.org/docs/app/guides/static-exports |
| TECH-002 | Next.js MDX | https://nextjs.org/docs/app/guides/mdx |
| TECH-003 | Vercel plans | https://vercel.com/docs/plans |
| TECH-004 | Vercel limits | https://vercel.com/docs/limits |
| TECH-005 | Vercel fair use | https://vercel.com/docs/limits/fair-use-guidelines |

## Secondary sources to evaluate before use (not automatic authorities)
| Source | URL | Caution |
|---|---|---|
| AION2 Gaming Tools | https://aion2.gaming.tools/ | Verify locale, release/version, item ID and data methodology |
| AION2 Hub | https://aion2hub.com/ | Validate against primary and current in-game evidence |
| AION2.GG | https://aion2.gg/ | Data version, provenance, asset rights, reuse terms |
| Community guides | public video, forum or guides as encountered | Opinions/anecdotes, time-sensitive, no assumed reproduction rights |

## Specific official patch note used for update workflow example
The Steam announcements page currently links to `[Notice] Patch Notes | Oct. 20 (PDT) / Oct. 21 (CEST)`, which discusses Expedition Hard Mode and Sorcerer corrections. Before any guide mentions these mechanics, record the actual source URL, relevant version and patch effective date in `sources.json` and source-specific Fact entries.

## Research queue (not pre-verified claims)
- Sorcerer PvE skills, specialties and DPS interaction changes from recent patches.
- Valid Global progression levels for instance difficulties; exact loot sources.
- Arcana grade/slot details; entry thresholds and reward cube mechanics.
- Daevanion board cost and availability; crystal acquisition limits.
- Manastone engraving replacement/transfer mechanics; crafting costs.
- Pet soul rarity, owned effect unlock and Genus Insight Analyze behavior.
- Resource trade shops, time limits, season restrictions and paid pass value.

## Source capture procedure
For every selected claim: open current source, copy its canonical URL, log title/publisher, published/observed date, game region/build, relevant finding *in your own words*, claim IDs it supports, and any conflicting evidence. Add capture links or permitted screenshots where necessary. Do not quote extensive third-party text.

## Phase 2 additions (captured 2026-10-22, recorded in `src/content/sources.json`)
| ID | Source | URL |
|---|---|---|
| `source:launch-faq` | Launch FAQ (official Global site) | https://aion2.plaync.com/en-us/board/notice/view?articleId=50000244 |
| `source:patch-notes-2026-10-07` | Patch Notes, Oct. 6 (PDT) / Oct. 7 (CEST) | https://aion2.plaync.com/en-us/board/update/view?articleId=6ac5e6e8d97eae18cc40e34e |
| `source:patch-notes-2026-10-14` | Patch Notes, Oct. 13 (PDT) / Oct. 14 (CEST) | https://aion2.plaync.com/en-us/board/update/view?articleId=6acf20d007b77e214688a7ac |
| `source:patch-notes-2026-10-21` | Patch Notes, Oct. 20 (PDT) / Oct. 21 (CEST) | https://aion2.plaync.com/en-us/board/update/view?articleId=6ad85be86cfe4756db5b8e92 |
| `source:maintenance-2026-10-14` | Maintenance notice, Oct. 13/14 (completed) | https://aion2.plaync.com/en-us/board/notice/view?articleId=6ace8dc0263e537d356d10c3 |
| `source:maintenance-2026-10-21` | Maintenance notice, Oct. 20/21 (complete) | https://aion2.plaync.com/en-us/board/notice/view?articleId=6ad7900028c7452635072c01 |

Patch notes on the official Global site are the primary source for this phase (the Steam announcements page was not needed). Note: the SRC-004 NCSOFT article is dated 2026.10.06 and describes the October 5, 2026 Global launch.
