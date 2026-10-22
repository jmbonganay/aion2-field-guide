'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import type { NavItem } from '@/config/site';
import { isCurrentSection } from './nav-links';

type Item = Pick<NavItem, 'label' | 'href' | 'description'>;

/**
 * Mobile navigation disclosure. `aria-expanded` on the toggle, Escape closes
 * and returns focus to the toggle, and choosing a link closes the panel.
 * Without JavaScript the footer still lists every section.
 */
export function MobileMenu({ primary, secondary }: { primary: Item[]; secondary: Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '/';
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-control text-muted hover:bg-raised hover:text-ink"
      >
        {open ? <CloseIcon className="text-xl" /> : <MenuIcon className="text-xl" />}
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>

      <div
        id="mobile-navigation"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-canvas shadow-2xl shadow-black/40"
      >
        <nav aria-label="Mobile" className="px-4 pt-3 pb-6">
          <ul className="divide-y divide-line-subtle">
            {primary.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={isCurrentSection(pathname, item.href) ? 'page' : undefined}
                  className="flex min-h-14 flex-col justify-center py-2 aria-[current=page]:text-accent-strong"
                >
                  <span className="font-display text-lg">{item.label}</span>
                  <span className="text-sm text-subtle">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-wrap gap-2">
            {secondary.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={isCurrentSection(pathname, item.href) ? 'page' : undefined}
                  className="inline-flex min-h-11 items-center rounded-control border border-line-subtle px-4 text-sm text-muted hover:text-ink aria-[current=page]:border-accent/50 aria-[current=page]:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
