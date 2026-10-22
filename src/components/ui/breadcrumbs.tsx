import Link from 'next/link';
import { site } from '@/config/site';
import { ChevronRightIcon } from './icons';

export type Crumb = { label: string; href: string };

/** Breadcrumb trail with BreadcrumbList structured data. Last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: 'Home', href: '/' }, ...items];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: new URL(c.href, site.url).toString(),
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-subtle">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-muted">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link href={crumb.href} className="rounded-sm hover:text-ink">
                    {crumb.label}
                  </Link>
                  <ChevronRightIcon className="text-xs opacity-70" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </nav>
  );
}
