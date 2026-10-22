'use client';

import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';

/** Every query key the filters own, cleared on change even if not offered on this page. */
export const FILTER_KEYS = ['category', 'mode'] as const;

export type Facet = { key: string; label: string; options: { value: string; label: string }[] };
export type FilterEntry = { id: string; values: Record<string, string[]>; card: ReactNode };

/** Keep only known facet keys and option values from the URL (docs/08-FEATURE-SPECS.md §2). */
export function sanitizeFilters(params: URLSearchParams, facets: Facet[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const facet of facets) {
    const value = params.get(facet.key);
    if (value && facet.options.some((o) => o.value === value)) out[facet.key] = value;
  }
  return out;
}

export function applyFilters(entries: FilterEntry[], selected: Record<string, string>): FilterEntry[] {
  return entries.filter((e) => Object.entries(selected).every(([key, value]) => e.values[key]?.includes(value)));
}

/**
 * Client-side directory filters. Server HTML lists every record, so the page
 * is complete without JavaScript; filters only narrow it. State mirrors to the
 * URL with replaceState so reload and sharing work without new history entries.
 */
export function FilterableGrid({ entries, facets, label, noun }: { entries: FilterEntry[]; facets: Facet[]; label: string; noun: string }) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const statusId = useId();

  useEffect(() => {
    const initial = sanitizeFilters(new URLSearchParams(window.location.search), facets);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
    if (Object.keys(initial).length) setSelected(initial);
  }, [facets]);

  function update(next: Record<string, string>) {
    setSelected(next);
    const url = new URL(window.location.href);
    for (const key of new Set([...FILTER_KEYS, ...facets.map((f) => f.key)])) url.searchParams.delete(key);
    for (const [key, value] of Object.entries(next)) url.searchParams.set(key, value);
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }

  const visible = useMemo(() => applyFilters(entries, selected), [entries, selected]);
  const active = Object.keys(selected).length > 0;

  return (
    <div>
      {facets.length ? (
        <div role="group" aria-label={`Filter ${label}`} aria-describedby={statusId} className="mb-8 flex flex-wrap items-end gap-4">
          {facets.map((facet) => (
            <label key={facet.key} className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted">{facet.label}</span>
              <select
                value={selected[facet.key] ?? ''}
                onChange={(e) => {
                  const next = { ...selected };
                  if (e.target.value) next[facet.key] = e.target.value;
                  else delete next[facet.key];
                  update(next);
                }}
                className="h-11 min-w-44 rounded-control border border-line bg-sunken px-3 text-ink hover:border-accent/40"
              >
                <option value="">All</option>
                {facet.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
          {active ? (
            <button
              type="button"
              onClick={() => update({})}
              className="inline-flex h-11 items-center rounded-control border border-line-subtle px-4 text-sm text-muted hover:border-accent/40 hover:text-ink"
            >
              Reset filters
            </button>
          ) : null}
        </div>
      ) : null}

      <p id={statusId} role="status" aria-live="polite" className="sr-only">
        {active ? `${visible.length} of ${entries.length} ${noun}s shown` : ''}
      </p>

      {visible.length ? (
        <ul aria-label={label} className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {visible.map((e) => (
            <li key={e.id}>{e.card}</li>
          ))}
        </ul>
      ) : (
        <div className="rounded-card border border-dashed border-line bg-surface/60 px-6 py-10 text-center">
          <p className="font-display text-xl">No verified {noun}s match this filter</p>
          <button
            type="button"
            onClick={() => update({})}
            className="mt-4 inline-flex min-h-11 items-center rounded-control border border-accent/50 bg-accent/10 px-4 text-sm font-medium text-accent-strong hover:bg-accent/20"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
