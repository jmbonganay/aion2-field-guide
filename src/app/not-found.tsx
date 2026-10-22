import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="eyebrow text-center">Error 404</p>
      <h1 className="mt-3 text-center text-4xl sm:text-5xl">This page isn&apos;t in the field guide</h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted">
        It may never have existed, or it may have been withdrawn while its information is re-checked.
      </p>
      <div className="mx-auto mt-10 max-w-2xl">
        <EmptyState
          headingLevel={2}
          title="Try one of these instead"
          description="Browse a section, or use search to find a verified page."
          actions={[
            { label: 'Home', href: '/' },
            { label: 'Guides', href: '/guides/' },
            { label: 'Classes', href: '/classes/' },
            { label: 'Sources', href: '/sources/' },
          ]}
        />
      </div>
    </Container>
  );
}
