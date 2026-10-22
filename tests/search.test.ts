import { describe, expect, it } from 'vitest';
import { createSearchEngine, normalizeQuery, searchDocuments, type SearchDocument } from '@/lib/search';
import { buildSearchIndex } from '@/lib/search-index';
import { bundleOf, guide, NOW, source } from './helpers';

// Synthetic documents — they only exercise ranking logic.
const docs: SearchDocument[] = [
  { id: 'guide:alpha-basics', kind: 'guide', title: 'Alpha basics', href: '/guides/alpha-basics/', excerpt: 'Covers the beta workflow briefly.', aliases: [], tags: ['intro'], keywords: ['Getting started'], body: 'Mentions gamma in passing.', category: 'general', region: 'global' },
  { id: 'guide:beta', kind: 'guide', title: 'Beta', href: '/guides/beta/', excerpt: 'Everything about beta.', aliases: ['B-guide'], tags: [], keywords: [], body: '', category: 'general', region: 'global' },
  { id: 'system:gamma', kind: 'system', title: 'Gamma system', href: '/systems/gamma/', excerpt: 'A system page.', aliases: ['Delta'], tags: ['beta'], keywords: [], body: '', category: 'system', region: 'global' },
];
const engine = createSearchEngine(docs);

describe('search', () => {
  it('returns nothing for empty or whitespace queries', () => {
    expect(searchDocuments(engine, '')).toEqual([]);
    expect(searchDocuments(engine, '   ')).toEqual([]);
  });

  it('ranks an exact title match first', () => {
    const hits = searchDocuments(engine, 'beta');
    expect(hits[0]?.id).toBe('guide:beta');
    expect(hits[0]?.exact).toBe(true);
    expect(hits.map((h) => h.id)).toEqual(expect.arrayContaining(['system:gamma', 'guide:alpha-basics']));
  });

  it('ranks title > tag > excerpt', () => {
    const ids = searchDocuments(engine, 'beta').map((h) => h.id);
    expect(ids.indexOf('system:gamma')).toBeLessThan(ids.indexOf('guide:alpha-basics'));
  });

  it('matches aliases exactly', () => {
    expect(searchDocuments(engine, 'delta')[0]?.id).toBe('system:gamma');
  });

  it('requires every word of a multi-word query', () => {
    expect(searchDocuments(engine, 'alpha basics').map((h) => h.id)).toEqual(['guide:alpha-basics']);
    expect(searchDocuments(engine, 'alpha delta')).toEqual([]);
  });

  it('supports prefixes', () => {
    expect(searchDocuments(engine, 'gam')[0]?.id).toBe('system:gamma');
  });

  it('handles symbols and nonsense without throwing', () => {
    for (const q of ['!!!', '()[]{}', '"\'<script>', '%%%', '★', 'zzzzqqq']) {
      expect(() => searchDocuments(engine, q)).not.toThrow();
      expect(searchDocuments(engine, q)).toEqual([]);
    }
  });

  it('normalizes case, width and whitespace', () => {
    expect(normalizeQuery('  ＢＥＴＡ   guide ')).toBe('beta guide');
  });

  it('builds an index of published records only', () => {
    const bundle = bundleOf({
      sources: [source()],
      records: [guide(), guide({ id: 'guide:draft' as never, slug: 'draft', status: 'draft' }), guide({ id: 'guide:fixture' as never, slug: 'fixture', designFixture: true })],
    });
    const index = buildSearchIndex(bundle, { now: NOW });
    expect(index.documents.map((d) => d.id)).toEqual(['guide:test-guide']);
    expect(index.documents[0]).toMatchObject({ href: '/guides/test-guide/', kind: 'guide' });
  });
});

describe('search index — skills and keywords', () => {
  it('indexes public skills with an anchor on their public class page, and class keywords', async () => {
    const { classRecord, recordOf } = await import('./helpers');
    const bundle = bundleOf({ sources: [source()], records: [classRecord(), recordOf('skill', { name: 'Fire Test' })] });
    bundle.records[0] = { ...bundle.records[0]!, body: '## Overview\n\ntext' };
    const docs = buildSearchIndex(bundle, { now: NOW }).documents;
    expect(docs.find((d) => d.id === 'skill:test-skill')?.href).toBe('/classes/test-class/#skill-test-skill');
    expect(docs.find((d) => d.id === 'class:test-class')?.keywords).toEqual(['Overview', 'Fire Test']);
    const engine = createSearchEngine(docs);
    expect(searchDocuments(engine, 'fire test')[0]?.id).toBe('skill:test-skill');
  });

  it('omits skills whose class is not public', async () => {
    const { recordOf } = await import('./helpers');
    const bundle = bundleOf({ sources: [source()], records: [recordOf('skill')] });
    expect(buildSearchIndex(bundle, { now: NOW }).documents).toEqual([]);
  });
});

describe('search — body text', () => {
  it('finds words that only appear in a body, ranked below title matches', () => {
    const hits = searchDocuments(engine, 'gamma');
    expect(hits[0]?.id).toBe('system:gamma');
    expect(hits.map((h) => h.id)).toContain('guide:alpha-basics');
  });

  it('indexes fact values in place of <Fact> tags', async () => {
    const { bodyText } = await import('@/lib/search-index');
    const { indexBundle } = await import('@/lib/bundle');
    const { fact } = await import('./helpers');
    const b = bundleOf({ sources: [source()], facts: [fact({ value: 2600, unit: 'item level' })], records: [guide({ factIds: ['fact:test-claim'], body: '## Entry\n\nNeeds <Fact id="fact:test-claim" />.' })] });
    expect(bodyText(b.records[0]!, indexBundle(b))).toContain('Needs 2,600 item level');
  });
});
