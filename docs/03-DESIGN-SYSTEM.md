# 03 — Premium UI/UX Design System

## Design brief
Premium editorial fantasy wiki, NOT a direct copy of AION 2 interfaces or third-party guide sites. Distinctive and original. Quiet detail, readable text, clean hierarchy, sparse visual embellishment. Avoid generic AI-looking glowing dashboard overload.

## Creative direction
- Mood: midnight-blue stone, aged parchment undertones, bronze/gold highlights, soft aura accent (restrained).
- Layout: modern editorial grid with dedicated content reading area; utility side-rail on desktop, collapse on mobile.
- Brand: original text logo/abstract wing/constellation motif; no official trademarks/logos presented as owned identity.
- Hero: SVG/CSS original shapes and gradients, NOT unlicensed game art.

## Token suggestions (adjust for validated contrast)
```css
:root {
  --bg: #0B1019;
  --surface: #121A27;
  --surface-raised: #192436;
  --border: #344155;
  --text: #F4F0E7;
  --text-muted: #BAC4D2;
  --accent: #D8B87A;
  --accent-strong: #EBD29D;
  --focus: #8CD7F5;
  --danger: #F2A6A0;
  --success: #99D5BA;
}
```
Use CSS variables for all design tokens. Rarity color must include text/icon label, never color only. Avoid low-contrast gold-on-sand labels.

## Typography
- Display: elegant, accessible serif or sharp humanist heading type, legally distributable; body: readable system sans (fallback stack) to avoid font licensing/download costs.
- Body: 16–18px, line-height 1.55–1.75, paragraph max line length 65–75ch.
- Editorial display headings 32–52px responsive; H2 25–32px; H3 19–24px; small text >= 12px where possible.
- Technical stats use tabular numerals; avoid tiny dense item-data tables.

## Layout tokens
- Spacing: 4px baseline; preferred 8/12/16/24/32/48/64.
- Radius: 8px controls, 12px cards, 16px hero blocks.
- Responsive: 320–599 small, 600–899 medium, 900–1199 desktop, 1200+ wide.
- Max site width 1440px; max article text width 760–800px; sidebar 220–260px.
- Sticky header only if useful; no invasive overlays or horizontal overflow.

## Reusable components
`AppHeader`, `MobileMenu`, `SearchDialog`, `Breadcrumbs`, `PageHero`, `SectionHeading`, `GuideCard`, `ClassCard`, `DungeonCard`, `ItemCard`, `RarityTag`, `ModeTag`, `RegionTag`, `PatchMeta`, `EvidenceBadge`, `SourceList`, `RelatedGuides`, `ComparisonTable`, `ResponsiveTable`, `Callout`, `StepList`, `Tabs`, `TOC`, `EmptyState`, `Skeleton`, `Pagination` (only if needed), `StatPill`, `Tooltip`.

## Required page compositions
1. Home: subtle original graphic hero, primary global search, category entry cards, featured VERIFIED guides, latest reviewed changes.
2. Class: class identity, recommended modes, 'what to prioritize', expandable rotation, skill synergies, citations, gear progression.
3. Guide: clear answer summary at top, related sources beside useful steps, readable numbered instructions.
4. Dungeon: entry overview, rewards with source badges, mechanics cards, damage-role considerations.
5. Sources: explain how game facts are researched; transparently differentiate official, hands-on, community.

## Interaction details
- Hover/focus both visible; 44px touch target recommended.
- Search hotkey `/` may open command palette; Escape closes; focus returns to opener.
- Keyboard arrows only where standard listbox pattern implemented correctly.
- If browser-local checklist exists, label explicitly 'saved on this device'; no server sync.
- Respect `prefers-reduced-motion` and do not animate critical UI.
- Always include meaningful loading/empty/error states; avoid fabricated 'top rankings' or hard-coded visitor counts.

## Visual QA rubric
- Pages feel bespoke and coherent, not template-driven.
- Headings establish scan path and article widths remain readable.
- Number-heavy pages are compact but accessible.
- Icons consistent stroke/size; avoid dozens of colored badges.
- Real content drives composition. No polished mockup based on made-up game stats.
