import { z } from 'zod';

/**
 * Runtime content schemas (docs/05-CONTENT-SCHEMAS.md).
 *
 * These are the single source of truth for content shape. Types are inferred
 * from them so TypeScript and build-time validation can never drift apart.
 * Schema validity is NOT the same as publishability: see `publication.ts`
 * for the evidence gate that decides what becomes a public page.
 */

export const REGIONS = ['global', 'kr', 'tw'] as const;
export const PUBLICATION_STATUSES = ['draft', 'in_review', 'published', 'stale', 'archived'] as const;
export const EVIDENCE_GRADES = ['official', 'firsthand', 'independent', 'community'] as const;
export const FACT_VERIFICATION = ['confirmed', 'reported', 'disputed'] as const;
export const FACTIONS = ['elyos', 'asmodian', 'both', 'unknown'] as const;
export const MODES = ['pve', 'pvp', 'both'] as const;
export const GUIDE_CATEGORIES = ['class', 'system', 'dungeon', 'farming', 'gear', 'general'] as const;
export const ITEM_TYPES = ['material', 'consumable', 'currency', 'equipment', 'cosmetic', 'other'] as const;

/** Kinds that have their own page and URL. */
export const ROUTABLE_KINDS = ['guide', 'class', 'dungeon', 'system'] as const;
/** Kinds displayed inside other pages (skills on class pages, items in item panels). */
export const EMBEDDED_KINDS = ['skill', 'item'] as const;
export const ENTITY_KINDS = [...ROUTABLE_KINDS, ...EMBEDDED_KINDS] as const;
export type EntityKind = (typeof ENTITY_KINDS)[number];
export type RoutableKind = (typeof ROUTABLE_KINDS)[number];

export const regionSchema = z.enum(REGIONS);
export const publicationSchema = z.enum(PUBLICATION_STATUSES);
export const evidenceGradeSchema = z.enum(EVIDENCE_GRADES);
export const modeSchema = z.enum(MODES);

/** Lowercase ASCII kebab-case. Never derived from display names at runtime. */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase ASCII kebab-case');

/** UTC ISO 8601 timestamp ending in `Z`, e.g. `2026-10-22T00:00:00Z`. */
export const isoUtcSchema = z.iso.datetime({ offset: false, message: 'must be a UTC ISO 8601 timestamp ending in Z' });

/** A calendar date as printed by a source (`YYYY-MM-DD`), or a full UTC timestamp when the time is known. */
export const sourceDateSchema = z.union([z.iso.date(), isoUtcSchema]);

export const httpsUrlSchema = z.url({ protocol: /^https$/, message: 'must be an absolute https:// URL' });

/** Namespaced durable ID, e.g. `guide:sorcerer-pve`. */
const namespacedId = (namespace: string) =>
  z
    .string()
    .regex(
      new RegExp(`^${namespace}:[a-z0-9]+(?:-[a-z0-9]+)*$`),
      `id must look like "${namespace}:kebab-case-slug"`,
    );

/** Any namespaced reference to a known record kind. */
export const recordRefSchema = z
  .string()
  .regex(/^(guide|class|dungeon|system|item|skill|resource|pet|arcana|patch):[a-z0-9]+(?:-[a-z0-9]+)*$/, 'invalid record reference');

/**
 * Design fixtures are explicit, non-public sample records used to review
 * layouts. They must live in `src/content/fixtures/` and can never be published.
 */
const designFixtureField = z.literal(true).optional();

/* ------------------------------------------------------------------ */
/* Sources, facts & patches                                            */
/* ------------------------------------------------------------------ */

export const sourceSchema = z.strictObject({
  id: namespacedId('source'),
  /** Optional code from docs/13-SOURCE-REGISTER.md, e.g. `SRC-001`. */
  registerCode: z.string().regex(/^[A-Z]+-\d{3}$/).optional(),
  title: z.string().min(1),
  url: httpsUrlSchema,
  publisher: z.string().min(1),
  grade: evidenceGradeSchema,
  region: z.enum([...REGIONS, 'unspecified']),
  /** Publication date exactly as precise as the source states it. */
  publishedAt: sourceDateSchema.nullable().optional(),
  retrievedAt: isoUtcSchema,
  /** What this source may be used for. Presence never verifies a specific claim. */
  scope: z.string().min(1),
  notes: z.string().optional(),
  license: z.string().nullable().optional(),
  designFixture: designFixtureField,
});
export type Source = z.infer<typeof sourceSchema>;

const factValueSchema = z.union([z.string().min(1), z.number(), z.boolean(), z.array(z.string().min(1)).min(1)]);

export const factSchema = z.strictObject({
  id: namespacedId('fact'),
  subjectId: recordRefSchema,
  property: z.string().regex(/^[a-z][A-Za-z0-9]*$/, 'property must be camelCase'),
  value: factValueSchema,
  unit: z.string().min(1).optional(),
  region: regionSchema,
  faction: z.enum(FACTIONS).optional(),
  /** Patch label exactly as the source writes it. `null` when unknown — never guessed. */
  effectivePatch: z.string().min(1).nullable().optional(),
  sourceIds: z.array(namespacedId('source')).min(1, 'a fact needs at least one source'),
  /** Where in the source the claim appears, in the author's own words (section, table, line). */
  evidence: z.string().min(1).max(400),
  /** Who extracted the claim from the source, and when. */
  capturedBy: z.string().min(1),
  capturedAt: isoUtcSchema,
  verification: z.enum(FACT_VERIFICATION),
  /** Set only by a human reviewer who re-checked the claim against the source. */
  verifiedBy: z.string().min(1).nullable().default(null),
  lastVerifiedAt: isoUtcSchema.nullable().default(null),
  /** Reader-facing context, required for `reported` claims. */
  context: z.string().min(1).optional(),
  designFixture: designFixtureField,
});
export type Fact = z.infer<typeof factSchema>;

