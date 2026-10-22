/** DEV-ONLY: full-page preview of an unpublished record for its human reviewer. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailTemplate } from '@/components/content/detail-template';
import { MdxContent } from '@/components/content/mdx-content';
import { Note } from '@/components/ui/note';
import { getBundle, resolveEvidence } from '@/lib/content';
import { reviewQueue } from '@/lib/review';
import { isRoutable, recordTitle } from '@/lib/schemas';

export const metadata: Metadata = { title: 'Review preview (dev only)', robots: { index: false, follow: false } };
export const dynamicParams = false;

export function generateStaticParams() {
  return getBundle().records.filter(isRoutable).map((r) => ({ kind: r.kind, slug: r.slug }));
}

const AWAITING_REVIEWER = /missing reviewedBy|missing lastVerifiedAt|has not been verified by a reviewer/;

export default async function ReviewPreviewPage({ params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  const bundle = getBundle();
  const record = bundle.records.find((r) => r.kind === kind && r.slug === slug);
  if (!record || !isRoutable(record)) notFound();
  const entry = reviewQueue(bundle).find((e) => e.record.id === record.id);
  const blocking = entry?.blockers.filter((b) => !AWAITING_REVIEWER.test(b)) ?? [];
  const evidence = resolveEvidence(record, bundle, { includeUnpublished: true });

  return (
    <DetailTemplate
      record={record}
      evidence={evidence}
      review
      crumbs={[
        { label: 'Review queue', href: '/review/' },
        { label: recordTitle(record), href: `/review/${kind}/${slug}/` },
      ]}
      relatedHref={(r) => `/review/${r.kind}/${r.slug}/`}
      banner={
        <Note tone={blocking.length ? 'warning' : 'verify'} title={`Review preview — ${record.status.replace('_', ' ')}, not public`}>
          {blocking.length ? (
            <>
              Fix before review: {blocking.join('; ')}.
            </>
          ) : (
            <>
              Check every row in “Facts &amp; evidence” against its source (each row says where the claim was found), then approve with{' '}
              <code>
                npm run content:approve -- {record.id} --reviewer &quot;Name&quot; --i-checked-the-sources
              </code>
              {entry?.bundled.length ? <> — this also approves {entry.bundled.map((r) => r.id).join(', ')}</> : null}.
            </>
          )}
        </Note>
      }
    >
      {record.body.trim() ? <MdxContent source={record.body} evidence={evidence} /> : null}
    </DetailTemplate>
  );
}
