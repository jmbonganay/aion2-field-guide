'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { SearchDialog, type BrowseLink } from './search-dialog';

type SearchContextValue = { open: () => void };

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used inside <SearchProvider>');
  return ctx;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/**
 * Owns the search dialog and its global shortcuts:
 * Ctrl/Cmd+K anywhere, and `/` when focus is not in a text field.
 * Focus returns to whatever opened the dialog when it closes.
 */
export function SearchProvider({ children, browseLinks }: { children: ReactNode; browseLinks: BrowseLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsOpen(true);
  }, []);

  const close = useCallback((options: { restoreFocus: boolean }) => {
    setIsOpen(false);
    if (options.restoreFocus) {
      const opener = openerRef.current;
      requestAnimationFrame(() => opener?.focus());
    }
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      const isPaletteShortcut = (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k';
      const isSlash = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target);
      if (isPaletteShortcut || isSlash) {
        event.preventDefault();
        open();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      {isOpen ? <SearchDialog onClose={close} browseLinks={browseLinks} /> : null}
    </SearchContext.Provider>
  );
}
