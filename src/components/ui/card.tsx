import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRightIcon } from './icons';

type EntryCardProps = {
  href: string;
  kind: string;
  title: string;
  summary: string;
  badges?: ReactNode;
  meta?: ReactNode;
  headingLevel?: 2 | 3;
};

/**
 * Generic record card (guide/class/dungeon/system). The whole card is one
 * link with the title as its accessible name; the summary is supporting text.
 */
export function EntryCard({ href, kind, title, summary, badges, meta, headingLevel = 3 }: EntryCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="group relative flex h-full flex-col rounded-card border border-line-subtle bg-surface p-5 transition-colors hover:border-accent/40 hover:bg-raised/70 sm:p-6">
      <p className="eyebrow text-[0.6875rem]">{kind}</p>
      <Heading className="mt-2 text-xl leading-snug">
        <Link href={href} className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none group-has-[:focus-visible]:underline">
          {title}
        </Link>
      </Heading>
      <p className="mt-2 line-clamp-3 text-[0.95rem] text-muted">{summary}</p>
      {badges ? <div className="mt-4 flex flex-wrap gap-2">{badges}</div> : null}
      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm text-subtle">
        <span>{meta}</span>
        <ArrowRightIcon className="text-accent transition-transform group-hover:translate-x-0.5" />
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card ring-2 ring-focus ring-offset-2 ring-offset-canvas opacity-0 group-has-[:focus-visible]:opacity-100"
      />
    </article>
  );
}

type CategoryCardProps = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  status: ReactNode;
};

/** Larger entry point used on the homepage. */
export function CategoryCard({ href, title, description, icon, status }: CategoryCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line-subtle bg-linear-to-b from-raised/80 to-surface p-6 transition-colors hover:border-accent/45">
      <div aria-hidden className="grid size-11 place-items-center rounded-control border border-accent/30 bg-accent/10 text-[1.375rem] text-accent-strong">
        {icon}
      </div>
      <h3 className="mt-5 text-[1.375rem]">
        <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
          {title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.95rem] text-muted">{description}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm text-subtle">
        {status}
        <ArrowRightIcon className="text-accent transition-transform group-hover:translate-x-0.5" />
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card ring-2 ring-focus ring-offset-2 ring-offset-canvas opacity-0 group-has-[:focus-visible]:opacity-100"
      />
    </article>
  );
}

export function CardGrid({ children, label }: { children: ReactNode; label: string }) {
  return (
    <ul aria-label={label} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
      {children}
    </ul>
  );
}
