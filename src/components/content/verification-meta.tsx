import { RegionTag, StatusBadge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import type { ContentRecord } from '@/lib/schemas';

/**
 * Currentness panel: region, patch, last verified vs last updated, reviewer
 * and source count. "Last verified" and "Updated" are always shown separately.
 */
export function VerificationMeta({ record, sourceCount }: { record: ContentRecord; sourceCount: number }) {
  const rows: { term: string; value: React.ReactNode }[] = [
    { term: 'Status', value: <StatusBadge status={record.status} /> },
    { term: 'Region', value: <RegionTag region={record.region} /> },
    { term: 'Patch', value: record.patch ?? <span className="text-subtle">Not recorded</span> },
    {
      term: 'Last verified',
      value: record.lastVerifiedAt ? (
        <time dateTime={record.lastVerifiedAt}>{formatDate(record.lastVerifiedAt)}</time>
      ) : (
        <span className="text-subtle">Not verified</span>
      ),
    },
    { term: 'Updated', value: <time dateTime={record.updatedAt}>{formatDate(record.updatedAt)}</time> },
    { term: 'Reviewed by', value: record.reviewedBy ?? <span className="text-subtle">Not reviewed</span> },
    { term: 'Sources', value: <span className="tabular">{sourceCount}</span> },
  ];
  return (
    <section aria-labelledby="verification-heading" className="rounded-card border border-line-subtle bg-surface p-5">
      <h2 id="verification-heading" className="font-sans text-sm font-semibold tracking-wide text-muted uppercase">
        Verification
      </h2>
      <dl className="mt-4 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 text-sm">
        {rows.map((row) => (
          <div key={row.term} className="contents">
            <dt className="text-subtle">{row.term}</dt>
            <dd className="justify-self-end text-right text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
