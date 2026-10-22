import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRightIcon } from './icons';

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: { label: string; href: string };
  level?: 2 | 3;
};

export function SectionHeading({ id, eyebrow, title, description, action, level = 2 }: SectionHeadingProps) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <Heading id={id} className={level === 2 ? 'text-[1.625rem] leading-tight sm:text-[2rem]' : 'text-xl sm:text-2xl'}>
          {title}
        </Heading>
        {description ? <div className="mt-2 text-muted">{description}</div> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-accent-strong hover:text-ink"
        >
          {action.label}
          <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

export function Section({
  labelledBy,
  children,
  className = '',
}: {
  labelledBy: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={labelledBy} className={`py-12 sm:py-16 ${className}`}>
      {children}
    </section>
  );
}
