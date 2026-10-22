'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/config/site';

export function isCurrentSection(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href);
}

/** Desktop primary navigation with `aria-current` on the active section. */
export function NavLinks({ items }: { items: Pick<NavItem, 'label' | 'href'>[] }) {
  const pathname = usePathname() ?? '/';
  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const current = isCurrentSection(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? 'page' : undefined}
              className="relative inline-flex h-10 items-center rounded-control px-3 text-[0.9375rem] text-muted transition-colors hover:text-ink aria-[current=page]:text-ink"
            >
              {item.label}
              {current ? <span aria-hidden className="absolute inset-x-3 -bottom-[0.6875rem] h-px bg-accent" /> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
