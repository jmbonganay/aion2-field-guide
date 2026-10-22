/**
 * DEV-ONLY design preview (`next dev` only — `*.dev.tsx` is excluded from
 * `next build`, see next.config.ts). Renders components with explicit
 * design fixtures for layout review. Nothing here is game data.
 */
import type { Metadata } from 'next';
import { RecordCard } from '@/components/content/record-card';
import { SourceList } from '@/components/content/source-list';
import { FactTable } from '@/components/content/fact-table';
import { Badge, EvidenceBadge, ModeTag, RegionTag, StatusBadge, VerificationBadge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { CardGrid } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';
import { Note } from '@/components/ui/note';
import { SectionHeading } from '@/components/ui/section';
import { SkeletonList } from '@/components/ui/skeleton';
import { loadDesignFixtures } from '@/lib/fixtures';
import { isRoutable } from '@/lib/schemas';
import { FilterableGrid } from '@/components/content/filterable-grid';
import { buildFacets, facetValues } from '@/lib/facets';

export const metadata: Metadata = { title: 'Design preview (dev only)', robots: { index: false, follow: false } };

export default function DesignPreviewPage() {
  const { bundle, issues } = loadDesignFixtures();
  const cardRecords = bundle.records.filter(isRoutable);

  return (
    <Container className="space-y-14 py-10">
      <Breadcrumbs items={[{ label: 'Design preview', href: '/design-preview/' }]} />
      <h1 className="text-4xl sm:text-5xl">Design preview</h1>
      <Note tone="fixture">
        Local development only. Every record on this page is an invented layout sample from <code>src/content/fixtures/</code>. It is never built,
        published, indexed or searchable. {issues.length ? `Fixture issues: ${issues.map((i) => i.message).join('; ')}` : null}
      </Note>

      <section aria-labelledby="type-heading" className="space-y-4">
        <SectionHeading id="type-heading" eyebrow="Typography" title="Display serif with a system sans body" description="H1 52px → H2 32px → H3 24px; body 17px / 1.65." />
        <div className="space-y-3 rounded-card border border-line-subtle bg-surface p-6">
          <p className="eyebrow">Eyebrow label</p>
          <p className="font-display text-5xl">Display heading</p>
          <p className="font-display text-[2rem]">Section heading</p>
          <p className="font-display text-2xl">Subsection heading</p>
          <p className="max-w-measure text-muted">
            Body copy sits at a comfortable measure. Muted text is used for supporting copy; subtle text for metadata. <a className="link" href="#type-heading">Inline links</a> use the bronze accent.
          </p>
          <p className="tabular text-subtle">Tabular numerals: 0123456789</p>
        </div>
      </section>

      <section aria-labelledby="badges-heading" className="space-y-4">
        <SectionHeading id="badges-heading" eyebrow="Badges" title="Every status has a text label" />
        <div className="flex flex-wrap gap-2 rounded-card border border-line-subtle bg-surface p-6">
          <RegionTag region="global" />
          <RegionTag region="kr" />
          <ModeTag mode="pve" />
          <ModeTag mode="pvp" />
          {(['draft', 'in_review', 'published', 'stale', 'archived'] as const).map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
          {(['official', 'firsthand', 'independent', 'community'] as const).map((g) => (
            <EvidenceBadge key={g} grade={g} />
          ))}
          {(['confirmed', 'reported', 'disputed'] as const).map((v) => (
            <VerificationBadge key={v} verification={v} />
          ))}
          <Badge tone="accent">Editorial</Badge>
        </div>
      </section>

      <section aria-labelledby="notes-heading" className="space-y-4">
        <SectionHeading id="notes-heading" eyebrow="Notes" title="Callouts" />
        <div className="grid gap-4 md:grid-cols-2">
          <Note tone="info">Neutral information or applicability.</Note>
          <Note tone="warning">Irreversible actions, costs or chance rolls — when verified.</Note>
          <Note tone="verify">Draft-only marker for claims still being checked.</Note>
          <Note tone="fixture">Marks non-public design fixtures.</Note>
        </div>
      </section>

      <section aria-labelledby="cards-heading" className="space-y-4">
        <SectionHeading id="cards-heading" eyebrow="Cards" title="Record cards (fixture data)" />
        <CardGrid label="Fixture cards">
          {cardRecords.map((r) => (
            <li key={r.id}>
              <RecordCard record={r} href={r.kind === 'guide' ? '/design-preview/guide/' : '/design-preview/'} />
            </li>
          ))}
        </CardGrid>
      </section>

      <section aria-labelledby="filters-heading" className="space-y-4">
        <SectionHeading id="filters-heading" eyebrow="Filters" title="Directory filters (fixture data)" description="Shown only for dimensions with two or more values among published records." />
        <FilterableGrid
          label="Fixture directory"
          noun="record"
          facets={buildFacets(cardRecords)}
          entries={cardRecords.map((r) => ({ id: r.id, values: facetValues(r), card: <RecordCard record={r} href="/design-preview/" /> }))}
        />
      </section>

      <section aria-labelledby="evidence-heading" className="space-y-4">
        <SectionHeading id="evidence-heading" eyebrow="Evidence" title="Fact table and source list (fixture data)" />
        <FactTable facts={bundle.facts} sources={bundle.sources} caption="Fixture facts" />
        <SourceList sources={bundle.sources} showScope />
      </section>

      <section aria-labelledby="states-heading" className="space-y-4">
        <SectionHeading id="states-heading" eyebrow="States" title="Loading and empty states" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-line-subtle bg-surface p-5">
            <SkeletonList rows={3} label="Loading sample" />
          </div>
          <EmptyState headingLevel={3} title="No verified guides match this filter" description="Clear the filter to see every verified guide." actions={[{ label: 'Reset filters', href: '/design-preview/' }]} />
        </div>
      </section>
    </Container>
  );
}
