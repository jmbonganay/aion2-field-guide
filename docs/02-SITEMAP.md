# 02 — Information Architecture & Sitemap

## Navigation
Desktop: logo/brand + Search + Classes + Gear + Dungeons + Systems + Guides + Updates. Utility: About / Sources. Mobile: accessible navigation drawer and search trigger. Breadcrumbs for detail pages.

## Planned routes
```text
/
/classes/
/classes/[slug]/                 (only published classes)
/classes/[slug]/builds/[slug]/    (later once verified)
/guides/
/guides/[slug]/
/gear/
/gear/[slug]/                  (item detail when verified)
/dungeons/
/dungeons/[slug]/
/systems/
/systems/[slug]/             (Arcana, Daevanion, pets, etc.)
/farming/                    (curated guides and resource index)
/updates/                    (manually reviewed patch summaries)
/updates/[slug]/
/sources/
/about/
/disclaimer/
/privacy/
/not-found                   (actual 404 rendered by Next.js)
```

All `[slug]` routes require known static params; unpublished records produce no generated path. Avoid dynamic query-param-only pages for SEO. Avoid empty categories and 404 masquerading as success.

## Category taxonomy
- Classes: Sorcerer, then all other Global classes after verification. Modes: PvE, PvP, leveling; stage: beginner/midgame/endgame.
- Gear: weapon/Guard/armor/accessory; rarity; acquisition source; faction applicability if any.
- Dungeons: Expedition, Transcendence, Ascension Trial, Daily, other verified instance types.
- Systems: Arcana, Daevanion, Stigmas, Manastones/Soulstones, Pets/Genus, Enhancement/Gear Transfer, Alchemy/Crafting, Abyss, Title/Pantheon.
- Farming: Kina, Odyle Energy, Enhance Stones, Stigma Shards, Daevanion Crystals, Pet Souls, Theostones, specific items.
- Updates: release notes, changed recommendations, archived historical guides.

## Search behavior
- Search content types with type labels and breadcrumbs.
- Rank exact title and aliases > keywords > excerpt.
- Support empty query, special characters, typo tolerance only if tested.
- Do not show draft/unverified/archived content in regular search.
- If no matches, propose category navigation. Never fabricate matching 'guides'.

## User journeys
1. **Leveling:** Home -> Beginner -> Progression -> next eligible dungeon; links to prerequisites.
2. **Sorcerer build:** Classes -> Sorcerer -> PvE -> skills/gear/stigmas; links to source lists.
3. **Material hunting:** Search 'Intermediate Manastone' -> source guide -> dungeon/crafting alternatives.
4. **Patch confusion:** Updates -> affected systems -> updated guide with change log.

## Linking rules
- Every resource described as obtainable links to a verified item or source page where one exists.
- Show named alternatives where data is confirmed.
- Crosslink without circular explanation; a guide should answer main question without requiring five other pages.
- Missing source? Show 'Verification pending' in drafts only, not on public numeric statements.

## Page hierarchy patterns
Index: headline -> search/filters -> featured verified content -> list.  
Detail: breadcrumb -> title -> application badges -> concise answer -> table of contents -> recommendations -> how-to -> warnings/alternatives -> sources -> related guides -> reviewed date.
