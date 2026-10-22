import { evaluate } from '@mdx-js/mdx';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import { Note } from '@/components/ui/note';
import type { RecordEvidence } from '@/lib/content';
import { formatFactValue } from '@/lib/format';
import { safeHref } from '@/lib/links';
import { slugifyHeading } from '@/lib/mdx-analysis';
import { sourceAnchor } from './source-list';

/**
 * Internal links are checked against the routes that will exist: a link to a
 * page that isn't published yet renders as plain text (it becomes a link
 * automatically once that page passes review). `isLinkable` is omitted in
 * dev previews, where every link renders.
 */
function makeLink(isLinkable?: (path: string) => boolean) {
  return function MdxLink({ href = '', children, ...rest }: ComponentProps<'a'>) {
    const safe = safeHref(href);
    if (!safe) return <span>{children}</span>;
    if (safe.startsWith('/')) {
      if (isLinkable && !isLinkable(safe)) return <span>{children}</span>;
      return <Link href={safe}>{children}</Link>;
    }
    if (safe.startsWith('#')) return <a href={safe}>{children}</a>;
    return (
      <a href={safe} rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (external site)</span>
      </a>
    );
  };
}

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node && typeof node === 'object' && 'props' in node) return textOf((node.props as { children?: ReactNode }).children);
  return '';
}

const heading = (Tag: 'h2' | 'h3') =>
  function MdxHeading({ children }: { children?: ReactNode }) {
    return <Tag id={slugifyHeading(textOf(children))}>{children}</Tag>;
  };

/** GFM tables scroll inside their own container so the page never overflows. */
function MdxTable(props: ComponentProps<'table'>) {
  return (
    <div className="overflow-x-auto rounded-card border border-line-subtle bg-surface" tabIndex={0} role="region" aria-label="Table">
      <table {...props} className="min-w-[32rem]" />
    </div>
  );
}

/** A name that contains digits (e.g. a skill specialty) — exempt from the uncited-number check. */
function Term({ children }: { children?: ReactNode }) {
  return <span className="font-medium text-ink">{children}</span>;
}

/**
 * Binds `<Fact id>` and `<Cite id>` to this page's evidence so prose can only
 * show values that exist as fact records, each with a numbered citation.
 */
function evidenceComponents(evidence: RecordEvidence) {
  const sourceNumber = new Map(evidence.sources.map((s, i) => [s.id, i + 1]));
  const factById = new Map(evidence.facts.map((f) => [f.id, f]));

  function Citations({ ids }: { ids: string[] }) {
    return (
      <sup className="ml-0.5 whitespace-nowrap">
        {ids.map((id) => (
          <a key={id} href={`#${sourceAnchor(id)}`} className="no-underline! text-accent hover:text-accent-strong" aria-label={`Source ${sourceNumber.get(id) ?? ''}`}>
            [{sourceNumber.get(id) ?? '?'}]
          </a>
        ))}
      </sup>
    );
  }

  function Fact({ id, label }: { id: string; label?: string }) {
    const fact = factById.get(id);
    if (!fact) return <span className="text-danger">[missing fact {id}]</span>;
    return (
      <span className="whitespace-normal">
        <strong className="tabular font-semibold text-ink">{label ?? formatFactValue(fact)}</strong>
        {fact.verification !== 'confirmed' ? <span className="ml-1 text-xs font-semibold text-warning uppercase">({fact.verification})</span> : null}
        <Citations ids={fact.sourceIds} />
      </span>
    );
  }

  function Cite({ id }: { id: string }) {
    return <Citations ids={[id]} />;
  }

  return { Fact, Cite };
}

/**
 * Compiles an MDX body at build time (Server Component, static export).
 * MDX is trusted repository content reviewed in Git — never visitor input.
 */
export async function MdxContent({
  source,
  evidence,
  isLinkable,
}: {
  source: string;
  evidence: RecordEvidence;
  isLinkable?: (path: string) => boolean;
}) {
  const { default: Content } = await evaluate(source, { ...runtime, baseUrl: import.meta.url, remarkPlugins: [remarkGfm] });
  const components = { a: makeLink(isLinkable), table: MdxTable, h2: heading('h2'), h3: heading('h3'), Note, Term, ...evidenceComponents(evidence) };
  return (
    <div className="prose-guide">
      <Content components={components} />
    </div>
  );
}
