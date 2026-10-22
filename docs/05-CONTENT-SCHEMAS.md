# 05 — Content & Evidence Data Model

## Principle
Guides are editorial MDX; machine-like facts are structured JSON/TypeScript with independently referenced evidence. Do not scatter stats or dungeon thresholds in prose and in multiple components without a common record.

## Keys & identifiers
- `slug`: lowercase ASCII kebab-case, stable; never derive from display name at runtime.
- `id`: durable namespaced ID (`guide:sorcerer-pve`, `item:example`) independent of text label.
- `region`: `global | kr | tw` (MVP publishes `global` only).
- `faction`: `elyos | asmodian | both | unknown`; never assume.
- `patch`: recorded as a verified string from a source. If unknown, use `null`, NOT guessed version numbers.
- UTC ISO 8601 timestamp for `updatedAt`, `lastVerifiedAt`, `retrievedAt`.
- `status`: `draft | in_review | published | stale | archived`.

## Recommended TypeScript interfaces (illustrative, refine in code)
```ts
type Region = 'global' | 'kr' | 'tw';
type Publication = 'draft' | 'in_review' | 'published' | 'stale' | 'archived';
type EvidenceGrade = 'official' | 'firsthand' | 'independent' | 'community';

type Source = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  grade: EvidenceGrade;
  region: Region | 'unspecified';
  publishedAt?: string | null;
  retrievedAt: string;
  notes?: string;
  license?: string | null;
};

type Fact = {
  id: string;
  subjectId: string;
  property: string; // e.g. `entryGearScore`, `dropSource`, `skillDescription`
  value: string | number | boolean | string[];
  unit?: string;
  region: Region;
  faction?: 'elyos' | 'asmodian' | 'both' | 'unknown';
  effectivePatch?: string | null;
  lastVerifiedAt: string;
  sourceIds: string[];
  verification: 'confirmed' | 'reported' | 'disputed';
  verifiedBy?: string;
};

type GuideMeta = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  region: Region;
  mode?: 'pve' | 'pvp' | 'both';
  classId?: string;
  applicability?: string; // human-readable gates
  patch?: string | null;
  status: Publication;
  author: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  lastVerifiedAt?: string;
  sourceIds: string[];
  relatedIds: string[];
  factIds: string[];
};
```

## Content records to implement
| Entity | Must include | Optional (only if sourced) |
|---|---|---|
| Class | id, name, region, status | role, weapon type, skills, modes |
| Item | id, name, slot, rarity, region, status | item level, stats, sources, trade flags |
| Dungeon | id, name, category, region, status | difficulty, requirements, bosses, rewards |
| Skill/Stigma | id, name, classId, region, status | levels, specialties, costs, cooldowns |
| Resource | id, name, region, status | drop sources, recipes, currencies, limits |
| Pet | id, name, genus, region, status | spawn points, soul count, bonuses |
| Arcana | id, slot, region, status | grades, effect, set, dungeon sources |
| Patch | id, date, region, URL, summary | changed-entity IDs |
| Guide | metadata, MDX body, source IDs | tables, alternatives, route references |

## Example **unpublished** item JSON (example values are invented schema fixtures)
```json
{
  "id": "item:example-sword-fixture",
  "name": "DEMO ITEM — DO NOT PUBLISH",
  "slug": "example-sword-fixture",
  "region": "global",
  "rarity": "demo",
  "slot": "weapon",
  "status": "draft",
  "stats": [],
  "sourceIds": [],
  "lastVerifiedAt": null
}
```
**Never allow examples, demo fixtures, or placeholder facts in public selectors or search.**

## Validation must enforce
- Unique IDs/slugs; approved enums; ISO dates; source URLs using https; no cross-region reference without explicit applicability.
- Published record requires `lastVerifiedAt`, `reviewedBy`, a non-empty `sourceIds` list and working source registry references.
- Numerical or actionable claim has a Fact record with >=1 source; if community-only and high-impact (e.g., paid conversion, guaranteed drops), hold for review.
- Every related ID exists and is published (or relation intentionally hidden).
- Ingredient item IDs/quantities nonnegative; drop rates 0–100 only if documented; clarify percentages vs probabilities.
- Data consistency: no simultaneous conflicting entry requirements within the same region, patch, dungeon and difficulty.
- Content aliases searchable but canonical names displayed; content is not published if marked `stale`.
- Patch change record triggers review list for affected claims; content invalidated on explicit contradiction.

## Frontmatter example — unverified template only
```yaml
---
id: guide:sorcerer-pve
slug: sorcerer-pve
region: global
mode: pve
classId: sorcerer
status: draft
title: Sorcerer PvE Build
summary: Source-backed Sorcerer progression and skill recommendations.
patch: null
author: editorial
reviewedBy: null
createdAt: '2026-10-22T00:00:00Z'
updatedAt: '2026-10-22T00:00:00Z'
lastVerifiedAt: null
sourceIds: []
factIds: []
relatedIds: []
---
```

## Display rules
- A `confirmed` claim displays with proper source; `reported` claims visibly say 'reported' and their context; `disputed` blocked from definitive recommendation.
- Format dates for reader timezone optionally but store UTC. Default 'Verified YYYY-MM-DD'.
- Avoid 'Updated today' when only text or style changed; show both Updated and Last verified.
- Preserve retired records in Git; historic patch page may show archival info clearly, excluded from 'current best' search by default.

## Editorial examples
Incorrect: 'Superior Manastones drop 0.5% from X.' if source not inspected.  
Correct: 'Current source unverified; no drop rate published.' (draft), or cite precisely confirmed value and version.
