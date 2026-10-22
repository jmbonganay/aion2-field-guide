import { DirectoryPage } from '@/components/content/directory-page';
import { getPublished } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Dungeons',
  description: 'AION 2 Global dungeon pages with entry details and rewards — shown only when values are verified.',
  path: '/dungeons/',
});

export default function DungeonsPage() {
  return (
    <DirectoryPage
      eyebrow="Dungeons"
      title="Dungeons"
      lead="Entry details, group size, rewards and mechanics. Requirements and loot are shown only when a current Global source confirms them."
      crumb={{ label: 'Dungeons', href: '/dungeons/' }}
      records={getPublished('dungeon')}
      noun="dungeon"
      empty={{
        title: 'No dungeon pages are verified yet',
        description:
          'Entry requirements and reward tables change between patches and regions. Each difficulty will be documented separately once it can be confirmed for Global.',
      }}
    />
  );
}
