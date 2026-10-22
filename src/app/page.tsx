import Link from 'next/link';
import { HeroIllustration } from '@/components/layout/brand';
import { RecordCard } from '@/components/content/record-card';
import { SearchTrigger } from '@/components/search/search-trigger';
import { CardGrid, CategoryCard } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';
import { BookIcon, ClockIcon, CrestIcon, GateIcon, LayersIcon, NodesIcon, ShieldCheckIcon } from '@/components/ui/icons';
import { Section, SectionHeading } from '@/components/ui/section';
import { site } from '@/config/site';
import { getPublished } from '@/lib/content';
import { plural } from '@/lib/format';
import type { EntityKind } from '@/lib/schemas';

const categories: { kind: EntityKind; title: string; href: string; description: string; icon: React.ReactNode; noun: string }[] = [
  { kind: 'guide', title: 'Guides', href: '/guides/', description: 'Step-by-step answers with sources beside the steps that need them.', icon: <BookIcon />, noun: 'guide' },
  { kind: 'class', title: 'Classes', href: '/classes/', description: 'Roles, priorities and builds, with PvE and PvP kept separate.', icon: <CrestIcon />, noun: 'class page' },
  { kind: 'dungeon', title: 'Dungeons', href: '/dungeons/', description: 'Entry details, rewards and mechanics, per difficulty.', icon: <GateIcon />, noun: 'dungeon' },
  { kind: 'system', title: 'Systems', href: '/systems/', description: 'Progression systems, costs and irreversible choices explained.', icon: <NodesIcon />, noun: 'system' },
];

const principles = [
  { icon: <LayersIcon />, title: 'Sourced', body: 'Every number and actionable claim is stored as a fact record linked to its sources.' },
  { icon: <ShieldCheckIcon />, title: 'Reviewed', body: 'A second editor checks the evidence before anything is marked verified.' },
  { icon: <ClockIcon />, title: 'Dated', body: '“Last verified” is shown separately from “Updated”, with the region and patch.' },
];

export default function HomePage() {
  const featured = getPublished('guide').slice(0, 3);

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-line-subtle">
        <Container className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-12 sm:py-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:py-24">
          <div>
            <p className="eyebrow">Unofficial companion · AION 2 Global</p>
            <h1 className="mt-4 text-[2.5rem] leading-[1.05] sm:text-[3.25rem] lg:text-[3.5rem]">
              A field guide built on evidence, not guesswork.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">
              Readable answers for Global players. Each published page shows where its information came from, which region it applies to and when it was last checked.
            </p>
            <div className="mt-8">
              <SearchTrigger variant="hero" />
            </div>
            <p className="mt-4 text-sm text-subtle">
              Press <kbd>/</kbd> or <kbd>Ctrl</kbd> <kbd>K</kbd> to search from any page.
            </p>
          </div>
          <div className="relative mx-auto hidden w-full max-w-[34rem] md:block">
            <HeroIllustration className="h-auto w-full" />
          </div>
        </Container>
      </div>

      <Container>
        {/* Categories */}
        <Section labelledBy="explore-heading">
          <SectionHeading id="explore-heading" eyebrow="Explore" title="Find what you need" description="Four sections, each published one verified page at a time." />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {categories.map((c) => {
              const count = getPublished(c.kind).length;
              return (
                <li key={c.href}>
                  <CategoryCard
                    href={c.href}
                    title={c.title}
                    description={c.description}
                    icon={c.icon}
                    status={<span>{count ? plural(count, `verified ${c.noun}`) : 'In research — none verified yet'}</span>}
                  />
                </li>
              );
            })}
          </ul>
        </Section>

        <hr className="rule-ornament" />

        {/* Featured verified guides */}
        <Section labelledBy="featured-heading">
          <SectionHeading
            id="featured-heading"
            eyebrow="Featured"
            title="Verified guides"
            action={featured.length ? { label: 'All guides', href: '/guides/' } : undefined}
          />
          <div className="mt-8">
            {featured.length ? (
              <CardGrid label="Featured verified guides">
                {featured.map((g) => (
                  <li key={g.id}>
                    <RecordCard record={g} />
                  </li>
                ))}
              </CardGrid>
            ) : (
              <EmptyState
                headingLevel={3}
                icon={<ShieldCheckIcon />}
                title="Nothing has passed verification yet"
                description={
                  <>
                    The site is in its foundation phase. The first guides — starting with the {site.editorialFocus} class — will appear here only after their sources are checked and a second editor signs off.
                  </>
                }
                actions={[{ label: 'See how pages are verified', href: '/sources/' }, { label: 'About this project', href: '/about/' }]}
              />
            )}
          </div>
        </Section>

        <hr className="rule-ornament" />

        {/* Principles */}
        <Section labelledBy="principles-heading" className="pb-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <SectionHeading
              id="principles-heading"
              eyebrow="Our standard"
              title="A shorter accurate answer beats a complete invented one"
              description={
                <>
                  Drop rates, item stats, entry gates and rewards are never guessed. When something cannot be confirmed for Global, the page says so — or it waits.{' '}
                  <Link href="/sources/" className="link">
                    Read the verification policy
                  </Link>
                  .
                </>
              }
            />
            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {principles.map((p) => (
                <li key={p.title} className="rounded-card border border-line-subtle bg-surface p-5">
                  <span aria-hidden className="text-2xl text-accent">
                    {p.icon}
                  </span>
                  <h3 className="mt-3 text-lg">{p.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] text-muted">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </Container>
    </>
  );
}
