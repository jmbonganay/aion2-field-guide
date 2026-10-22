'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRightIcon, CloseIcon, SearchIcon } from '@/components/ui/icons';
import { SkeletonList } from '@/components/ui/skeleton';
import type { SearchEngine, SearchHit, SearchIndexFile } from '@/lib/search';

export type BrowseLink = { label: string; href: string; description: string };

type IndexState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; engine: SearchEngine; total: number; search: typeof import('@/lib/search').searchDocuments };

const KIND_LABEL: Record<SearchHit['kind'], string> = { guide: 'Guide', class: 'Class', dungeon: 'Dungeon', system: 'System', skill: 'Skill', item: 'Item' };

let indexPromise: Promise<Exclude<IndexState, { status: 'loading' } | { status: 'error' }>> | null = null;

/** Fetch the static index and MiniSearch only when search is first opened. */
function loadIndex() {
  indexPromise ??= Promise.all([
    fetch('/search-index.json', { cache: 'force-cache' }).then((res) => {
      if (!res.ok) throw new Error(`search index request failed: ${res.status}`);
      return res.json() as Promise<SearchIndexFile>;
    }),
    import('@/lib/search'),
  ])
    .then(([file, mod]) => ({
      status: 'ready' as const,
      engine: mod.createSearchEngine(file.documents),
      total: file.documents.length,
      search: mod.searchDocuments,
    }))
    .catch((error: unknown) => {
      indexPromise = null; // allow a retry on next open
      throw error;
    });
  return indexPromise;
}

