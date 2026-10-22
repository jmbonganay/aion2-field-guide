import type { ContentBundle } from './bundle';
import { publicationGateFailures } from './publication';
import { bundledRecords } from './review';
import { recordTitle, type ContentRecord, type Fact } from './schemas';

/**
 * Human review sign-off (docs/06-ACCURACY-POLICY.md "Publication gate").
 *
 * Planning is pure: it simulates the approval and refuses unless the record
 * and everything approved with it would pass the full publication gate.
 * Only `scripts/approve.ts`, run by a human reviewer, writes the result.
 */

export type ApprovalPlan =
  | { ok: true; records: ContentRecord[]; facts: Fact[]; verifiedAt: string }
  | { ok: false; errors: string[] };

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function planApproval(bundle: ContentBundle, recordId: string, reviewer: string, now: Date = new Date()): ApprovalPlan {
  const record = bundle.records.find((r) => r.id === recordId);
  if (!record) return { ok: false, errors: [`unknown record "${recordId}"`] };
  if (!reviewer.trim()) return { ok: false, errors: ['a reviewer name is required'] };
  if (record.status !== 'in_review') return { ok: false, errors: [`"${recordTitle(record)}" is "${record.status}"; only in_review records can be approved`] };

  const records = [record, ...bundledRecords(record, bundle).filter((r) => r.status !== 'published')];
  const factIds = new Set(records.flatMap((r) => r.factIds));
  const facts = bundle.facts.filter((f) => factIds.has(f.id));
  const errors: string[] = [];

  for (const r of records) {
    if (same(r.author, reviewer)) errors.push(`${reviewer} wrote "${recordTitle(r)}" and cannot also review it`);
  }
  for (const f of facts) {
    if (same(f.capturedBy, reviewer)) errors.push(`${reviewer} captured ${f.id} and cannot also verify it`);
  }
  if (errors.length) return { ok: false, errors };

  const verifiedAt = new Date(Math.floor(now.getTime() / 1000) * 1000).toISOString().replace('.000Z', 'Z');
  const approvedRecords = records.map((r) => ({ ...r, status: 'published' as const, reviewedBy: reviewer, lastVerifiedAt: verifiedAt }));
  const approvedFacts = facts.map((f) => ({ ...f, verifiedBy: reviewer, lastVerifiedAt: verifiedAt }));

  const simulated: ContentBundle = {
    ...bundle,
    records: bundle.records.map((r) => approvedRecords.find((a) => a.id === r.id) ?? r),
    facts: bundle.facts.map((f) => approvedFacts.find((a) => a.id === f.id) ?? f),
  };
  for (const r of approvedRecords) {
    for (const failure of publicationGateFailures(r, simulated, { now })) {
      errors.push(`"${recordTitle(r)}" would still fail the gate: ${failure}`);
    }
  }
  return errors.length ? { ok: false, errors } : { ok: true, records: approvedRecords, facts: approvedFacts, verifiedAt };
}
