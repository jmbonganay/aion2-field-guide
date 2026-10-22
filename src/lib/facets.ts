import type { Facet } from '@/components/content/filterable-grid';
import type { RecordOfKind, RoutableKind } from './schemas';

const MODE_LABEL: Record<string, string> = { pve: 'PvE', pvp: 'PvP', both: 'PvE & PvP' };
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Filter values for one record. */
export function facetValues(record: RecordOfKind<RoutableKind>): Record<string, string[]> {
  const category = record.kind === 'guide' || record.kind === 'dungeon' ? [record.category] : [];
  const mode =
    record.kind === 'guide' && record.mode
      ? record.mode === 'both'
        ? ['pve', 'pvp']
        : [record.mode]
      : record.kind === 'class'
        ? record.modes
        : [];
  return { category, mode };
}

/**
 * Only dimensions with at least two values among the published records are
 * offered (docs/08-FEATURE-SPECS.md: "Only show dimensions supported by
 * published records").
 */
export function buildFacets(records: RecordOfKind<RoutableKind>[]): Facet[] {
  const collect = (key: 'category' | 'mode') => [...new Set(records.flatMap((r) => facetValues(r)[key] ?? []))].sort();
  const facets: Facet[] = [
    { key: 'category', label: 'Category', options: collect('category').map((v) => ({ value: v, label: titleCase(v) })) },
    { key: 'mode', label: 'Mode', options: collect('mode').map((v) => ({ value: v, label: MODE_LABEL[v] ?? v })) },
  ];
  return facets.filter((f) => f.options.length >= 2);
}