/** A game update, used for currentness checks and patch history. */
export const patchSchema = z.strictObject({
  id: namespacedId('patch'),
  title: z.string().min(1),
  region: regionSchema,
  sourceId: namespacedId('source'),
  /** Label as written by the source, e.g. `Oct. 20 (PDT) / Oct. 21 (CEST)`. */
  label: z.string().min(1),
  /** When the change went live (start of maintenance), if the source states it. */
  effectiveAt: isoUtcSchema.nullable(),
  /** Records whose claims this patch changed. They need re-verification after `effectiveAt`. */
  changedIds: z.array(recordRefSchema).default([]),
  summary: z.string().min(1).max(400),
});
export type Patch = z.infer<typeof patchSchema>;

/* ------------------------------------------------------------------ */
/* Records                                                             */
/* ------------------------------------------------------------------ */

const recordBase = {
  slug: slugSchema,
  summary: z.string().min(1).max(320),
  region: regionSchema,
  status: publicationSchema,
  aliases: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),
  /** Patch label from a source, or `null` when unknown. Never a guessed version. */
  patch: z.string().min(1).nullable().default(null),
  author: z.string().min(1),
  reviewedBy: z.string().min(1).nullable().default(null),
  createdAt: isoUtcSchema,
  /** Last editorial change. Kept separate from `lastVerifiedAt` on purpose. */
  updatedAt: isoUtcSchema,
  /** Last time a responsible human editor re-checked the evidence. */
  lastVerifiedAt: isoUtcSchema.nullable().default(null),
  sourceIds: z.array(namespacedId('source')).default([]),
  factIds: z.array(namespacedId('fact')).default([]),
  relatedIds: z.array(recordRefSchema).default([]),
  /**
   * Time-limited content (events, passes, transfer periods). From this moment
   * the record fails the publication gate and drops out of the next build.
   */
  expiresAt: isoUtcSchema.nullable().default(null),
  /** Open questions the author could not resolve from sources. Shown to readers. */
  unverified: z.array(z.string().min(1)).default([]),
  designFixture: designFixtureField,
};

export const guideMetaSchema = z.strictObject({
  ...recordBase,
  id: namespacedId('guide'),
  title: z.string().min(1).max(120),
  category: z.enum(GUIDE_CATEGORIES),
  mode: modeSchema.optional(),
  classId: namespacedId('class').optional(),
  /** Human-readable applicability gates, e.g. who the guide is for. */
  applicability: z.string().min(1).optional(),
});
export type GuideMeta = z.infer<typeof guideMetaSchema>;

export const classSchema = z.strictObject({
  ...recordBase,
  id: namespacedId('class'),
  name: z.string().min(1).max(80),
  modes: z.array(z.enum(['pve', 'pvp'])).default([]),
});
export type ClassRecord = z.infer<typeof classSchema>;

export const dungeonSchema = z.strictObject({
  ...recordBase,
  id: namespacedId('dungeon'),
  name: z.string().min(1).max(80),
  /** Instance category label as written in a cited Global source. */
  category: z.string().min(1).max(60),
});
export type DungeonRecord = z.infer<typeof dungeonSchema>;

export const systemSchema = z.strictObject({
  ...recordBase,
  id: namespacedId('system'),
  name: z.string().min(1).max(80),
});
export type SystemRecord = z.infer<typeof systemSchema>;

export const skillSchema = z.strictObject({
  ...recordBase,
  id: namespacedId('skill'),
  name: z.string().min(1).max(80),
  classId: namespacedId('class'),
});
export type SkillRecord = z.infer<typeof skillSchema>;

export const itemSchema = z.strictObject({
  ...recordBase,
  id: namespacedId('item'),
  /** Canonical Global in-game name, including suffixes such as "(Bound)". */
  name: z.string().min(1).max(100),
  itemType: z.enum(ITEM_TYPES),
  /** `null` = not stated by a source. Never assumed. */
  bound: z.boolean().nullable().default(null),
  rarity: z.string().min(1).nullable().default(null),
  slot: z.string().min(1).nullable().default(null),
});
export type ItemRecord = z.infer<typeof itemSchema>;

export const recordSchemas = {
  guide: guideMetaSchema,
  class: classSchema,
  dungeon: dungeonSchema,
  system: systemSchema,
  skill: skillSchema,
  item: itemSchema,
} as const;

/** Every record may carry an MDX body (guides inline; others in `<slug>.mdx`). */
type WithBody = { body: string };

export type Guide = GuideMeta & WithBody & { kind: 'guide' };

export type ContentRecord =
  | Guide
  | (ClassRecord & WithBody & { kind: 'class' })
  | (DungeonRecord & WithBody & { kind: 'dungeon' })
  | (SystemRecord & WithBody & { kind: 'system' })
  | (SkillRecord & WithBody & { kind: 'skill' })
  | (ItemRecord & WithBody & { kind: 'item' });

export type RecordOfKind<K extends EntityKind> = Extract<ContentRecord, { kind: K }>;

export function isRoutable(record: ContentRecord): record is RecordOfKind<RoutableKind> {
  return (ROUTABLE_KINDS as readonly string[]).includes(record.kind);
}

/** Display label for any record. */
export function recordTitle(record: ContentRecord): string {
  return record.kind === 'guide' ? record.title : record.name;
}
