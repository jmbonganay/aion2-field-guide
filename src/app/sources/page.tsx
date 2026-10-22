import { SourceList } from '@/components/content/source-list';
import { Badge, EvidenceBadge, VerificationBadge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Note } from '@/components/ui/note';
import { PageHero } from '@/components/ui/page-hero';
import { SectionHeading } from '@/components/ui/section';
import { site } from '@/config/site';
import { getRegistrySources } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Sources & verification',
  description: 'How the AION 2 Field Guide researches, grades and verifies game information, and how to report a correction.',
  path: '/sources/',
});

const hierarchy = [
  { grade: 'official' as const, title: 'Primary — official', body: 'NCSOFT Global announcements, patch notes, current in-game UI and tooltips, and official statements.' },
  { grade: 'independent' as const, title: 'Strong secondary — independent data', body: 'Independently verifiable data with a documented method, game build, provenance and permitted use.' },
  { grade: 'firsthand' as const, title: 'Firsthand — documented testing', body: 'An in-game test with timestamp, server and region, plus screenshots or repeatable steps.' },
  { grade: 'community' as const, title: 'Community — player reports', body: 'Clearly labelled reports and discussions. Useful for forming hypotheses, never definitive on their own.' },
];

const gate = [
  'Checked for the correct game (AION 2, not the original AION), the Global service, patch and faction.',
  'Names of items, skills and dungeons cross-checked against Global in-game text or a source.',
  'Every actionable number links to a source and shows a last-verified date.',
  '“Best” advice explains the use case, trade-offs and evidence; damage claims need tests or labelled estimates.',
  'Paid or crafting recommendations check current cost, limits, success rates and transfer rules.',
  'Dates and times name their region or time zone and where they were published.',
  'A reviewer other than the author approves high-impact content.',
  'No copied passages, ripped images or unapproved map assets; links checked; no placeholder text.',
];

export default function SourcesPage() {
  const sources = getRegistrySources();
  return (
    <>
      <PageHero
        eyebrow="Sources & verification"
        title="How information gets onto this site"
        lead="A beautiful guide that is wrong is a failed guide. This is the standard every published page has to meet, and the record of where research starts."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Sources', href: '/sources/' }]} />}
      />

      <Container className="py-12 sm:py-16">
        <div className="max-w-article space-y-16">
          <section aria-labelledby="hierarchy-heading">
            <SectionHeading id="hierarchy-heading" eyebrow="Evidence grades" title="Not all sources are equal" description="Each source is graded. The grade is shown wherever the source is cited." />
            <ol className="mt-6 space-y-3">
              {hierarchy.map((h, i) => (
                <li key={h.grade} className="flex gap-4 rounded-card border border-line-subtle bg-surface p-5">
                  <span aria-hidden className="font-display text-2xl leading-none text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg">{h.title}</h3>
                      <EvidenceBadge grade={h.grade} />
                    </div>
                    <p className="mt-1.5 text-[0.95rem] text-muted">{h.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <Note tone="warning" title="Never enough on their own">
                AI summaries, unsourced aggregator copy, old conversation answers, information from the Korean or Taiwanese services presented as Global, and guesses.
              </Note>
            </div>
          </section>

          <section aria-labelledby="claims-heading">
            <SectionHeading id="claims-heading" eyebrow="Claim labels" title="How claims are labelled" />
            <dl className="mt-6 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                <dt className="w-32 shrink-0"><VerificationBadge verification="confirmed" /></dt>
                <dd className="text-muted">Checked against a cited source for the stated region and patch.</dd>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                <dt className="w-32 shrink-0"><VerificationBadge verification="reported" /></dt>
                <dd className="text-muted">Reported by a source but not independently confirmed. Always shown with who reported it.</dd>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                <dt className="w-32 shrink-0"><VerificationBadge verification="disputed" /></dt>
                <dd className="text-muted">Sources disagree. Disputed claims are never used for a definitive recommendation.</dd>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                <dt className="w-32 shrink-0"><Badge tone="accent">Editorial</Badge></dt>
                <dd className="text-muted">An editorial recommendation, as opposed to a game mechanic, with its reasoning and alternatives.</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="gate-heading">
            <SectionHeading id="gate-heading" eyebrow="Publication gate" title="Every item must pass before a page is published" />
            <ul className="mt-6 space-y-3">
              {gate.map((item) => (
                <li key={item} className="flex gap-3 text-muted">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-muted">
              The site build enforces the mechanical parts of this gate: a page cannot be published without a reviewer, a verification date and resolvable sources, and drafts never reach navigation, search or the sitemap.
            </p>
          </section>

          <section aria-labelledby="registry-heading">
            <SectionHeading
              id="registry-heading"
              eyebrow="Source registry"
              title="Where research starts"
              description="Reference locations checked as reachable. Being listed here does not verify any specific drop, stat, build or requirement — each claim is cited separately on its own page."
            />
            <div className="mt-6">
              <SourceList sources={sources} showScope />
            </div>
          </section>

          <section aria-labelledby="corrections-heading" id="corrections" className="scroll-mt-24">
            <SectionHeading id="corrections-heading" eyebrow="Corrections" title="Reporting a mistake" />
            <div className="mt-4 space-y-4 text-muted">
              <p>
                Useful reports include the page URL, the exact claim, your evidence (a screenshot or link), the region, the patch and the date you checked. Accepted corrections are recorded in the project&apos;s Git history, and the page&apos;s “Last verified” date only changes when the evidence is re-checked.
              </p>
              {site.correctionsUrl ? (
                <p>
                  <a className="link" href={site.correctionsUrl} rel="noopener noreferrer">Open the corrections tracker</a>. It is reviewed by maintainers, but not continuously monitored.
                </p>
              ) : (
                <Note tone="verify" title="Corrections channel not yet open">
                  A public issue tracker will be linked here once the project repository is published. There are no comment forms on this site, and none will collect your email.
                </Note>
              )}
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
