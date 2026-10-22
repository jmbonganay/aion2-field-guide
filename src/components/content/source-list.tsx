import { EvidenceBadge, RegionTag } from '@/components/ui/badge';
import { ExternalIcon } from '@/components/ui/icons';
import { formatDate } from '@/lib/format';
import { safeHref } from '@/lib/links';
import type { Source } from '@/lib/schemas';

export const sourceAnchor = (id: string) => id.replace(':', '-');

/**
 * Source citations. Each entry shows grade, region, publisher and the date
 * it was inspected so readers can judge evidence themselves.
 */
export function SourceList({ sources, showScope = false }: { sources: Source[]; showScope?: boolean }) {
  if (sources.length === 0) {
    return <p className="text-muted">No sources are recorded for this page.</p>;
  }
  return (
    <ol className="divide-y divide-line-subtle overflow-hidden rounded-card border border-line-subtle bg-surface">
      {sources.map((source, i) => {
        const href = safeHref(source.url);
        return (
          <li key={source.id} id={sourceAnchor(source.id)} className="flex scroll-mt-24 gap-4 p-4 sm:p-5">
            <span aria-hidden className="tabular mt-0.5 w-6 shrink-0 text-right text-sm text-subtle">
              {i + 1}.
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-snug">
                {href ? (
                  <a href={href} rel="noopener noreferrer" className="link inline-flex items-baseline gap-1.5 break-words">
                    <span>{source.title}</span>
                    <ExternalIcon className="shrink-0 translate-y-0.5 text-sm" />
                    <span className="sr-only">(external site)</span>
                  </a>
                ) : (
                  source.title
                )}
              </p>
              <p className="mt-1 text-sm text-subtle">
                {source.publisher}
                {source.registerCode ? <span className="ml-2 font-mono text-xs">{source.registerCode}</span> : null}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <EvidenceBadge grade={source.grade} />
                <RegionTag region={source.region} />
                <span className="text-xs text-subtle">
                  Retrieved <time dateTime={source.retrievedAt}>{formatDate(source.retrievedAt)}</time>
                  {source.publishedAt ? (
                    <>
                      {' · '}Published <time dateTime={source.publishedAt}>{formatDate(source.publishedAt)}</time>
                    </>
                  ) : null}
                </span>
              </div>
              {showScope ? <p className="mt-3 text-sm text-muted">{source.scope}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
