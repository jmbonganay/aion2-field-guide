import { indexBundle, type ContentBundle } from './bundle';
import { hrefFor, RECORD_PATH, recordPathOf } from './links';
import { loadContentTree, type LoadResult } from './load-content';
import { isPublic, selectAllPublished, selectPublished } from './publication';
import { isRoutable, type ContentRecord, type EntityKind, type Fact, type Patch, type RecordOfKind, type RoutableKind, type Source } from './schemas';

/**
 * Public content API for pages (build time only). Every function here goes
 * through the publication gate; drafts, fixtures and stale records are
 * unreachable from routes, search and the sitemap.
 */

let cache: LoadResult | null = null;

function load(): LoadResult {
  // Re-read on every call in development so edits show up without a restart.
  if (!cache || process.env.NODE_ENV !== 'production') cache = loadContentTree();
  return cache;
}

export function getBundle(): ContentBundle {
  return load().bundle;
}

export function getPublished<K extends EntityKind>(kind: K): RecordOfKind<K>[] {
  return selectPublished(getBundle(), kind);
}

export function getPublishedBySlug<K extends EntityKind>(kind: K, slug: string): RecordOfKind<K> | null {
  return getPublished(kind).find((r) => r.slug === slug) ?? null;
}

export function getAllPublished(): ContentRecord[] {
  return selectAllPublished(getBundle());
}

/** The public source registry (fixtures excluded), sorted by register code then title. */
export function getRegistrySources(): Source[] {
  return getBundle()
    .sources.filter((s) => !s.designFixture)
    .sort((a, b) => (a.registerCode ?? 'ZZZ').localeCompare(b.registerCode ?? 'ZZZ') || a.title.localeCompare(b.title));
}

export type RecordEvidence = {
  sources: Source[];
  facts: Fact[];
  related: RecordOfKind<RoutableKind>[];
  skills: RecordOfKind<'skill'>[];
  items: RecordOfKind<'item'>[];
  patches: Patch[];
};

/**
 * Resolve a record's sources, facts, related records, skills (for classes),
 * items and patch history. Only *public* related records/skills/items are
 * returned unless `includeUnpublished` is set (dev-only review preview).
 */
export function resolveEvidence(
  record: ContentRecord,
  bundle: ContentBundle = getBundle(),
  options: { includeUnpublished?: boolean } = {},
): RecordEvidence {
  const index = indexBundle(bundle);
  const visible = (r: ContentRecord) => options.includeUnpublished || isPublic(r, bundle, { index });

  const skills = bundle.records
    .filter((r): r is RecordOfKind<'skill'> => r.kind === 'skill' && record.kind === 'class' && r.classId === record.id)
    .filter(visible)
    .sort((a, b) => a.name.localeCompare(b.name));
  const linked = record.relatedIds.map((id) => index.records.get(id)).filter((r): r is ContentRecord => Boolean(r) && visible(r as ContentRecord));
  const items = linked.filter((r): r is RecordOfKind<'item'> => r.kind === 'item');
  const related = linked.filter(isRoutable);

  // Facts and sources: the record's own, plus those of the skills/items shown on the page.
  const embedded = [...skills, ...items];
  const factIds = [...new Set([...record.factIds, ...embedded.flatMap((r) => r.factIds)])];
  const facts = factIds.map((id) => index.facts.get(id)).filter((f): f is Fact => Boolean(f));
  const sourceIds = new Set([...record.sourceIds, ...embedded.flatMap((r) => r.sourceIds), ...facts.flatMap((f) => f.sourceIds)]);
  const sources = [...sourceIds].map((id) => index.sources.get(id)).filter((s): s is Source => Boolean(s));

  const subjects = new Set([record.id, ...embedded.map((r) => r.id)]);
  const patches = bundle.patches
    .filter((p) => p.changedIds.some((id) => subjects.has(id)))
    .sort((a, b) => (b.effectiveAt ?? '').localeCompare(a.effectiveAt ?? ''));

  return { sources, facts, related, skills, items, patches };
}

export type PublicUpdate = { patch: Patch; source: Source | null; affected: RecordOfKind<RoutableKind>[] };

/**
 * Official updates shown on /updates/. A patch is listed only when at least
 * one *published* page is affected by it — its summary was then reviewed as
 * part of that page's patch history. Skills point to their class page.
 */
export function publicUpdates(bundle: ContentBundle = getBundle(), options: { now?: Date } = {}): PublicUpdate[] {
  const index = indexBundle(bundle);
  const published = new Map(selectAllPublished(bundle, options).map((r) => [r.id, r]));
  return bundle.patches
    .map((patch) => {
      const affected = new Map<string, RecordOfKind<RoutableKind>>();
      for (const id of patch.changedIds) {
        const record = published.get(id);
        if (!record) continue;
        if (isRoutable(record)) affected.set(record.id, record);
        else if (record.kind === 'skill') {
          const cls = published.get(record.classId);
          if (cls && isRoutable(cls)) affected.set(cls.id, cls);
        }
      }
      return { patch, source: index.sources.get(patch.sourceId) ?? null, affected: [...affected.values()] };
    })
    .filter((u) => u.affected.length > 0 && u.patch.region === 'global')
    .sort((a, b) => (b.patch.effectiveAt ?? b.source?.publishedAt ?? '').localeCompare(a.patch.effectiveAt ?? a.source?.publishedAt ?? ''));
}

/**
 * Whether an internal path will exist in the export. Record pages exist only
 * when published; every other internal path is a static page.
 */
export function makeIsLinkable(bundle: ContentBundle = getBundle()): (path: string) => boolean {
  const published = new Set(selectAllPublished(bundle).filter(isRoutable).map(hrefFor));
  return (path) => !RECORD_PATH.test(path) || published.has(recordPathOf(path));
}
