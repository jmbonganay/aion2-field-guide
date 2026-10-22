import { indexBundle, type BundleIndex, type ContentBundle } from './bundle';
import { anchorFor, hrefFor } from './links';
import { formatFactValue } from './format';
import { extractHeadings } from './mdx-analysis';
import { selectAllPublished } from './publication';
import { isRoutable, recordTitle, type ContentRecord } from './schemas';
import type { SearchDocument, SearchIndexFile } from './search';

/**
 * Build-time search index. Only records that pass the publication gate.
 * Routable records link to their page; skills link to their anchor on a
 * public class page. Items are listed once item pages exist (ADR-024).
 */
export function buildSearchIndex(bundle: ContentBundle, options: { now?: Date } = {}): SearchIndexFile {
  const published = selectAllPublished(bundle, options);
  const publicIds = new Set(published.map((r) => r.id));
  const index = indexBundle(bundle);
  const documents: SearchDocument[] = [];

  for (const record of published) {
    if (isRoutable(record)) {
      const skills = published.filter((r) => r.kind === 'skill' && r.classId === record.id).map(recordTitle);
      documents.push(toDocument(record, hrefFor(record), [...extractHeadings(record.body).map((h) => h.text), ...skills], bodyText(record, index)));
    } else if (record.kind === 'skill' && publicIds.has(record.classId)) {
      const cls = index.records.get(record.classId);
      if (cls && isRoutable(cls)) documents.push(toDocument(record, `${hrefFor(cls)}#${anchorFor(record)}`, [recordTitle(cls)], factText(record, index)));
    }
  }
  return { version: 1, documents: documents.sort((a, b) => a.id.localeCompare(b.id)) };
}

/** Body as plain text, with each `<Fact>` replaced by its value. Capped to keep the index small. */
export function bodyText(record: ContentRecord, index: BundleIndex, max = 4000): string {
  const text = record.body
    .replace(/<Fact\s+[^>]*id=["']([^"']+)["'][^>]*\/>/g, (_, id: string) => {
      const fact = index.facts.get(id);
      return fact ? formatFactValue(fact) : ' ';
    })
    .replace(/<[^>]+>/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[#*_`>|[\]-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return `${text} ${factText(record, index)}`.trim().slice(0, max);
}

function factText(record: ContentRecord, index: BundleIndex): string {
  return record.factIds
    .map((id) => index.facts.get(id))
    .filter((f) => f !== undefined)
    .map((f) => formatFactValue(f))
    .join(' ');
}

function toDocument(record: ContentRecord, href: string, keywords: string[], body: string): SearchDocument {
  return {
    id: record.id,
    kind: record.kind,
    title: recordTitle(record),
    href,
    excerpt: record.summary,
    aliases: record.aliases,
    tags: record.tags,
    keywords,
    body,
    category: record.kind === 'guide' || record.kind === 'dungeon' ? record.category : record.kind,
    region: record.region,
  };
}
