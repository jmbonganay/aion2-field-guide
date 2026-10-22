import { DirectoryPage } from '@/components/content/directory-page';
import { getPublished } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Guides',
  description: 'Reviewed, source-backed AION 2 Global guides. Every guide lists its sources, region and last-verified date.',
  path: '/guides/',
});

export default function GuidesPage() {
  return (
    <DirectoryPage
      eyebrow="Guides"
      title="Guides"
      lead="Step-by-step answers for AION 2 Global, each with its applicability, sources and the date the evidence was last checked."
      crumb={{ label: 'Guides', href: '/guides/' }}
      records={getPublished('guide')}
      noun="guide"
      empty={{
        title: 'No guides have passed verification yet',
        description:
          'Guides are published only after their claims are checked against current Global sources and reviewed by a second editor. Drafts are never shown here.',
      }}
    />
  );
}
