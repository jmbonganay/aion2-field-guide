import { describe, expect, it } from 'vitest';
import { publicationGateFailures, selectAllPublished, selectPublished } from '@/lib/publication';
import type { Guide } from '@/lib/schemas';
import { bundleOf, classRecord, fact, guide, NOW, patch, recordOf, source } from './helpers';

describe('publication gate', () => {
  const ok = () => bundleOf({ sources: [source()], records: [guide()] });

  it('publishes a fully evidenced, reviewed Global record', () => {
    const bundle = ok();
    expect(publicationGateFailures(bundle.records[0]!, bundle, { now: NOW })).toEqual([]);
    expect(selectPublished(bundle, 'guide', { now: NOW })).toHaveLength(1);
  });

  it.each<[string, Partial<Guide>]>([
    ['draft', { status: 'draft' as const }],
    ['in review', { status: 'in_review' as const }],
    ['stale', { status: 'stale' as const }],
    ['archived', { status: 'archived' as const }],
    ['no reviewer', { reviewedBy: null }],
    ['self-review', { reviewedBy: 'Author-A ' }],
    ['never verified', { lastVerifiedAt: null }],
    ['verified in the future', { lastVerifiedAt: '2027-01-01T00:00:00Z' }],
    ['no sources', { sourceIds: [] }],
    ['unknown source', { sourceIds: ['source:missing'] }],
    ['KR region', { region: 'kr' as const }],
    ['TW region', { region: 'tw' as const }],
    ['placeholder text', { body: 'Drop rate: TBD' }],
    ['TODO in summary', { summary: 'TODO write this' }],
    ['design fixture', { designFixture: true as const }],
    ['an uncited number in the body', { body: 'Entry needs item level 2600.' }],
    ['a body Fact not listed in factIds', { body: 'See <Fact id="fact:test-claim" />.' }],
    ['a body Cite not listed in sourceIds', { body: 'Per <Cite id="source:other" />.' }],
  ])('excludes a record that is %s', (_label: string, overrides: Partial<Guide>) => {
    const bundle = bundleOf({ sources: [source()], records: [guide(overrides)] });
    expect(publicationGateFailures(bundle.records[0]!, bundle, { now: NOW }).length).toBeGreaterThan(0);
    expect(selectAllPublished(bundle, { now: NOW })).toEqual([]);
  });

  it('rejects disputed or cross-region facts', () => {
    const disputed = bundleOf({ sources: [source()], facts: [fact({ verification: 'disputed' })], records: [guide({ factIds: ['fact:test-claim'] })] });
    expect(selectAllPublished(disputed, { now: NOW })).toEqual([]);
    const crossRegion = bundleOf({ sources: [source()], facts: [fact({ region: 'kr' })], records: [guide({ factIds: ['fact:test-claim'] })] });
    expect(selectAllPublished(crossRegion, { now: NOW })).toEqual([]);
  });

  it('rejects records citing design-fixture sources', () => {
    const bundle = bundleOf({ sources: [source({ designFixture: true })], records: [guide()] });
    expect(selectAllPublished(bundle, { now: NOW })).toEqual([]);
  });

  it('filters by kind and sorts by title', () => {
    const bundle = bundleOf({
      sources: [source()],
      records: [guide({ id: 'guide:b', slug: 'b', title: 'Beta' }), guide({ id: 'guide:a', slug: 'a', title: 'alpha' }), classRecord()],
    });
    expect(selectPublished(bundle, 'guide', { now: NOW }).map((r) => r.slug)).toEqual(['a', 'b']);
    expect(selectPublished(bundle, 'class', { now: NOW })).toHaveLength(1);
    expect(selectPublished(bundle, 'dungeon', { now: NOW })).toEqual([]);
  });

  it('accepts numbers only inside <Fact>, <Term>, code or the game name', () => {
    const body = 'Requires <Fact id="fact:test-claim" />. Use <Term>Specialty 1</Term>, `code 42` and AION 2.\n\n1. A list step.';
    const bundle = bundleOf({ sources: [source()], facts: [fact()], records: [guide({ factIds: ['fact:test-claim'], body })] });
    expect(publicationGateFailures(bundle.records[0]!, bundle, { now: NOW })).toEqual([]);
  });

  it('requires facts to be verified by a reviewer other than the capturer', () => {
    const unverified = bundleOf({ sources: [source()], facts: [fact({ verifiedBy: null, lastVerifiedAt: null })], records: [guide({ factIds: ['fact:test-claim'] })] });
    expect(publicationGateFailures(unverified.records[0]!, unverified, { now: NOW })).toContain('fact "fact:test-claim" has not been verified by a reviewer');
    const self = bundleOf({ sources: [source()], facts: [fact({ verifiedBy: 'capturer-c' })], records: [guide({ factIds: ['fact:test-claim'] })] });
    expect(publicationGateFailures(self.records[0]!, self, { now: NOW })).toContain('fact "fact:test-claim" must be verified by someone other than who captured it');
  });

  it('hides a record changed by a patch after its last verification', () => {
    const stale = bundleOf({ sources: [source()], patches: [patch({ changedIds: ['guide:test-guide'], effectiveAt: '2026-10-21T06:30:00Z' })], records: [guide({ lastVerifiedAt: '2026-10-20T00:00:00Z' })] });
    expect(selectAllPublished(stale, { now: NOW })).toEqual([]);
    const fresh = bundleOf({ sources: [source()], patches: [patch({ changedIds: ['guide:test-guide'], effectiveAt: '2026-10-21T06:30:00Z' })], records: [guide({ lastVerifiedAt: '2026-10-22T00:00:00Z' })] });
    expect(selectAllPublished(fresh, { now: NOW })).toHaveLength(1);
  });

  it('also treats patches to a fact subject as changes to the citing page', () => {
    const bundle = bundleOf({
      sources: [source()],
      facts: [fact({ subjectId: 'dungeon:test-dungeon' })],
      patches: [patch({ changedIds: ['dungeon:test-dungeon'] })],
      records: [guide({ factIds: ['fact:test-claim'], lastVerifiedAt: '2026-10-20T00:00:00Z' }), recordOf('dungeon', { lastVerifiedAt: '2026-10-22T00:00:00Z' })],
    });
    expect(selectPublished(bundle, 'guide', { now: NOW })).toEqual([]);
    expect(selectPublished(bundle, 'dungeon', { now: NOW })).toHaveLength(1);
  });

  it('rejects a <Fact> label whose number contradicts the fact value', () => {
    const f = fact({ value: 2600, unit: 'item level' });
    const bad = bundleOf({ sources: [source()], facts: [f], records: [guide({ factIds: ['fact:test-claim'], body: 'Needs <Fact id="fact:test-claim" label="3000" />.' })] });
    expect(publicationGateFailures(bad.records[0]!, bad, { now: NOW })).toContain('<Fact id="fact:test-claim"> label "3000" shows 3000, which is not in the fact\'s value');
    const good = bundleOf({ sources: [source()], facts: [f], records: [guide({ factIds: ['fact:test-claim'], body: 'Needs <Fact id="fact:test-claim" label="2,600" />.' })] });
    expect(publicationGateFailures(good.records[0]!, good, { now: NOW })).toEqual([]);
  });
});

