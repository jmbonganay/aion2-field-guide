import { StaticPage } from '@/components/content/static-page';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Privacy',
  description: 'This site has no accounts, cookies, analytics or tracking. Here is exactly what it does and does not do.',
  path: '/privacy/',
});

export default function PrivacyPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Privacy"
      lead="Short version: this site does not collect anything about you."
      crumb={{ label: 'Privacy', href: '/privacy/' }}
    >
      <h2>What this site does not do</h2>
      <ul>
        <li>No accounts, sign-ups, forms or comments.</li>
        <li>No cookies, analytics, advertising or tracking scripts.</li>
        <li>No search logging. Search runs entirely in your browser against a file downloaded with the site.</li>
        <li>No browser storage is currently used. If a “saved on this device” feature is added later, it will be labelled where it appears and described here.</li>
      </ul>
      <h2>Hosting</h2>
      <p>
        The site is served as static files by a hosting provider. Like any web host, the provider may process standard technical request data (such as IP address and browser type) to deliver and protect the site, under its own privacy policy. The maintainers do not use that data to track visitors.
      </p>
      <h2>External links</h2>
      <p>
        Source citations link to other websites, which have their own privacy practices. Links open only when you choose them; nothing on this site loads third-party content automatically.
      </p>
      <h2>Changes</h2>
      <p>If the site&apos;s behaviour changes in a way that affects privacy, this page will be updated first.</p>
    </StaticPage>
  );
}
