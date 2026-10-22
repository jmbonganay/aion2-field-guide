import MiniSearch, { type SearchResult as MiniResult } from 'minisearch';
import type { EntityKind } from './schemas';

/**
 * Client-safe search engine. Kept free of Node and Zod imports so the
 * search dialog only downloads MiniSearch + this module, on first open.
 */

export type SearchDocument = {
  id: string;
  kind: EntityKind;
  title: string;
  href: string;
  excerpt: string;
  aliases: string[];
  tags: string[];
  /** Headings, skill names and other secondary terms. */
  keywords: string[];
  /** Plain-text body with fact values, searched with the lowest weight. */
  body: string;
  category: string;
  region: string;
};

export type SearchIndexFile = { version: 1; documents: SearchDocument[] };

export type SearchHit = SearchDocument & { score: number; exact: boolean };

export const SEARCH_FIELDS = ['title', 'aliases', 'tags', 'keywords', 'excerpt', 'body'] as const;

export function normalizeQuery(query: string): string {
  return query.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

export function createSearchEngine(documents: SearchDocument[]) {
  const engine = new MiniSearch<SearchDocument>({
    idField: 'id',
    fields: [...SEARCH_FIELDS],
    storeFields: ['id'],
    extractField: (doc, field) => {
      const value = doc[field as keyof SearchDocument];
      return Array.isArray(value) ? value.join(' ') : String(value ?? '');
    },
    searchOptions: {
      // Ranking: exact title/alias > title > aliases > tags > keywords > excerpt > body.
      boost: { title: 6, aliases: 4, tags: 2, keywords: 1.5, excerpt: 1, body: 0.5 },
      prefix: (term) => term.length >= 2,
      // Typo tolerance stays off until it is tested against real content.
      fuzzy: false,
      combineWith: 'AND',
    },
  });
  engine.addAll(documents);
  return { engine, byId: new Map(documents.map((d) => [d.id, d])) };
}

export type SearchEngine = ReturnType<typeof createSearchEngine>;

export function searchDocuments({ engine, byId }: SearchEngine, query: string, limit = 20): SearchHit[] {
  const q = normalizeQuery(query);
  if (!q) return [];
  let results: MiniResult[];
  try {
    results = engine.search(q);
  } catch {
    return [];
  }
  const hits: SearchHit[] = [];
  for (const result of results) {
    const doc = byId.get(String(result.id));
    if (!doc) continue;
    const exact = [doc.title, ...doc.aliases].some((name) => normalizeQuery(name) === q);
    hits.push({ ...doc, score: result.score, exact });
  }
  hits.sort((a, b) => Number(b.exact) - Number(a.exact) || b.score - a.score || a.title.localeCompare(b.title));
  return hits.slice(0, limit);
}
