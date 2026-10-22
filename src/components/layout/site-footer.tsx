import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { enabled, legalNav, primaryNav, site, utilityNav } from '@/config/site';
import { Wordmark } from './site-header';

const groups = [
  { title: 'Explore', items: enabled(primaryNav) },
  { title: 'Project', items: enabled(utilityNav) },
  { title: 'Legal', items: enabled(legalNav) },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line-subtle bg-sunken/60">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-block rounded-control">
              <Wordmark idSuffix="footer" />
              <span className="sr-only"> — home</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">{site.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed text-subtle">
              Read-only and static. No accounts, cookies, analytics or tracking.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map((group) => (
              <nav key={group.title} aria-label={`Footer — ${group.title}`}>
                <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{group.title}</h2>
                <ul className="mt-3 space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="inline-flex min-h-9 items-center text-sm text-muted hover:text-ink">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <hr className="rule-ornament my-10" />

        <div className="flex flex-col gap-4 text-xs leading-relaxed text-subtle md:flex-row md:items-start md:justify-between">
          <p className="max-w-3xl">{site.disclaimer}</p>
          <p className="shrink-0">
            <Link href="/sources/" className="hover:text-ink">
              Sources &amp; corrections
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
