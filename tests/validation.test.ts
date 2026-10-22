import { describe, expect, it } from 'vitest';
import { loadDesignFixtures } from '@/lib/fixtures';
import { loadContentTree } from '@/lib/load-content';
import { selectAllPublished } from '@/lib/publication';
import { summarizeIssues, validateBundle } from '@/lib/validation';
import { bundleOf, classRecord, fact, guide, NOW, source } from './helpers';

const errorsOf = (b: Parameters<typeof validateBundle>[0]) => summarizeIssues(validateBundle(b, { now: NOW })).errors.map((e) => e.message);

describe('validateBundle', () => {
  it('passes a clean bundle', () => {
    expect(errorsOf(bundleOf({ sources: [source()], facts: [fact()], records: [guide({ factIds: ['fact:test-claim'] })] }))).toEqual([]);
  });

  it('rejects duplicate ids and slugs', () => {
    const dupId = errorsOf(bundleOf({ sources: [source(), source()], records: [guide()] }));
    expect(dupId.some((m) => m.includes('duplicate id'))).toBe(true);
    const dupSlug = errorsOf(bundleOf({ sources: [source()], records: [guide(), guide({ id: 'guide:other' as never })] }));
    expect(dupSlug.some((m) => m.includes('duplicate guide slug'))).toBe(true);
  });

  it('requires id to equal kind:slug', () => {
    const errors = errorsOf(bundleOf({ sources: [source()], records: [guide({ id: 'guide:something-else' as never })] }));
    expect(errors.some((m) => m.includes('id must equal "guide:test-guide"'))).toBe(true);
  });

  it('fails published records that miss the gate, with a useful message', () => {
    const errors = errorsOf(bundleOf({ sources: [source()], records: [guide({ reviewedBy: null, lastVerifiedAt: null })] }));
    expect(errors).toContain('cannot publish "Test guide": missing reviewedBy');
    expect(errors).toContain('cannot publish "Test guide": missing lastVerifiedAt');
  });

  it('allows drafts with missing evidence (they are simply not public)', () => {
    expect(errorsOf(bundleOf({ records: [guide({ status: 'draft', reviewedBy: null, lastVerifiedAt: null, sourceIds: [] })] }))).toEqual([]);
  });

  it('rejects unknown sources, facts, related ids and class ids', () => {
    const errors = errorsOf(
      bundleOf({
        sources: [source()],
        records: [guide({ status: 'draft', sourceIds: ['source:nope'], factIds: ['fact:nope'], relatedIds: ['dungeon:nope'], classId: 'class:nope' })],
      }),
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        'unknown source "source:nope"',
        'unknown fact "fact:nope"',
        'unknown related record "dungeon:nope"',
        'unknown classId "class:nope"',
      ]),
    );
  });

  it('warns (not errors) when a published record relates to an unpublished one', () => {
    const issues = validateBundle(
      bundleOf({ sources: [source()], records: [guide({ relatedIds: ['class:test-class'] }), classRecord({ status: 'draft' })] }),
      { now: NOW },
    );
    expect(summarizeIssues(issues).errors).toEqual([]);
    expect(summarizeIssues(issues).warnings.map((w) => w.message)).toContain('related record "class:test-class" is not published and will be hidden');
  });

  it('checks fact integrity: sources, subject, region, reported context, percentages', () => {
    const errors = errorsOf(
      bundleOf({
        sources: [source()],
        records: [guide({ status: 'draft' })],
        facts: [
          fact({ id: 'fact:a', sourceIds: ['source:missing'] }),
          fact({ id: 'fact:b', subjectId: 'dungeon:missing' }),
          fact({ id: 'fact:c', region: 'tw' }),
          fact({ id: 'fact:d', verification: 'reported' }),
          fact({ id: 'fact:e', value: 140, unit: '%' }),
        ],
      }),
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        'unknown source "source:missing"',
        'unknown subject "dungeon:missing"',
        'fact region "tw" differs from subject region "global"',
        '"reported" facts need a context note describing who reported it',
        'percentage values must be within 0–100',
      ]),
    );
  });

  it('rejects design fixtures placed in the public content tree', () => {
    const errors = errorsOf(bundleOf({ records: [guide({ status: 'draft', designFixture: true })] }));
    expect(errors.some((m) => m.includes('design fixtures must live in src/content/fixtures/'))).toBe(true);
  });
});

describe('repository content', () => {
  it('src/content passes validation', () => {
    const { bundle, issues } = loadContentTree();
    expect(issues.filter((i) => i.level === 'error')).toEqual([]);
    expect(summarizeIssues(validateBundle(bundle)).errors).toEqual([]);
  });

  it('design fixtures are valid, marked, and never public', () => {
    const { bundle, issues } = loadDesignFixtures();
    expect(issues).toEqual([]);
    expect(bundle.records.length).toBeGreaterThan(0);
    for (const item of [...bundle.records, ...bundle.sources, ...bundle.facts]) expect(item.designFixture).toBe(true);
    expect(selectAllPublished(bundle)).toEqual([]);
    // Even if a fixture were flipped to published, the gate still refuses it.
    const flipped = { ...bundle, records: bundle.records.map((r) => ({ ...r, status: 'published' as const, reviewedBy: 'x', lastVerifiedAt: r.createdAt })) };
    expect(selectAllPublished(flipped)).toEqual([]);
  });

  it('the public loader never reads the fixtures directory', () => {
    const { bundle } = loadContentTree();
    expect([...bundle.origins.values()].some((file) => file.includes('fixtures'))).toBe(false);
  });
});
