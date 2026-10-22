import { indexBundle, type ContentBundle } from './bundle';
import { publicationGateFailures } from './publication';
import { isRoutable, recordTitle, type ContentRecord, type Fact } from './schemas';

/**
 * Review queue: what stands between each record and publication. Used by the
 * dev-only /review/ pages and `npm run content:review`. Nothing here changes
 * content — approval is a separate, human-run command (scripts/approve.ts).
 */

export type ReviewEntry = {
  record: ContentRecord;
  title: string;
  /** Gate failures other than the status itself. */
  blockers: string[];
  /** Records that are approved together with this one (skills of a class, linked skills/items). */
  bundled: ContentRecord[];
  facts: Fact[];
  unverifiedFacts: number;
  previewable: boolean;
};

/** Records whose approval travels with `record` (embedded skills and items). */
export function bundledRecords(record: ContentRecord, bundle: ContentBundle): ContentRecord[] {
  const index = indexBundle(bundle);
  const linked = record.relatedIds.map((id) => index.records.get(id)).filter((r): r is ContentRecord => Boolean(r) && !isRoutable(r as ContentRecord));
  const skills = record.kind === 'class' ? bundle.records.filter((r) => r.kind === 'skill' && r.classId === record.id) : [];
  return [...new Map([...skills, ...linked].map((r) => [r.id, r])).values()];
}

export function reviewQueue(bundle: ContentBundle, options: { now?: Date } = {}): ReviewEntry[] {
  const index = indexBundle(bundle);
  return bundle.records
    .filter((r) => r.status !== 'archived')
    .map((record) => {
      const bundled = bundledRecords(record, bundle);
      const factIds = [...new Set([...record.factIds, ...bundled.flatMap((r) => r.factIds)])];
      const facts = factIds.map((id) => index.facts.get(id)).filter((f): f is Fact => Boolean(f));
      const blockers = publicationGateFailures(record, bundle, { ...options, index }).filter((f) => !f.startsWith('status is'));
      return {
        record,
        title: recordTitle(record),
        blockers,
        bundled,
        facts,
        unverifiedFacts: facts.filter((f) => !f.verifiedBy).length,
        previewable: isRoutable(record),
      };
    })
    .sort((a, b) => statusRank(a.record.status) - statusRank(b.record.status) || a.title.localeCompare(b.title));
}

function statusRank(status: string): number {
  return ['in_review', 'stale', 'draft', 'published'].indexOf(status);
}
