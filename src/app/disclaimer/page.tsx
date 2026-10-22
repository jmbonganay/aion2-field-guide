import { StaticPage } from '@/components/content/static-page';
import { site } from '@/config/site';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Disclaimer',
  description: `${site.name} is an independent, unofficial fan site and is not affiliated with or endorsed by NCSOFT.`,
  path: '/disclaimer/',
});

export default function DisclaimerPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Disclaimer"
      lead="An unofficial fan project. Please read this before relying on anything here."
      crumb={{ label: 'Disclaimer', href: '/disclaimer/' }}
    >
      <h2>Unofficial fan site</h2>
      <p>{site.disclaimer}</p>
      <h2>Names, marks and artwork</h2>
      <p>
        Game names are used only to identify what this guide is about. The site&apos;s logo, illustrations and icons are original works made for this project; no official logos, artwork, icons, screenshots or maps are used. If assets from rights holders are ever used, their permission and attribution will be recorded first.
      </p>
      <h2>Accuracy and updates</h2>
      <p>
        Game updates can change or invalidate guidance at any time, and results such as drops can vary. Each page shows its region, patch and the date its evidence was last verified — check important details in the game and in official announcements, especially before spending premium currency or making irreversible upgrades.
      </p>
      <h2>No warranty</h2>
      <p>
        The site is provided free and as-is, without guarantees of completeness or future accuracy. The maintainers aren&apos;t responsible for in-game outcomes based on its content.
      </p>
    </StaticPage>
  );
}
