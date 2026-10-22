# Research tickets — Phase 2

One ticket per page drafted in Phase 2, following the "Required fields in a guide research ticket" list in `docs/07-CONTENT-BACKLOG.md`. The six pages were researched and drafted by an AI assistant (Claude) as `in_review`. **Human review:** all six were reviewed and approved by jmbonganay on 2026-10-22 via `npm run content:approve`, which set `reviewedBy`, `lastVerifiedAt` and each fact's `verifiedBy`. All six are now published.

Evidence captured 2026-10-22 (UTC) from official NC pages, rendered with JavaScript in a headless browser (robots.txt on `aion2.plaync.com` and `about.ncsoft.com` allows all paths). No third-party database or wiki was used. Claims are paraphrased; no long passages were copied.

| Page | Record | Facts | Sources | Severity (06-ACCURACY-POLICY) |
|---|---|---|---|---|
| AION 2 Global: service basics | `guide:global-service-basics` | 16 | Launch FAQ, NC press release, Steam store | Low–Medium |
| Sorcerer | `class:sorcerer` (+3 skills) | 15 | NC press release, patch notes Oct. 13/14 and Oct. 20/21 | Medium |
| Krao Cave | `dungeon:krao-cave` (+2 items) | 10 | Patch notes Oct. 20/21, maintenance notice | High (entry gate, rewards) |
| Draupnir | `dungeon:draupnir` | 10 | Patch notes Oct. 20/21, maintenance notice | High (entry gate, rewards) |
| Ariel Daevanion Board | `system:ariel-daevanion-board` (+2 items) | 9 | Patch notes Oct. 20/21 | High (conversion caps, resource trade-off) |
| Substance Morph | `system:substance-morph` | 9 | Patch notes Oct. 6/7, 13/14, 20/21 | High (limits) |

Per the policy, High-severity claims need "current first-party or 2 corroborating verifiable sources". Every High claim here cites first-party Global patch notes. The reviewer should additionally confirm entry level, revive limit and the Substance Morph caps in the live client where possible.

## Ticket: guide:global-service-basics
- **Reader problem:** "Can I play, where, in what language, what does it cost, and does my KR/TW character transfer?"
- **Applicability:** Global service, all players; not patch-specific.
- **Evidence:** Launch FAQ (2026-09-30), NC press release (2026-10-06), Steam store page.
- **Risks / open:** membership price and feature list not stated in sources; server transfer rules intentionally left to official notices. Class names are derived from two official sources (count + class-restricted skins) — flagged in the fact context.

## Ticket: class:sorcerer
- **Reader problem:** "What is confirmed about the Sorcerer on Global right now?" (deliberately not "best build").
- **Applicability:** Global, patches up to Oct. 20/21.
- **Evidence:** class count (press release), class-restricted Spellbook skins and three skill fixes (patch notes).
- **Risks / open:** no official text class description, skill list, Specialty or Stigma data found. No build, rotation or stat priority is given; that needs firsthand in-game documentation (Phase 3+). "Specialty 1" is paraphrased as "the first Specialty".

## Ticket: dungeon:krao-cave / dungeon:draupnir
- **Reader problem:** "Can I enter Hard mode yet, and what does it give?"
- **Applicability:** Global, from the Oct. 20/21 update (live from 06:30 UTC 2026-10-21 per the maintenance notice).
- **Evidence:** Patch notes › Content & Systems › Expedition.
- **Risks / open:** Normal mode requirements, group size, entry limits, boss names, Frenzy behaviour, drop chances, which Ariel Fragment each awards. The Wrathful materials are stated "in the same section" without asserting they are Unique-grade.

## Ticket: system:ariel-daevanion-board
- **Reader problem:** "How do I earn Ariel points and should I convert fragments to Enhance Stones?"
- **Applicability:** Global, from Oct. 20/21.
- **Evidence:** Patch notes › Expedition and › Addition of New "Ariel" Daevanion Board.
- **Risks / open:** points per crystal, node effects, per-dungeon caps and resets. The page's only advice is a clearly labelled editorial note reasoning from the stated caps.

## Ticket: system:substance-morph
- **Reader problem:** "Which Substance Morph recipes and limits are confirmed?"
- **Applicability:** Global, Oct. 6/7 to Oct. 20/21 updates.
- **Evidence:** three patch notes.
- **Risks / open:** full recipe list, success chances, reset timing, end of server transfer period. **Source inconsistency:** the Oct. 6/7 note calls October 6, 2026 a Wednesday (it is a Tuesday), so that patch's go-live time is not recorded.

