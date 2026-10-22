/**
 * DEV-ONLY review queue (`next dev` only; excluded from `next build`).
 * Lists every record with what still blocks publication. Approval is a
 * separate human-run command — this page never changes content.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Note } from '@/components/ui/note';
import { getBundle } from '@/lib/content';
import { plural } from '@/lib/format';
import { reviewQueue } from '@/lib/review';

export const metadata: Metadata = { title: 'Review queue (dev only)', robots: { index: false, follow: false } };

const AWAITING_REVIEWER = /missing reviewedBy|missing lastVerifiedAt|has not been verified by a reviewer/;

export default function ReviewQueuePage() {
  const queue = reviewQueue(getBundle());
  return (
    <Container className="space-y-8 py-10">
      <Breadcrumbs items={[{ label: 'Review queue', href: '/review/' }]} />
      <div>
        <p className="eyebrow">Editorial · dev only</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Review queue</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Drafts render here with the real page template so a human reviewer can check every claim against its source before it is published.
        </p>
      </div>
      <Note tone="warning" title="Human sign-off required">
        Nothing on this page is public. To publish, the reviewer re-checks each fact, then runs{' '}
        <code>npm run content:approve -- &lt;id&gt; --reviewer &quot;Name&quot; --i-checked-the-sources</code>. The author of a page cannot approve it.
      </Note>
      <ul className="space-y-3">
        {queue.map((entry) => {
          const blocking = entry.blockers.filter((b) => !AWAITING_REVIEWER.test(b));
          return (
            <li key={entry.record.id} className="rounded-card border border-line-subtle bg-surface p-5">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={entry.record.status} />
                <span className="font-mono text-xs text-subtle">{entry.record.id}</span>
              </div>
              <h2 className="mt-2 text-xl">
                {entry.previewable ? (
                  <Link className="link" href={`/review/${entry.record.kind}/${entry.record.slug}/`}>
                    {entry.title}
                  </Link>
                ) : (
                  entry.title
                )}
              </h2>
              <p className="mt-1 text-sm text-subtle">
                {plural(entry.facts.length, 'fact')} ({entry.unverifiedFacts} awaiting reviewer) · {plural(entry.record.sourceIds.length, 'source')}
                {entry.bundled.length ? ` · approved together with ${entry.bundled.map((r) => r.id).join(', ')}` : ''}
                {!entry.previewable ? ' · shown inside its parent page' : ''}
              </p>
              {entry.record.status !== 'published' ? (
                blocking.length ? (
                  <ul className="mt-3 space-y-1 text-sm text-danger">
                    {blocking.map((b) => (
                      <li key={b}>✖ {b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-success">✔ Ready for human review</p>
                )
              ) : null}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
