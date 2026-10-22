import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SearchProvider } from '@/components/search/search-provider';
import { enabled, primaryNav, site, utilityNav } from '@/config/site';
import { SHARE_IMAGE } from '@/lib/metadata';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — an unofficial AION 2 Global companion`,
    template: `%s · ${site.name} (unofficial)`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    siteName: `${site.name} (unofficial)`,
    title: site.name,
    description: site.description,
    url: '/',
    locale: 'en_US',
    images: [SHARE_IMAGE],
  },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description, images: [SHARE_IMAGE.url] },
};

export const viewport: Viewport = {
  themeColor: '#0b1019',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const browseLinks = [...enabled(primaryNav), ...enabled(utilityNav)].map(({ label, href, description }) => ({ label, href, description }));

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.locale}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-control bg-accent px-4 py-2 font-medium text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SearchProvider browseLinks={browseLinks}>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <SiteFooter />
        </SearchProvider>
      </body>
    </html>
  );
}