export function SearchDialog({
  onClose,
  browseLinks,
}: {
  onClose: (options: { restoreFocus: boolean }) => void;
  browseLinks: BrowseLink[];
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<IndexState>({ status: 'loading' });
  const ids = { title: useId(), list: useId(), status: useId() };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    inputRef.current?.focus();
    let cancelled = false;
    loadIndex().then(
      (ready) => !cancelled && setIndex(ready),
      () => !cancelled && setIndex({ status: 'error' }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const hits = useMemo(() => (index.status === 'ready' ? index.search(index.engine, query, 12) : []), [index, query]);
  const trimmed = query.trim();
  const activeIndex = Math.min(active, Math.max(hits.length - 1, 0));

  function go(href: string) {
    onClose({ restoreFocus: false });
    router.push(href);
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // `type="search"` would otherwise spend the first Escape clearing the text.
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose({ restoreFocus: true });
      return;
    }
    if (!hits.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((activeIndex + 1) % hits.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((activeIndex - 1 + hits.length) % hits.length);
    } else if (event.key === 'Home' && event.ctrlKey) {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End' && event.ctrlKey) {
      event.preventDefault();
      setActive(hits.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const hit = hits[activeIndex];
      if (hit) go(hit.href);
    }
  }

  const statusText =
    index.status === 'loading'
      ? 'Loading search…'
      : index.status === 'error'
        ? 'Search is unavailable right now.'
        : !trimmed
          ? ''
          : hits.length
            ? `${hits.length} result${hits.length === 1 ? '' : 's'}`
            : 'No results';

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={ids.title}
      // Escape (and any other native close) ends in the `close` event; browsers
      // may ignore preventDefault on `cancel`, so `close` is the source of truth.
      onClose={() => onClose({ restoreFocus: true })}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose({ restoreFocus: true });
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-canvas/80 backdrop:backdrop-blur-sm sm:mx-auto sm:mt-[10vh] sm:h-auto sm:max-h-[75vh] sm:w-[min(42rem,calc(100%-2rem))] sm:rounded-hero"
    >
      <div className="flex h-full max-h-[inherit] flex-col sm:h-auto overflow-hidden border-line bg-surface shadow-2xl shadow-black/50 sm:rounded-hero sm:border">
        <h2 id={ids.title} className="sr-only">
          Search the field guide
        </h2>
        <div className="flex items-center gap-3 border-b border-line-subtle px-4 sm:px-5">
          <SearchIcon className="shrink-0 text-xl text-subtle" />
          <label htmlFor={`${ids.title}-input`} className="sr-only">
            Search published pages
          </label>
          <input
            ref={inputRef}
            id={`${ids.title}-input`}
            type="search"
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls={ids.list}
            aria-autocomplete="list"
            aria-activedescendant={hits.length ? `${ids.list}-${activeIndex}` : undefined}
            aria-describedby={ids.status}
            autoComplete="off"
            spellCheck={false}
            maxLength={100}
            enterKeyHint="go"
            placeholder="Search verified guides, classes, dungeons…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-subtle focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={() => onClose({ restoreFocus: true })}
            className="-mr-2 grid size-11 shrink-0 place-items-center rounded-control text-muted hover:bg-raised hover:text-ink"
          >
            <CloseIcon className="text-xl" />
            <span className="sr-only">Close search</span>
          </button>
        </div>

        <p id={ids.status} role="status" aria-live="polite" className="sr-only">
          {statusText}
        </p>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
          {index.status === 'loading' ? <SkeletonList rows={3} label="Loading search" /> : null}

          {index.status === 'error' ? (
            <Message title="Search could not load">
              The search index failed to download. Check your connection and try again, or browse a section below.
            </Message>
          ) : null}

          {index.status === 'ready' && hits.length > 0 ? (
            <ul id={ids.list} role="listbox" aria-label="Search results" className="space-y-1">
              {hits.map((hit, i) => (
                <li
                  key={hit.id}
                  id={`${ids.list}-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseMove={() => i !== activeIndex && setActive(i)}
                  onClick={() => go(hit.href)}
                  className="cursor-pointer rounded-control border border-transparent px-3 py-2.5 aria-selected:border-accent/35 aria-selected:bg-raised"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-medium text-ink">{hit.title}</span>
                    <span className="eyebrow shrink-0 text-[0.6875rem]">
                      {KIND_LABEL[hit.kind]}
                      {hit.category && hit.category !== hit.kind ? ` · ${hit.category}` : ''}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted">{hit.excerpt}</p>
                </li>
              ))}
            </ul>
          ) : null}

          {index.status === 'ready' && hits.length === 0 ? (
            <>
              {trimmed ? (
                <Message title={`No verified pages match “${trimmed}”`}>
                  Only reviewed, source-backed pages are searchable. Try a broader term or browse a section.
                </Message>
              ) : index.total === 0 ? (
                <Message title="Nothing to search yet">
                  No pages have passed verification yet, so the index is empty. Sections will fill in as reviewed guides are published.
                </Message>
              ) : null}
              <p className="eyebrow mt-4 mb-2 px-1">Browse sections</p>
              <ul className="grid gap-1 sm:grid-cols-2">
                {browseLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => onClose({ restoreFocus: false })}
                      className="group flex min-h-11 items-center justify-between gap-3 rounded-control px-3 py-2 hover:bg-raised"
                    >
                      <span>
                        <span className="block font-medium text-ink">{link.label}</span>
                        <span className="block text-sm text-subtle">{link.description}</span>
                      </span>
                      <ArrowRightIcon className="shrink-0 text-accent" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div className="hidden items-center gap-4 border-t border-line-subtle px-5 py-3 text-xs text-subtle sm:flex">
          <span className="flex items-center gap-1.5">
            <kbd>↑</kbd>
            <kbd>↓</kbd> to move
          </span>
          <span className="flex items-center gap-1.5">
            <kbd>Enter</kbd> to open
          </span>
          <span className="flex items-center gap-1.5">
            <kbd>Esc</kbd> to close
          </span>
        </div>
      </div>
    </dialog>
  );
}

function Message({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-control border border-line-subtle bg-raised/40 px-4 py-4">
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{children}</p>
    </div>
  );
}
