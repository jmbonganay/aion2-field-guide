import Link from 'next/link';
import { StaticPage } from '@/components/content/static-page';
import { site } from '@/config/site';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'About',
  description: `What the ${site.name} is: an independent, unofficial, read-only and free AION 2 Global reference.`,
  path: '/about/',
});

export default function AboutPage() {
  return (
    <StaticPage
      eyebrow="About"
      title="About this field guide"
      lead="An independent, fan-made reference for AION 2 Global players — read-only, free, and careful about what it claims."
      crumb={{ label: 'About', href: '/about/' }}
    >
      <h2>What it is</h2>
      <p>
        {site.name} is an unofficial companion that aims to answer three questions well: what to do next, where to get something, and which choices suit your class and goals — with the evidence for each answer visible on the page.
      </p>
      <h2>What it is not</h2>
      <ul>
        <li>Not affiliated with, endorsed by or operated by NCSOFT.</li>
        <li>Not a live database. Nothing here is “live”; every value carries the date it was verified.</li>
        <li>Not a community platform. There are no accounts, comments, uploads or purchases.</li>
      </ul>
      <h2>How it is built</h2>
      <p>
        The site is a static export: pages are generated ahead of time and served as plain files. Content lives in the project repository as reviewed text and structured records, and every build checks that published pages meet the{' '}
        <Link href="/sources/">verification standard</Link>. There is no server database, tracking or paid service.
      </p>
      <h2>Current status</h2>
      <p>
        The foundation is in place and the first research focus is the {site.editorialFocus} class. Sections stay intentionally empty until their pages pass review — the site will publish fewer, complete pages rather than many speculative ones.
      </p>
      <h2>Legal</h2>
      <p>
        Read the <Link href="/disclaimer/">disclaimer</Link> and the <Link href="/privacy/">privacy notice</Link>.
      </p>
    </StaticPage>
  );
}
