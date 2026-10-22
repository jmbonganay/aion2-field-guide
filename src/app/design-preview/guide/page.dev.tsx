/** DEV-ONLY: guide detail template rendered with a design fixture. */
import type { Metadata } from 'next';
import { DetailTemplate } from '@/components/content/detail-template';
import { MdxContent } from '@/components/content/mdx-content';
import { Note } from '@/components/ui/note';
import { resolveEvidence } from '@/lib/content';
import { loadDesignFixtures } from '@/lib/fixtures';

export const metadata: Metadata = { title: 'Guide template preview (dev only)', robots: { index: false, follow: false } };

export default function GuidePreviewPage() {
  const { bundle } = loadDesignFixtures();
  const guide = bundle.records.find((r) => r.kind === 'guide');
  if (!guide || guide.kind !== 'guide') return null;

  // Fixtures are never public, so the preview resolves unpublished related records too.
  const evidence = resolveEvidence(guide, bundle, { includeUnpublished: true });

  return (
    <DetailTemplate
      record={guide}
      evidence={evidence}
      crumbs={[
        { label: 'Design preview', href: '/design-preview/' },
        { label: 'Guide template', href: '/design-preview/guide/' },
      ]}
      relatedHref={() => '/design-preview/'}
      banner={<Note tone="fixture">Local development only. This page renders an invented layout sample and is never built or published.</Note>}
    >
      <MdxContent source={guide.body} evidence={evidence} />
    </DetailTemplate>
  );
}
