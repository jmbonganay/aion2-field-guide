import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { PageHero } from '@/components/ui/page-hero';

/** Editorial page (about, policy, legal): hero + readable single column. */
export function StaticPage({
  eyebrow,
  title,
  lead,
  crumb,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  crumb: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} breadcrumbs={<Breadcrumbs items={[crumb]} />} />
      <Container className="py-12 sm:py-16">
        <div className="prose-guide max-w-article">{children}</div>
      </Container>
    </>
  );
}
