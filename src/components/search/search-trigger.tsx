'use client';

import { SearchIcon } from '@/components/ui/icons';
import { useSearch } from './search-provider';

/** Header search button. Shows the shortcut on wide screens, icon-only on phones. */
export function SearchTrigger({ variant = 'header' }: { variant?: 'header' | 'icon' | 'hero' }) {
  const { open } = useSearch();

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="grid size-11 place-items-center rounded-control text-muted hover:bg-raised hover:text-ink"
      >
        <SearchIcon className="text-xl" />
        <span className="sr-only">Search</span>
      </button>
    );
  }

  if (variant === 'hero') {
    return (
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="group flex h-14 w-full max-w-xl items-center gap-3 rounded-control border border-line bg-sunken/80 px-4 text-left text-muted shadow-inner shadow-black/20 transition-colors hover:border-accent/45 hover:text-ink"
      >
        <SearchIcon className="shrink-0 text-xl text-accent" />
        <span className="flex-1 truncate">Search verified guides, classes and dungeons</span>
        <span className="hidden items-center gap-1 sm:flex" aria-hidden>
          <kbd>Ctrl</kbd>
          <kbd>K</kbd>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+K Meta+K /"
      className="flex h-10 items-center gap-2.5 rounded-control border border-line-subtle bg-sunken/70 pr-2 pl-3 text-sm text-subtle transition-colors hover:border-line hover:text-ink"
    >
      <SearchIcon className="text-base" />
      <span className="pr-6">Search</span>
      <kbd aria-hidden>/</kbd>
    </button>
  );
}