describe('public updates', () => {
  it('lists a patch only when a published page it changed exists, mapping skills to their class page', async () => {
    const { publicUpdates } = await import('@/lib/content');
    const p = patch({ changedIds: ['skill:test-skill', 'dungeon:test-dungeon'] });
    const withPage = bundleOf({ sources: [source()], patches: [p], records: [classRecord(), recordOf('skill', { lastVerifiedAt: '2026-10-22T00:00:00Z' })] });
    withPage.records[0] = { ...withPage.records[0]!, lastVerifiedAt: '2026-10-22T00:00:00Z' };
    const updates = publicUpdates(withPage, { now: NOW });
    expect(updates.map((u) => u.affected.map((r) => r.id))).toEqual([['class:test-class']]);
    const none = bundleOf({ sources: [source()], patches: [p], records: [recordOf('dungeon', { status: 'draft' })] });
    expect(publicUpdates(none, { now: NOW })).toEqual([]);
  });
});

describe('time-limited content', () => {
  it('drops a published record once expiresAt has passed', () => {
    const live = bundleOf({ sources: [source()], records: [guide({ expiresAt: '2026-10-23T00:00:00Z' })] });
    expect(selectAllPublished(live, { now: NOW })).toHaveLength(1);
    const gone = bundleOf({ sources: [source()], records: [guide({ expiresAt: '2026-10-22T11:00:00Z' })] });
    expect(publicationGateFailures(gone.records[0]!, gone, { now: NOW })).toContain('expired at 2026-10-22T11:00:00Z (time-limited content)');
    expect(selectAllPublished(gone, { now: NOW })).toEqual([]);
  });
});
