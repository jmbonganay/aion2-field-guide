import type { ContentRecord, Fact, Patch, Source } from './schemas';

/** Everything the site knows about, before any publication filtering. */
export type ContentBundle = {
  sources: Source[];
  facts: Fact[];
  patches: Patch[];
  records: ContentRecord[];
  /** Record/source/fact/patch id -> repository-relative file it came from. */
  origins: Map<string, string>;
};

export type IssueLevel = 'error' | 'warning';

export type ContentIssue = {
  level: IssueLevel;
  file: string;
  id?: string;
  message: string;
};

export function emptyBundle(): ContentBundle {
  return { sources: [], facts: [], patches: [], records: [], origins: new Map() };
}

export function indexBundle(bundle: ContentBundle) {
  return {
    sources: new Map(bundle.sources.map((s) => [s.id, s])),
    facts: new Map(bundle.facts.map((f) => [f.id, f])),
    patches: new Map(bundle.patches.map((p) => [p.id, p])),
    records: new Map(bundle.records.map((r) => [r.id, r])),
  };
}

export type BundleIndex = ReturnType<typeof indexBundle>;

export function originOf(bundle: ContentBundle, id: string): string {
  return bundle.origins.get(id) ?? '<unknown file>';
}
