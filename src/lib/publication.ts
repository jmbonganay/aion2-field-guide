import { indexBundle, type BundleIndex, type ContentBundle } from './bundle';
import { extractCiteRefs, extractFactRefs, extractFactUsages, uncitedNumbers } from './mdx-analysis';
import { isRoutable, type ContentRecord, type EntityKind, type Patch, type RecordOfKind, type RoutableKind } from './schemas';

/**
 * The publication gate (docs/06-ACCURACY-POLICY.md, ADR-006).
 *
 * A record is public only when EVERY rule below passes. Type-level status is
 * not sufficient: this runs at build time for every selector, so a record
 * that slips past CI validation still cannot become a page, a search result
 * or a sitemap entry.
 */

/** MVP publishes Global-only content (ADR-002). */
export const PUBLIC_REGIONS = new Set(['global']);

/** Strings that must never appear in public content. */
export const BLOCKED_TEXT = /\b(TODO|TBD|FIXME|lorem ipsum|RESEARCH REQUIRED|DO NOT PUBLISH|DESIGN FIXTURE|PLACEHOLDER)\b/i;

export function blockedTextIn(record: ContentRecord): string | null {
  const haystack = [
    record.kind === 'guide' ? record.title : record.name,
    record.summary,
    ...record.aliases,
    ...record.tags,
    ...record.unverified,
    record.kind === 'guide' ? (record.applicability ?? '') : '',
    record.body,
  ].join('\n');
  const match = haystack.match(BLOCKED_TEXT);
  return match ? match[0] : null;
}

/** Problems inside a record's MDX body. Shared by the gate and draft validation. */
export function bodyProblems(record: ContentRecord): string[] {
  const problems: string[] = [];
  for (const id of extractFactRefs(record.body)) {
    if (!record.factIds.includes(id)) problems.push(`body cites <Fact id="${id}"> which is not listed in factIds`);
  }
  for (const id of extractCiteRefs(record.body)) {
    if (!record.sourceIds.includes(id)) problems.push(`body cites <Cite id="${id}"> which is not listed in sourceIds`);
  }
  const numbers = uncitedNumbers(record.body);
  if (numbers.length) problems.push(`body contains numbers not backed by a <Fact>: ${[...new Set(numbers)].slice(0, 6).join(', ')}`);
  return problems;
}

/**
 * A `<Fact label="…">` may reword a value for prose, but any number in the
 * label must also appear in the fact's own value.
 */
export function factLabelProblems(record: ContentRecord, index: BundleIndex): string[] {
  const problems: string[] = [];
  for (const { id, label } of extractFactUsages(record.body)) {
    const fact = index.facts.get(id);
    if (!fact || !label) continue;
    const valueText = (Array.isArray(fact.value) ? fact.value.join(' ') : String(fact.value)).replace(/,/g, '');
    const valueNumbers = new Set(valueText.match(/\d+(?:\.\d+)?/g) ?? []);
    for (const n of (label.replace(/,/g, '').match(/\d+(?:\.\d+)?/g) ?? [])) {
      if (!valueNumbers.has(n)) problems.push(`<Fact id="${id}"> label "${label}" shows ${n}, which is not in the fact's value`);
    }
  }
  return problems;
}

/** Patches that changed this record (or a fact subject it relies on) after it was last verified. */
export function patchesSinceVerification(record: ContentRecord, bundle: ContentBundle, index: BundleIndex = indexBundle(bundle)): Patch[] {
  // Never-verified records already fail on `missing lastVerifiedAt`.
  if (!record.lastVerifiedAt) return [];
  const verified = Date.parse(record.lastVerifiedAt);
  const subjects = new Set([record.id, ...record.factIds.map((id) => index.facts.get(id)?.subjectId).filter(Boolean)]);
  return bundle.patches.filter(
    (p) => p.region === record.region && p.effectiveAt && Date.parse(p.effectiveAt) > verified && p.changedIds.some((id) => subjects.has(id)),
  );
}

/**
 * Returns the reasons a record fails the publication gate. An empty array
 * means the record may be published.
 */
