import Link from 'next/link';
import type { ReactNode } from 'react';
import { ModeTag, RegionTag, StatusBadge } from '@/components/ui/badge';
import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { CardGrid } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Note } from '@/components/ui/note';
import { site } from '@/config/site';
import type { RecordEvidence } from '@/lib/content';
import { extractHeadings } from '@/lib/mdx-analysis';
import { recordTitle, type ContentRecord, type RecordOfKind, type RoutableKind } from '@/lib/schemas';
import { ItemList, PatchHistory, SkillList } from './embedded-records';
import { FactTable } from './fact-table';
import { recordKindLabel, RecordCard } from './record-card';
import { SourceList } from './source-list';
import { VerificationMeta } from './verification-meta';

type DetailTemplateProps = {
  record: ContentRecord;
  evidence: RecordEvidence;
  crumbs: Crumb[];
  children?: ReactNode;
  /** Shown above the title on non-public previews (fixtures, review queue). */
  banner?: ReactNode;
  /** Override related links (dev previews, whose records have no public routes). */
  relatedHref?: (record: RecordOfKind<RoutableKind>) => string;
  /** Review preview: show statuses and fact provenance. */
  review?: boolean;
};

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl sm:text-[1.75rem]">
      {children}
    </h2>
  );
}

/**
 * Detail page composition (docs/02-SITEMAP.md "Page hierarchy patterns"):
 * breadcrumb -> title -> applicability badges -> concise answer -> body ->
 * skills/items -> evidence -> open questions -> patch history -> sources ->
 * related -> corrections, with a sticky verification rail.
 */
