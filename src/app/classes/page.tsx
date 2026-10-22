import { DirectoryPage } from '@/components/content/directory-page';
import { site } from '@/config/site';
import { getPublished } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Classes',
  description: 'AION 2 Global class overviews with separated PvE and PvP guidance, published only after source review.',
  path: '/classes/',
});

export default function ClassesPage() {
  return (
    <DirectoryPage
      eyebrow="Classes"
      title="Classes"
      lead="Class overviews, roles and build guidance — with PvE and PvP kept separate and every recommendation tied to its evidence."
      crumb={{ label: 'Classes', href: '/classes/' }}
      records={getPublished('class')}
      noun="class"
      empty={{
        title: 'No class pages are verified yet',
        description: `The first editorial focus is the ${site.editorialFocus} class. Class pages appear here once the official Global class list and descriptions have been checked and reviewed.`,
      }}
    />
  );
}
