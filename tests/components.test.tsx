import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Badge, EvidenceBadge, StatusBadge, VerificationBadge } from '@/components/ui/badge';
import { SourceList } from '@/components/content/source-list';
import { EmptyState } from '@/components/ui/empty-state';
import { Note } from '@/components/ui/note';
import { source } from './helpers';

const html = (node: React.ReactElement) => renderToStaticMarkup(node);

describe('components', () => {
  it('badges always carry a text label (never colour only)', () => {
    expect(html(<StatusBadge status="published" />)).toContain('Verified');
    expect(html(<StatusBadge status="stale" />)).toContain('Needs re-check');
    expect(html(<EvidenceBadge grade="community" />)).toContain('Community report');
    expect(html(<VerificationBadge verification="disputed" />)).toContain('Disputed');
    expect(html(<Badge>Label</Badge>)).toMatch(/aria-hidden="true"[^>]*><\/span>Label/);
  });

  it('notes render their tone as text', () => {
    expect(html(<Note tone="warning">x</Note>)).toContain('Important');
    expect(html(<Note tone="verify">x</Note>)).toContain('Verification pending');
  });

  it('source list links safely and marks external links for screen readers', () => {
    const out = html(<SourceList sources={[source()]} />);
    expect(out).toContain('href="https://example.org/test"');
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).toContain('(external site)');
    expect(out).toContain('Retrieved');
  });

  it('source list has an explicit empty message', () => {
    expect(html(<SourceList sources={[]} />)).toContain('No sources are recorded');
  });

  it('empty state renders heading and actions', () => {
    const out = html(<EmptyState title="Nothing yet" description="Why" actions={[{ label: 'Go', href: '/' }]} />);
    expect(out).toContain('<h2');
    expect(out).toContain('Nothing yet');
    expect(out).toContain('href="/"');
  });
});

describe('formatFactValue', () => {
  it('joins names with commas and longer phrases with semicolons', async () => {
    const { formatFactValue } = await import('@/lib/format');
    expect(formatFactValue({ value: ['Elyos', 'Asmodians', 'Balaur'] })).toBe('Elyos, Asmodians, Balaur');
    expect(formatFactValue({ value: ['In a village, not a dungeon', 'Not in a Legion at all'] })).toBe('In a village, not a dungeon; Not in a Legion at all');
    expect(formatFactValue({ value: 2600, unit: 'item level' })).toBe('2,600 item level');
  });
});
