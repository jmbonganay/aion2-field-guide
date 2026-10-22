import { describe, expect, it } from 'vitest';
import { applyFilters, sanitizeFilters, type FilterEntry } from '@/components/content/filterable-grid';
import { buildFacets, facetValues } from '@/lib/facets';
import type { RecordOfKind, RoutableKind } from '@/lib/schemas';
import { guide, recordOf } from './helpers';

const g = (slug: string, category: 'general' | 'system', mode?: 'pve' | 'pvp' | 'both') =>
  guide({ id: `guide:${slug}` as never, slug, title: slug, category, ...(mode ? { mode } : {}) }) as RecordOfKind<RoutableKind>;

describe('directory filters', () => {
  it('offers only dimensions with two or more values', () => {
    expect(buildFacets([g('a', 'general'), g('b', 'general')])).toEqual([]);
    const facets = buildFacets([g('a', 'general', 'pve'), g('b', 'system', 'both')]);
    expect(facets.map((f) => f.key)).toEqual(['category', 'mode']);
    expect(facets[1]?.options.map((o) => o.label)).toEqual(['PvE', 'PvP']);
  });

  it('maps "both" modes to PvE and PvP and dungeon categories through', () => {
    expect(facetValues(g('a', 'general', 'both')).mode).toEqual(['pve', 'pvp']);
    expect(facetValues(recordOf('dungeon') as RecordOfKind<RoutableKind>).category).toEqual(['Test']);
  });

  it('sanitizes URL parameters to known facet values', () => {
    const facets = buildFacets([g('a', 'general', 'pve'), g('b', 'system', 'pvp')]);
    expect(sanitizeFilters(new URLSearchParams('category=system&mode=<script>&evil=1'), facets)).toEqual({ category: 'system' });
  });

  it('applies all selected filters together', () => {
    const entries: FilterEntry[] = [
      { id: 'a', values: { category: ['general'], mode: ['pve'] }, card: null },
      { id: 'b', values: { category: ['system'], mode: ['pve', 'pvp'] }, card: null },
    ];
    expect(applyFilters(entries, { mode: 'pvp' }).map((e) => e.id)).toEqual(['b']);
    expect(applyFilters(entries, { mode: 'pve', category: 'general' }).map((e) => e.id)).toEqual(['a']);
    expect(applyFilters(entries, {}).map((e) => e.id)).toEqual(['a', 'b']);
  });
});
