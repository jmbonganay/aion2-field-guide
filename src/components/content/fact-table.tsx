import { Badge, VerificationBadge } from '@/components/ui/badge';
import { formatDate, formatFactValue, humanizeProperty } from '@/lib/format';
import type { Fact, Source } from '@/lib/schemas';
import { sourceAnchor } from './source-list';

/**
 * Fact records with their evidence. The table scrolls inside its own
 * container on narrow screens so the page never overflows horizontally.
 * `showProvenance` (review preview only) adds where each claim was found
 * and who captured it.
 */
export function FactTable({
  facts,
  sources,
  caption,
  showProvenance = false,
  subjectId,
  subjectNames = new Map(),
}: {
  facts: Fact[];
  sources: Source[];
  caption: string;
  showProvenance?: boolean;
  /** The page's own record; facts about other subjects (skills, items) are labelled with their name. */
  subjectId?: string;
  subjectNames?: Map<string, string>;
}) {
  const sourceNumber = new Map(sources.map((s, i) => [s.id, i + 1]));
  const order = (f: Fact) => (f.subjectId === subjectId ? '' : (subjectNames.get(f.subjectId) ?? f.subjectId));
  const sorted = [...facts].sort((a, b) => order(a).localeCompare(order(b)));
  return (
    <div className="overflow-x-auto rounded-card border border-line-subtle bg-surface" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-raised/60 text-xs tracking-wide text-muted uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Claim</th>
            <th scope="col" className="px-4 py-3 font-semibold">Value</th>
            <th scope="col" className="px-4 py-3 font-semibold">Status</th>
            <th scope="col" className="px-4 py-3 font-semibold">Sources</th>
            <th scope="col" className="px-4 py-3 font-semibold">Verified</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-subtle">
          {sorted.map((fact) => (
            <tr key={fact.id} id={fact.id.replace(':', '-')} className="scroll-mt-24 align-top">
              <th scope="row" className="px-4 py-3 font-medium text-ink">
                {fact.subjectId !== subjectId && subjectNames.has(fact.subjectId) ? (
                  <span className="block text-xs font-semibold tracking-wide text-accent uppercase">{subjectNames.get(fact.subjectId)}</span>
                ) : null}
                {humanizeProperty(fact.property)}
                {fact.context ? <p className="mt-1 text-xs font-normal text-subtle">{fact.context}</p> : null}
                {showProvenance ? (
                  <p className="mt-2 text-xs font-normal text-subtle">
                    <span className="font-mono">{fact.id}</span> · found in: {fact.evidence} · captured by {fact.capturedBy} on {formatDate(fact.capturedAt)}
                  </p>
                ) : null}
              </th>
              <td className="px-4 py-3 text-ink">
                {formatFactValue(fact)}
                {fact.effectivePatch ? <p className="mt-1 text-xs text-subtle">Patch: {fact.effectivePatch}</p> : null}
              </td>
              <td className="px-4 py-3">
                <VerificationBadge verification={fact.verification} />
              </td>
              <td className="px-4 py-3">
                {fact.sourceIds.map((id) => (
                  <a key={id} href={`#${sourceAnchor(id)}`} className="link mr-2">
                    [{sourceNumber.get(id) ?? '?'}]
                  </a>
                ))}
              </td>
              <td className="px-4 py-3 text-muted">
                {fact.lastVerifiedAt ? (
                  <>
                    <time dateTime={fact.lastVerifiedAt}>{formatDate(fact.lastVerifiedAt)}</time>
                    {showProvenance && fact.verifiedBy ? <p className="text-xs text-subtle">by {fact.verifiedBy}</p> : null}
                  </>
                ) : (
                  <Badge tone="warning">Awaiting review</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
