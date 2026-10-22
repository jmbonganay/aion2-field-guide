import { indexBundle, originOf, type ContentBundle, type ContentIssue } from './bundle';
import { bodyRecordLinks, hrefFor, recordPathOf } from './links';
import { bodyProblems, factLabelProblems, patchesSinceVerification, publicationGateFailures } from './publication';
import { ENTITY_KINDS, isRoutable, recordTitle, type ContentRecord } from './schemas';

/** Published pages older than this many days get a re-verification warning. */
export const REVERIFY_AFTER_DAYS = 45;

/**
 * Cross-record validation (docs/05-CONTENT-SCHEMAS.md "Validation must
 * enforce"). Schema shape is checked by the loader; this checks integrity
 * between records and the publication gate for anything marked published.
 */
export function validateBundle(bundle: ContentBundle, options: { now?: Date } = {}): ContentIssue[] {
  const now = options.now ?? new Date();
  const issues: ContentIssue[] = [];
  const index = indexBundle(bundle);
  const err = (id: string, message: string) => issues.push({ level: 'error', file: originOf(bundle, id), id, message });
  const warn = (id: string, message: string) => issues.push({ level: 'warning', file: originOf(bundle, id), id, message });
  const isKnownKind = (ref: string) => (ENTITY_KINDS as readonly string[]).includes(ref.split(':')[0] as string);

  // Unique IDs across every content type.
  const seen = new Map<string, number>();
  for (const id of [...bundle.sources, ...bundle.facts, ...bundle.patches, ...bundle.records].map((x) => x.id)) {
    seen.set(id, (seen.get(id) ?? 0) + 1);
  }
  for (const [id, count] of seen) if (count > 1) err(id, `duplicate id "${id}" (${count} occurrences)`);

  // Unique slugs per kind; id must match kind and slug.
  const slugs = new Map<string, string>();
  for (const record of bundle.records) {
    const key = `${record.kind}/${record.slug}`;
    const other = slugs.get(key);
    if (other && other !== record.id) err(record.id, `duplicate ${record.kind} slug "${record.slug}" (also used by ${other})`);
    slugs.set(key, record.id);
    if (record.id !== `${record.kind}:${record.slug}`) err(record.id, `id must equal "${record.kind}:${record.slug}"`);
  }

  // Design fixtures must never appear in the public content tree.
  for (const item of [...bundle.sources, ...bundle.facts, ...bundle.records]) {
    if (item.designFixture) err(item.id, 'design fixtures must live in src/content/fixtures/, not the public content tree');
  }

  // Sources
  for (const source of bundle.sources) {
    if (source.publishedAt && Date.parse(source.publishedAt) > now.getTime()) err(source.id, 'publishedAt is in the future');
    if (Date.parse(source.retrievedAt) > now.getTime()) err(source.id, 'retrievedAt is in the future');
  }

  // Patches
  for (const patch of bundle.patches) {
    if (!index.sources.has(patch.sourceId)) err(patch.id, `unknown source "${patch.sourceId}"`);
    if (patch.effectiveAt && Date.parse(patch.effectiveAt) > now.getTime()) err(patch.id, 'effectiveAt is in the future');
    for (const id of patch.changedIds) {
      if (isKnownKind(id) && !index.records.has(id)) err(patch.id, `changedIds references unknown record "${id}"`);
    }
  }

  // Facts
  for (const fact of bundle.facts) {
    for (const sourceId of fact.sourceIds) {
      if (!index.sources.has(sourceId)) err(fact.id, `unknown source "${sourceId}"`);
    }
    if (Date.parse(fact.capturedAt) > now.getTime()) err(fact.id, 'capturedAt is in the future');
    if (fact.lastVerifiedAt && Date.parse(fact.lastVerifiedAt) > now.getTime()) err(fact.id, 'lastVerifiedAt is in the future');
    if (Boolean(fact.verifiedBy) !== Boolean(fact.lastVerifiedAt)) err(fact.id, 'verifiedBy and lastVerifiedAt must be set together');
    if (fact.verification === 'reported' && !fact.context) err(fact.id, '"reported" facts need a context note describing who reported it');
    const subjectKind = fact.subjectId.split(':')[0] as string;
    const subject = index.records.get(fact.subjectId);
    if (isKnownKind(fact.subjectId)) {
      if (!subject) err(fact.id, `unknown subject "${fact.subjectId}"`);
      else if (subject.region !== fact.region) err(fact.id, `fact region "${fact.region}" differs from subject region "${subject.region}"`);
    } else {
      warn(fact.id, `subject kind "${subjectKind}" has no record type yet; subject cannot be checked`);
    }
    if (typeof fact.value === 'number' && fact.unit === '%' && (fact.value < 0 || fact.value > 100)) {
      err(fact.id, 'percentage values must be within 0–100');
    }
  }

  // Records
  for (const record of bundle.records) {
    checkReferences(record);

    if (record.expiresAt && Date.parse(record.expiresAt) <= Date.parse(record.createdAt)) err(record.id, 'expiresAt must be after createdAt');

    if (record.status === 'published') {
      for (const failure of publicationGateFailures(record, bundle, { now, index })) {
        err(record.id, `cannot publish "${recordTitle(record)}": ${failure}`);
      }
      for (const path of bodyRecordLinks(record.body)) {
        const target = bundle.records.find((r) => isRoutable(r) && hrefFor(r) === recordPathOf(path));
        if (!target) err(record.id, `body links to "${path}", which is not a known page`);
        else if (target.status !== 'published') warn(record.id, `body link to "${path}" renders as plain text until ${target.id} is published`);
      }
      if (record.expiresAt && Date.parse(record.expiresAt) - now.getTime() < 7 * 86_400_000) {
        warn(record.id, `expires at ${record.expiresAt} — update or archive it before then`);
      }
      if (record.lastVerifiedAt && now.getTime() - Date.parse(record.lastVerifiedAt) > REVERIFY_AFTER_DAYS * 86_400_000) {
        warn(record.id, `last verified more than ${REVERIFY_AFTER_DAYS} days ago — schedule a re-check`);
      }
    } else if (record.status === 'in_review' || record.status === 'draft') {
      // Drafts may be incomplete, but authoring mistakes are surfaced early.
      for (const problem of bodyProblems(record)) warn(record.id, problem);
      for (const problem of factLabelProblems(record, index)) err(record.id, problem);
      for (const patch of record.lastVerifiedAt ? patchesSinceVerification(record, bundle, index) : []) {
        warn(record.id, `changed by "${patch.title}" after its last verification`);
      }
    }
  }

  return issues;

  function checkReferences(record: ContentRecord) {
    for (const sourceId of record.sourceIds) {
      if (!index.sources.has(sourceId)) err(record.id, `unknown source "${sourceId}"`);
    }
    for (const factId of record.factIds) {
      const fact = index.facts.get(factId);
      if (!fact) err(record.id, `unknown fact "${factId}"`);
      else if (fact.region !== record.region) err(record.id, `fact "${factId}" is for region "${fact.region}", record is "${record.region}"`);
    }
    for (const relatedId of record.relatedIds) {
      const related = index.records.get(relatedId);
      if (!related) err(record.id, `unknown related record "${relatedId}"`);
      else if (relatedId === record.id) err(record.id, 'record lists itself as related');
      else if (record.status === 'published' && related.status !== 'published')
        warn(record.id, `related record "${relatedId}" is not published and will be hidden`);
    }
    if ((record.kind === 'guide' || record.kind === 'skill') && record.classId && !index.records.has(record.classId)) {
      err(record.id, `unknown classId "${record.classId}"`);
    }
  }
}

export function summarizeIssues(issues: ContentIssue[]) {
  return {
    errors: issues.filter((i) => i.level === 'error'),
    warnings: issues.filter((i) => i.level === 'warning'),
  };
}