## Reviewer checklist (per page)
1. Run `npm run dev` and open `/review/` → the page.
2. For each row in "Facts & evidence", open the cited source and find the claim at the location given ("found in: …").
3. Confirm the Region is Global and the patch label matches the source.
4. Confirm nothing in the prose goes beyond its facts; editorial notes are labelled as such.
5. If a claim is wrong or unclear, edit or remove it (or mark the fact `disputed`) instead of approving.
6. Approve: `npm run content:approve -- <id> --reviewer "Your Name" --i-checked-the-sources`, then `npm run build`.

## Automated second pass — 2026-10-22 (not a human review)

After drafting, every cited source was re-fetched live and each fact was checked with a targeted text pattern (the claim's number or name next to its context, e.g. `Required item level for entry will be 2600`) against the sources the fact cites. This is a mechanical consistency check by the same AI that wrote the drafts. It **does not replace** the human review, but it means the reviewer should find every claim at the stated location.

**Result: 61/61 facts matched in a cited source; 0 need attention.** One pattern initially failed because the check itself used the wrong word order; the fact was correct and the pattern was fixed.

<details><summary>Per-fact results</summary>

| Result | Fact | Matched in |
|---|---|---|
| PASS | `fact:ariel-board-added` | source:patch-notes-2026-10-21 |
| PASS | `fact:ariel-crystal-cap` | source:patch-notes-2026-10-21 |
| PASS | `fact:ariel-crystal-cost` | source:patch-notes-2026-10-21 |
| PASS | `fact:ariel-crystal-menu` | source:patch-notes-2026-10-21 |
| PASS | `fact:ariel-enhance-cap` | source:patch-notes-2026-10-21 |
| PASS | `fact:ariel-enhance-menu` | source:patch-notes-2026-10-21 |
| PASS | `fact:ariel-enhance-yield` | source:patch-notes-2026-10-21 |
| PASS | `fact:ariel-per-dungeon-limit` | source:patch-notes-2026-10-21 |
| PASS | `fact:ariel-points-source` | source:patch-notes-2026-10-21 |
| PASS | `fact:bittercold-wind-effect` | source:patch-notes-2026-10-14 |
| PASS | `fact:bittercold-wind-fix-elevation` | source:patch-notes-2026-10-14 |
| PASS | `fact:cold-storm-effect` | source:patch-notes-2026-10-14, source:patch-notes-2026-10-21 |
| PASS | `fact:cold-storm-fix-elevation` | source:patch-notes-2026-10-14 |
| PASS | `fact:cold-storm-fix-level` | source:patch-notes-2026-10-21 |
| PASS | `fact:cold-storm-fix-overwrite` | source:patch-notes-2026-10-14 |
| PASS | `fact:cold-storm-fix-specialty` | source:patch-notes-2026-10-21 |
| PASS | `fact:cold-storm-fix-stacks` | source:patch-notes-2026-10-21 |
| PASS | `fact:draupnir-hard-achievements` | source:patch-notes-2026-10-21 |
| PASS | `fact:draupnir-hard-added` | source:patch-notes-2026-10-21 |
| PASS | `fact:draupnir-hard-ariel-fragment` | source:patch-notes-2026-10-21 |
| PASS | `fact:draupnir-hard-chance-rewards` | source:patch-notes-2026-10-21 |
| PASS | `fact:draupnir-hard-frenzy-timer` | source:patch-notes-2026-10-21 |
| PASS | `fact:draupnir-hard-guaranteed-choice` | source:patch-notes-2026-10-21 |
| PASS | `fact:draupnir-hard-item-level` | source:patch-notes-2026-10-21 |
| PASS | `fact:draupnir-hard-kina` | source:patch-notes-2026-10-21 |
| PASS | `fact:draupnir-hard-revives` | source:patch-notes-2026-10-21 |
| PASS | `fact:draupnir-hard-unique-materials` | source:patch-notes-2026-10-21 |
| PASS | `fact:fire-wall-effect` | source:patch-notes-2026-10-14, source:patch-notes-2026-10-21 |
| PASS | `fact:fire-wall-fix-elevation` | source:patch-notes-2026-10-14 |
| PASS | `fact:fire-wall-fix-non-embers` | source:patch-notes-2026-10-21 |
| PASS | `fact:fire-wall-fix-overwrite` | source:patch-notes-2026-10-14 |
| PASS | `fact:global-account-linking` | source:launch-faq |
| PASS | `fact:global-business-model` | source:launch-faq |
| PASS | `fact:global-class-count` | source:ncsoft-aion2-global-launch |
| PASS | `fact:global-class-names` | source:patch-notes-2026-10-14 |
| PASS | `fact:global-controller` | source:launch-faq |
| PASS | `fact:global-early-access-date` | source:ncsoft-aion2-global-launch |
| PASS | `fact:global-kr-tw-carryover` | source:launch-faq |
| PASS | `fact:global-launch-date` | source:aion2-steam-store, source:ncsoft-aion2-global-launch |
| PASS | `fact:global-official-support` | source:launch-faq |
| PASS | `fact:global-paid-offers` | source:launch-faq |
| PASS | `fact:global-platforms` | source:ncsoft-aion2-global-launch |
| PASS | `fact:global-server-regions` | source:launch-faq |
| PASS | `fact:global-steam-purple-same-content` | source:launch-faq |
| PASS | `fact:global-steam-purple-shared-servers` | source:launch-faq |
| PASS | `fact:global-ui-languages` | source:launch-faq |
| PASS | `fact:global-voice-languages` | source:launch-faq |
| PASS | `fact:krao-cave-hard-achievements` | source:patch-notes-2026-10-21 |
| PASS | `fact:krao-cave-hard-added` | source:patch-notes-2026-10-21 |
| PASS | `fact:krao-cave-hard-ariel-fragment` | source:patch-notes-2026-10-21 |
| PASS | `fact:krao-cave-hard-chance-rewards` | source:patch-notes-2026-10-21 |
| PASS | `fact:krao-cave-hard-frenzy-timer` | source:patch-notes-2026-10-21 |
| PASS | `fact:krao-cave-hard-guaranteed-choice` | source:patch-notes-2026-10-21 |
| PASS | `fact:krao-cave-hard-item-level` | source:patch-notes-2026-10-21 |
| PASS | `fact:krao-cave-hard-kina` | source:patch-notes-2026-10-21 |
| PASS | `fact:krao-cave-hard-revives` | source:patch-notes-2026-10-21 |
| PASS | `fact:krao-cave-hard-unique-materials` | source:patch-notes-2026-10-21 |
| PASS | `fact:sm-sealed-wings-limit` | source:patch-notes-2026-10-07 |
| PASS | `fact:sm-special-tabs` | source:patch-notes-2026-10-14, source:patch-notes-2026-10-21 |
| PASS | `fact:sm-transfer-period-items` | source:patch-notes-2026-10-14 |
| PASS | `fact:sorcerer-restricted-weapon-skin` | source:patch-notes-2026-10-14 |

</details>

## Ticket: the seven remaining classes (Assassin, Chanter, Cleric, Gladiator, Ranger, Spiritmaster, Templar)
- **Reader problem:** "What is confirmed about this class on Global?"
- **Evidence (official only):** NC's one-line class descriptions in the Classes carousel of the official teaser site (rendered as images; read visually and paraphrased), class-restricted Halloween Night weapon skins in the Oct. 13/14 patch notes, official class videos (viewing links only), Chanter Spinning Strike fix (Oct. 20/21) and Spiritmaster Summon: Ancient Spirit fix (Oct. 13/14). Automated check: 9/9 patch-note facts matched; 7 descriptions checked visually.
- **Sources evaluated and not used:** aion2.gg (robots/terms forbid bulk copying and dataset building), aion2.gaming.tools (blocks automated access; bypassing is out of policy), aion2hub.com (no terms page; data from the pre-launch Launch Scale Test client plus KR/TW client data, including a KR/TW-only class).
- **Open:** party roles in NC's own words, full skill lists, Specialties, Stigmas, builds — need firsthand in-game evidence.
- **Human review:** all seven approved by jmbonganay on 2026-10-22.

## Ticket: six pages from remaining official sources (server transfers, servers & matchmaking, story, Urugugu Canyon, Fire Temple, Pets)
- **Evidence:** Server Transfer Q&A, Server Transfer Products Info, Advance Notice of Server Transfer Limits, New Server and Matchmaking Information (official notices); the official teaser site's Lore, Expedition, Factions and Pet sections (text in images, read visually and paraphrased); the NC press release (setting).
- **Checks:** 29/29 text-sourced facts matched automatically; image-sourced facts checked visually. One draft error caught and fixed before review: an Asmodian region name had been guessed from a cut-off panel ("Beluslan"); re-captured at full width, the official spelling is "Belluslan".
- **Time-sensitive:** the server transfer guide describes the period ending at the Oct. 27 (PDT) / Oct. 28 (CET) maintenance.
- **Follow-up done:** boss names and descriptions for Krao Cave (Ultimate Berk) and Draupnir (Transcendent Bakarma), plus each dungeon's official setting, added and re-approved by jmbonganay on 2026-10-22.
- **Human review:** all six approved by jmbonganay on 2026-10-22.
