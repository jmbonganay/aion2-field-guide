import { describe, expect, it } from 'vitest';
import { factSchema, recordSchemas, slugSchema, sourceSchema } from '@/lib/schemas';
import { guide, source } from './helpers';

describe('schemas', () => {
  it('accepts kebab-case slugs and rejects others', () => {
    expect(slugSchema.safeParse('sorcerer-pve').success).toBe(true);
    for (const bad of ['Sorcerer', 'sorcerer_pve', '-lead', 'trail-', 'two--dashes', 'spa ce', 'ünicode', '']) {
      expect(slugSchema.safeParse(bad).success, bad).toBe(false);
    }
  });

  it('requires https source URLs', () => {
    expect(() => source({ url: 'http://example.org/insecure' })).toThrow();
    expect(() => source({ url: 'javascript:alert(1)' })).toThrow();
    expect(source().url).toBe('https://example.org/test');
  });

  it('requires UTC ISO timestamps', () => {
    expect(() => source({ retrievedAt: '2026-10-22' })).toThrow();
    expect(() => source({ retrievedAt: '2026-10-22T09:00:00+08:00' })).toThrow();
    expect(() => source({ retrievedAt: 'yesterday' })).toThrow();
  });

  it('rejects unknown regions and evidence grades', () => {
    expect(sourceSchema.safeParse({ ...source(), region: 'eu' }).success).toBe(false);
    expect(sourceSchema.safeParse({ ...source(), grade: 'ai-summary' }).success).toBe(false);
  });

  it('requires namespaced ids that match the record kind', () => {
    expect(() => guide({ id: 'class:test-guide' as never })).toThrow();
    expect(() => guide({ id: 'guide:Bad_ID' as never })).toThrow();
  });

  it('rejects unknown fields (strict objects)', () => {
    const meta: Record<string, unknown> = { ...guide() };
    delete meta.kind;
    delete meta.body;
    expect(recordSchemas.guide.safeParse(meta).success).toBe(true);
    expect(recordSchemas.guide.safeParse({ ...meta, dropRate: 5 }).success).toBe(false);
  });

  it('requires at least one source on every fact', () => {
    const base = { id: 'fact:x', subjectId: 'guide:x', property: 'x', value: 'y', region: 'global', evidence: 'loc', capturedBy: 'c', capturedAt: '2026-10-20T00:00:00Z', verification: 'confirmed' };
    expect(factSchema.safeParse({ ...base, sourceIds: [] }).success).toBe(false);
    expect(factSchema.safeParse({ ...base, sourceIds: ['source:a'] }).success).toBe(true);
  });

  it('defaults patch to null rather than guessing a version', () => {
    expect(guide().patch).toBeNull();
  });

  it('accepts date-only or full UTC publication dates on sources', () => {
    expect(source({ publishedAt: '2026-10-06' }).publishedAt).toBe('2026-10-06');
    expect(() => source({ publishedAt: '06/10/2026' })).toThrow();
  });

  it('never assumes item binding or rarity', () => {
    const item = recordSchemas.item.parse({ id: 'item:x', slug: 'x', name: 'X', itemType: 'material', summary: 's', region: 'global', status: 'draft', author: 'a', createdAt: '2026-10-20T00:00:00Z', updatedAt: '2026-10-20T00:00:00Z' });
    expect(item.bound).toBeNull();
    expect(item.rarity).toBeNull();
  });
});