export function DetailTemplate({ record, evidence, crumbs, children, banner, relatedHref, review = false }: DetailTemplateProps) {
  const headings = children ? extractHeadings(record.body).filter((h) => h.depth === 2) : [];
  const sourceNumber = new Map(evidence.sources.map((s, i) => [s.id, i + 1]));
  const subjectNames = new Map([...evidence.skills, ...evidence.items].map((r) => [r.id, recordTitle(r)]));
  const sections = [
    ...headings.map((h) => ({ id: h.id, label: h.text })),
    evidence.skills.length ? { id: 'skills', label: 'Skills' } : null,
    evidence.items.length ? { id: 'items', label: 'Items' } : null,
    evidence.facts.length ? { id: 'facts', label: 'Facts & evidence' } : null,
    record.unverified.length ? { id: 'unverified', label: 'Not yet verified' } : null,
    evidence.patches.length ? { id: 'patches', label: 'Patch history' } : null,
    { id: 'sources', label: 'Sources' },
    evidence.related.length ? { id: 'related', label: 'Related' } : null,
    { id: 'corrections', label: 'Corrections' },
  ].filter((s): s is { id: string; label: string } => Boolean(s));

  return (
    <Container className="pt-8 pb-16 sm:pt-10">
      <Breadcrumbs items={crumbs} />
      {banner ? <div className="mt-6">{banner}</div> : null}

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-14">
        <article aria-labelledby="page-title" className="min-w-0">
          <header className="max-w-article">
            <p className="eyebrow">{recordKindLabel(record)}</p>
            <h1 id="page-title" className="mt-3 text-[2.125rem] leading-[1.12] sm:text-[2.75rem]">
              {recordTitle(record)}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <RegionTag region={record.region} />
              {record.kind === 'guide' && record.mode ? <ModeTag mode={record.mode} /> : null}
              <StatusBadge status={record.status} />
            </div>
            <p className="mt-5 text-lg leading-relaxed text-muted">{record.summary}</p>
            {record.kind === 'guide' && record.applicability ? (
              <div className="mt-6">
                <Note tone="info" title="Who this applies to">
                  {record.applicability}
                </Note>
              </div>
            ) : null}
          </header>

          {children ? (
            <section aria-label={`${recordTitle(record)} — main content`} className="mt-10 max-w-article">
              {children}
            </section>
          ) : null}

          {evidence.skills.length ? (
            <section aria-labelledby="skills" className="mt-14">
              <H2 id="skills">Skills</H2>
              <p className="mt-2 max-w-article text-muted">Only skills named in cited Global sources are listed. This is not a complete skill list.</p>
              <div className="mt-5">
                <SkillList skills={evidence.skills} facts={evidence.facts} showStatus={review} />
              </div>
            </section>
          ) : null}

          {evidence.items.length ? (
            <section aria-labelledby="items" className="mt-14">
              <H2 id="items">Items</H2>
              <p className="mt-2 max-w-article text-muted">Items mentioned on this page, with only the attributes a source states.</p>
              <div className="mt-5">
                <ItemList items={evidence.items} facts={evidence.facts} showStatus={review} />
              </div>
            </section>
          ) : null}

          {evidence.facts.length ? (
            <section aria-labelledby="facts" className="mt-14">
              <H2 id="facts">Facts &amp; evidence</H2>
              <p className="mt-2 max-w-article text-muted">
                Every number and actionable claim on this page is stored once as a fact record, with its own sources and verification date.
              </p>
              <div className="mt-5">
                <FactTable facts={evidence.facts} sources={evidence.sources} caption={`Facts cited by ${recordTitle(record)}`}
                  showProvenance={review}
                  subjectId={record.id}
                  subjectNames={subjectNames}
                />
              </div>
            </section>
          ) : null}

          {record.unverified.length ? (
            <section aria-labelledby="unverified" className="mt-14 max-w-article">
              <H2 id="unverified">Not yet verified</H2>
              <p className="mt-2 text-muted">Questions the cited sources do not answer. They are left open rather than guessed.</p>
              <ul className="mt-4 space-y-2">
                {record.unverified.map((q) => (
                  <li key={q} className="flex gap-3 text-muted">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full border border-warning" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {evidence.patches.length ? (
            <section aria-labelledby="patches" className="mt-14 max-w-article">
              <H2 id="patches">Patch history</H2>
              <div className="mt-5">
                <PatchHistory patches={evidence.patches} sourceNumber={sourceNumber} />
              </div>
            </section>
          ) : null}

          <section aria-labelledby="sources" className="mt-14 max-w-article">
            <H2 id="sources">Sources</H2>
            <div className="mt-5">
              <SourceList sources={evidence.sources} />
            </div>
          </section>

          {evidence.related.length ? (
            <section aria-labelledby="related" className="mt-14">
              <H2 id="related">Related</H2>
              <div className="mt-5">
                <CardGrid label="Related pages">
                  {evidence.related.map((r) => (
                    <li key={r.id}>
                      <RecordCard record={r} href={relatedHref?.(r)} showStatus={review} />
                    </li>
                  ))}
                </CardGrid>
              </div>
            </section>
          ) : null}

          <section aria-labelledby="corrections" className="mt-14 max-w-article">
            <H2 id="corrections">Spotted a mistake?</H2>
            <p className="mt-3 text-muted">
              {site.correctionsUrl ? (
                <>
                  Report it on the{' '}
                  <a className="link" href={site.correctionsUrl} rel="noopener noreferrer">
                    public corrections tracker
                  </a>{' '}
                  with the page URL, the claim, your evidence (screenshot or link), region, patch and date.
                </>
              ) : (
                <>
                  A public corrections channel will be linked here once the project repository is published. Read{' '}
                  <Link className="link" href="/sources/#corrections">
                    how corrections are handled
                  </Link>
                  .
                </>
              )}
            </p>
          </section>
        </article>

        <aside aria-label="Page details" className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto">
          <div className="space-y-6">
            <VerificationMeta record={record} sourceCount={evidence.sources.length} />
            <nav aria-label="On this page" className="hidden rounded-card border border-line-subtle p-5 lg:block">
              <p className="font-sans text-sm font-semibold tracking-wide text-muted uppercase">On this page</p>
              <ul className="mt-3 space-y-0.5 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="inline-flex min-h-9 items-center leading-snug text-muted hover:text-ink">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </Container>
  );
}
