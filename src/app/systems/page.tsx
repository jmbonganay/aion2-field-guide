import { DirectoryPage } from '@/components/content/directory-page';
import { getPublished } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Systems',
  description: 'Plain-language explanations of AION 2 Global progression and character systems, backed by cited sources.',
  path: '/systems/',
});

export default function SystemsPage() {
  return (
    <DirectoryPage
      eyebrow="Systems"
      title="Systems"
      lead="How progression and character systems work, what each choice costs, and which consequences are irreversible — explained from verified evidence."
      crumb={{ label: 'Systems', href: '/systems/' }}
      records={getPublished('system')}
      noun="system"
      empty={{
        title: 'No system explainers are verified yet',
        description:
          'System pages will cover costs, limits and irreversible actions only where official notes or documented in-game checks support them.',
      }}
    />
  );
}
