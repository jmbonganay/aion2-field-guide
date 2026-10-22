import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';
import { ExternalIcon } from '@/components/ui/icons';
import { PageHero } from '@/components/ui/page-hero';
import { publicUpdates } from '@/lib/content';
import { formatDate, plural } from '@/lib/format';
import { hrefFor, safeHref } from '@/lib/links';
import { pageMetadata } from '@/lib/metadata';
import { recordTitle } from '@/lib/schemas';

export const metadata = pageMetadata({
  title: 'Updates',
  description: 'Official AION 2 Global updates that changed pages on this site, with links to the patch notes and the pages affected.',
  path: '/updates/',
});

export default function UpdatesPage() {
  const updates = publicUpdates();
  return (
    <>
      <PageHero
        eyebrow="Updates"
        title="Updates"
        lead="Official Global updates that changed something this guide covers. Each entry links to the patch notes and to the pages it affected."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Updates', href: '/updates/' }]} />}
      >
        <p className="text-sm text-subtle">
          <span className="tabular text-ink">{plural(updates.length, 'update')}</span> · Global edition · not a complete patch archive
        </p>
      </PageHero>
      <Container className="py-12 sm:py-16">
        {updates.length ? (
          <ol className="max-w-article space-y-5">
            {updates.map(({ patch, source, affected }) => {
              const href = source ? safeHref(source.url) : null;
              return (
                <li key={patch.id} className="rounded-card border border-line-subtle bg-surface p-5 sm:p-6">
                  <p className="text-sm text-subtle">
                    {patch.label}
                    {patch.effectiveAt ? (
                      <>
                        {' · live from '}
                        <time dateTime={patch.effectiveAt}>{formatDate(patch.effectiveAt)}</time> (UTC)
                      </>
                    ) : null}
                  </p>
                  <h2 className="mt-1 text-xl sm:text-2xl">{patch.title}</h2>
                  <p className="mt-2 text-muted">{patch.summary}</p>
                  <div className="mt-4">
                    <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">Pages affected</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {affected.map((r) => (
                        <li key={r.id}>
                          <Link href={hrefFor(r)} className="inline-flex min-h-10 items-center rounded-control border border-line-subtle px-3 text-sm text-muted hover:border-accent/40 hover:text-ink">
                            {recordTitle(r)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {href ? (
                    <p className="mt-4 text-sm">
                      <a href={href} rel="noopener noreferrer" className="link inline-flex items-baseline gap-1.5">
                        Read the official patch notes
                        <ExternalIcon className="translate-y-0.5" />
                        <span className="sr-only">(external site)</span>
                      </a>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : (
          <EmptyState
            title="No reviewed updates yet"
            description="Updates appear here once a verified page they affect is published. Until then, read patch notes on the official AION 2 Global website."
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
