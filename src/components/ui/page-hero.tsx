import type { ReactNode } from 'react';
import { HeroPattern } from '@/components/layout/brand';
import { Container } from './container';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
};

/** Index-page hero: breadcrumb, eyebrow, H1, lead and optional meta row. */
export function PageHero({ eyebrow, title, lead, breadcrumbs, children }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-line-subtle">
      <HeroPattern className="pointer-events-none absolute -top-10 right-[-6rem] hidden h-[26rem] w-[40rem] opacity-60 md:block" />
      <Container className="relative pt-8 pb-10 sm:pt-10 sm:pb-14">
        {breadcrumbs}
        <p className="eyebrow mt-6">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-[2.25rem] leading-[1.1] sm:text-5xl">{title}</h1>
        <div className="mt-4 max-w-2xl text-lg text-muted">{lead}</div>
        {children ? <div className="mt-6">{children}</div> : null}
      </Container>
    </div>
  );
}