export function publicationGateFailures(
  record: ContentRecord,
  bundle: ContentBundle,
  options: { now?: Date; index?: BundleIndex } = {},
): string[] {
  const now = options.now ?? new Date();
  const index = options.index ?? indexBundle(bundle);
  const failures: string[] = [];

  if (record.status !== 'published') failures.push(`status is "${record.status}", not "published"`);
  if (record.designFixture) failures.push('record is a design fixture');
  if (!PUBLIC_REGIONS.has(record.region)) failures.push(`region "${record.region}" is not publishable in the MVP (Global only)`);

  if (!record.reviewedBy) failures.push('missing reviewedBy');
  else if (record.reviewedBy.trim().toLowerCase() === record.author.trim().toLowerCase())
    failures.push('reviewedBy must be a different person than author');

  if (!record.lastVerifiedAt) {
    failures.push('missing lastVerifiedAt');
  } else {
    const verified = Date.parse(record.lastVerifiedAt);
    if (verified > now.getTime()) failures.push('lastVerifiedAt is in the future');
    if (verified < Date.parse(record.createdAt)) failures.push('lastVerifiedAt is before createdAt');
  }
  if (Date.parse(record.updatedAt) < Date.parse(record.createdAt)) failures.push('updatedAt is before createdAt');
  if (record.expiresAt && Date.parse(record.expiresAt) <= now.getTime()) failures.push(`expired at ${record.expiresAt} (time-limited content)`);

  if (record.sourceIds.length === 0) failures.push('sourceIds is empty');
  for (const sourceId of record.sourceIds) {
    const source = index.sources.get(sourceId);
    if (!source) failures.push(`unknown source "${sourceId}"`);
    else if (source.designFixture) failures.push(`source "${sourceId}" is a design fixture`);
  }

  for (const factId of record.factIds) {
    const fact = index.facts.get(factId);
    if (!fact) {
      failures.push(`unknown fact "${factId}"`);
      continue;
    }
    if (fact.designFixture) failures.push(`fact "${factId}" is a design fixture`);
    if (fact.verification === 'disputed') failures.push(`fact "${factId}" is disputed and cannot back published content`);
    if (fact.region !== record.region) failures.push(`fact "${factId}" region "${fact.region}" differs from record region "${record.region}"`);
    if (!fact.verifiedBy || !fact.lastVerifiedAt) failures.push(`fact "${factId}" has not been verified by a reviewer`);
    else {
      if (fact.verifiedBy.trim().toLowerCase() === fact.capturedBy.trim().toLowerCase())
        failures.push(`fact "${factId}" must be verified by someone other than who captured it`);
      if (Date.parse(fact.lastVerifiedAt) > now.getTime()) failures.push(`fact "${factId}" lastVerifiedAt is in the future`);
    }
    for (const sourceId of fact.sourceIds) {
      const source = index.sources.get(sourceId);
      if (!source) failures.push(`fact "${factId}" cites unknown source "${sourceId}"`);
      else if (source.designFixture) failures.push(`fact "${factId}" cites design-fixture source "${sourceId}"`);
    }
  }

  failures.push(...bodyProblems(record), ...factLabelProblems(record, index));

  for (const patch of patchesSinceVerification(record, bundle, index)) {
    failures.push(`changed by "${patch.title}" after it was last verified — re-verify before publishing`);
  }

  const blocked = blockedTextIn(record);
  if (blocked) failures.push(`contains blocked placeholder text "${blocked}"`);

  return failures;
}

export function isPublic(record: ContentRecord, bundle: ContentBundle, options?: { now?: Date; index?: BundleIndex }): boolean {
  return publicationGateFailures(record, bundle, options).length === 0;
}

/** Published records of one kind, sorted by title. The ONLY public selector. */
export function selectPublished<K extends EntityKind>(
  bundle: ContentBundle,
  kind: K,
  options: { now?: Date } = {},
): RecordOfKind<K>[] {
  const index = indexBundle(bundle);
  return bundle.records
    .filter((r): r is RecordOfKind<K> => r.kind === kind)
    .filter((r) => isPublic(r, bundle, { ...options, index }))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}

export function selectAllPublished(bundle: ContentBundle, options: { now?: Date } = {}): ContentRecord[] {
  const index = indexBundle(bundle);
  return bundle.records.filter((r) => isPublic(r, bundle, { ...options, index }));
}

/** Published records that have their own page (for routes, sitemap). */
export function selectRoutablePublished(bundle: ContentBundle, options: { now?: Date } = {}): RecordOfKind<RoutableKind>[] {
  return selectAllPublished(bundle, options).filter(isRoutable);
}

function sortKey(record: ContentRecord): string {
  return (record.kind === 'guide' ? record.title : record.name).toLowerCase();
}
