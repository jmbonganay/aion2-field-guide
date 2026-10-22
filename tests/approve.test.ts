import { describe, expect, it } from 'vitest';
import { planApproval } from '@/lib/approve';
import { loadContentTree } from '@/lib/load-content';
import { reviewQueue } from '@/lib/review';
import { bundleOf, classRecord, fact, guide, NOW, recordOf, source } from './helpers';

const draft = (overrides = {}) => guide({ status: 'in_review', reviewedBy: null, lastVerifiedAt: null, factIds: ['fact:test-claim'], ...overrides });
const unverifiedFact = () => fact({ verifiedBy: null, lastVerifiedAt: null });

describe('planApproval', () => {
  it('publishes the record and verifies its facts when everything else passes', () => {
    const plan = planApproval(bundleOf({ sources: [source()], facts: [unverifiedFact()], records: [draft()] }), 'guide:test-guide', 'Reviewer B', NOW);
    expect(plan.ok).toBe(true);
    if (!plan.ok) return;
    expect(plan.records[0]).toMatchObject({ status: 'published', reviewedBy: 'Reviewer B', lastVerifiedAt: '2026-10-22T12:00:00Z' });
    expect(plan.facts[0]).toMatchObject({ verifiedBy: 'Reviewer B', lastVerifiedAt: '2026-10-22T12:00:00Z' });
    expect(plan.records[0]?.updatedAt).toBe('2026-10-20T00:00:00Z'); // verification is not an edit
  });

  it('refuses the author, the fact capturer, and non-in_review records', () => {
    const b = bundleOf({ sources: [source()], facts: [unverifiedFact()], records: [draft()] });
    expect(planApproval(b, 'guide:test-guide', 'AUTHOR-A', NOW)).toMatchObject({ ok: false });
    expect(planApproval(b, 'guide:test-guide', 'capturer-c', NOW)).toMatchObject({ ok: false });
    const drafted = bundleOf({ sources: [source()], facts: [unverifiedFact()], records: [draft({ status: 'draft' })] });
    expect(planApproval(drafted, 'guide:test-guide', 'Reviewer B', NOW)).toMatchObject({ ok: false });
    expect(planApproval(b, 'guide:missing', 'Reviewer B', NOW)).toMatchObject({ ok: false });
  });

  it('refuses when the result would still fail the gate (e.g. an uncited number)', () => {
    const b = bundleOf({ sources: [source()], facts: [unverifiedFact()], records: [draft({ body: 'Costs 500 Kina.' })] });
    const plan = planApproval(b, 'guide:test-guide', 'Reviewer B', NOW);
    expect(plan.ok).toBe(false);
    if (!plan.ok) expect(plan.errors.join(' ')).toContain('numbers not backed by a <Fact>: 500');
  });

  it('approves a class together with its skills', () => {
    const cls = { ...classRecord({ status: 'in_review', reviewedBy: null, lastVerifiedAt: null }) };
    const skill = recordOf('skill', { status: 'in_review', reviewedBy: null, lastVerifiedAt: null });
    const plan = planApproval(bundleOf({ sources: [source()], records: [cls, skill] }), 'class:test-class', 'Reviewer B', NOW);
    expect(plan.ok && plan.records.map((r) => r.id)).toEqual(['class:test-class', 'skill:test-skill']);
  });
});

describe('repository drafts', () => {
  it('every in_review page would pass the full publication gate after human sign-off (no files are written)', () => {
    const { bundle } = loadContentTree();
    const queue = reviewQueue(bundle).filter((e) => e.previewable);
    const pages = queue.filter((e) => e.record.status === 'in_review');
    // Phase 2 exit: at least four complete pages exist, drafted or already published.
    expect(queue.filter((e) => e.record.status === 'in_review' || e.record.status === 'published').length).toBeGreaterThanOrEqual(4);
    for (const entry of pages) {
      const plan = planApproval(bundle, entry.record.id, 'Simulated Reviewer');
      expect(plan.ok ? [] : plan.errors, entry.record.id).toEqual([]);
    }
  });
});
