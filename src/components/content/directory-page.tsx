import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHero } from '@/components/ui/page-hero';
import { plural } from '@/lib/format';
import type { RecordOfKind, RoutableKind } from '@/lib/schemas';
import { buildFacets, facetValues } from '@/lib/facets';
import { FilterableGrid } from './filterable-grid';
import { RecordCard } from './record-card';

type DirectoryPageProps = {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  crumb: { label: string; href: string };
  records: RecordOfKind<RoutableKind>[];
  noun: string;
  empty: { title: string; description: ReactNode };
};

/** Index template: hero -> filters (when supported by data) -> verified list, or an honest empty state. */
export function DirectoryPage({ eyebrow, title, lead, crumb, records, noun, empty }: DirectoryPageProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} breadcrumbs={<Breadcrumbs items={[crumb]} />}>
        <p className="text-sm text-subtle">
          <span className="tabular text-ink">{plural(records.length, `verified ${noun}`)}</span> · Global edition
        </p>
      </PageHero>
      <Container className="py-12 sm:py-16">
        {records.length ? (
          <>
          <h2 className="sr-only">All verified {noun}s</h2>
          <FilterableGrid
            label={title}
            noun={noun}
            facets={buildFacets(records)}
            entries={records.map((record) => ({ id: record.id, values: facetValues(record), card: <RecordCard record={record} /> }))}
          />
          </>
        ) : (
          <EmptyState
            title={empty.title}
            description={empty.description}
            actions={[
              { label: 'How we verify', href: '/sources/' },
              { label: 'Back to home', href: '/' },
            ]}
          />
        )}
      </Container>
    </>
  );
}
