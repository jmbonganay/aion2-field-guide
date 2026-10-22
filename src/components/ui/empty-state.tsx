import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRightIcon, CompassIcon } from './icons';

type EmptyStateProps = {
  title: string;
  description: ReactNode;
  actions?: { label: string; href: string }[];
  icon?: ReactNode;
  headingLevel?: 2 | 3;
};

/** Honest empty state: says what is missing and why, then offers a way forward. */
export function EmptyState({ title, description, actions = [], icon, headingLevel = 2 }: EmptyStateProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className="relative overflow-hidden rounded-card border border-dashed border-line bg-surface/60 px-6 py-10 text-center sm:px-10 sm:py-14">
      <div aria-hidden className="mx-auto grid size-14 place-items-center rounded-full border border-line bg-raised text-2xl text-accent">
        {icon ?? <CompassIcon />}
      </div>
      <Heading className="mx-auto mt-5 max-w-xl text-xl sm:text-2xl">{title}</Heading>
      <div className="mx-auto mt-3 max-w-xl text-muted">{description}</div>
      {actions.length ? (
        <ul className="mt-6 flex flex-wrap justify-center gap-3">
          {actions.map((a, i) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className={`inline-flex min-h-11 items-center gap-2 rounded-control border px-4 text-sm font-medium transition-colors ${
                  i === 0
                    ? 'border-accent/50 bg-accent/10 text-accent-strong hover:bg-accent/20'
                    : 'border-line text-muted hover:border-accent/40 hover:text-ink'
                }`}
              >
                {a.label}
                <ArrowRightIcon />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
