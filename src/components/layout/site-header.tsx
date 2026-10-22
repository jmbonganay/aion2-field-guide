import Link from 'next/link';
import { SearchTrigger } from '@/components/search/search-trigger';
import { Container } from '@/components/ui/container';
import { enabled, legalNav, primaryNav, site, utilityNav } from '@/config/site';
import { BrandMark } from './brand';
import { MobileMenu } from './mobile-menu';
import { NavLinks } from './nav-links';

export function Wordmark({ idSuffix }: { idSuffix: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark className="size-8 shrink-0" idSuffix={idSuffix} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.125rem] font-semibold tracking-tight text-ink">{site.name}</span>
        <span className="mt-1 text-[0.625rem] font-semibold tracking-[0.18em] text-subtle uppercase">Unofficial · Global</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  const primary = enabled(primaryNav);
  const utility = enabled(utilityNav);
  return (
    <header className="sticky top-0 z-40 border-b border-line-subtle bg-canvas/85 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/70">
      <Container className="relative flex h-16 items-center gap-4">
        <Link href="/" className="-ml-1 rounded-control p-1">
          <Wordmark idSuffix="header" />
          <span className="sr-only"> — home</span>
        </Link>

        <nav aria-label="Primary" className="ml-6 hidden md:block">
          <NavLinks items={primary} />
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block">
            <SearchTrigger />
          </div>
          <div className="sm:hidden">
            <SearchTrigger variant="icon" />
          </div>
          <nav aria-label="Utility" className="hidden lg:block">
            <NavLinks items={utility} />
          </nav>
          <div className="md:hidden">
            <MobileMenu primary={primary} secondary={[...utility, ...enabled(legalNav)]} />
          </div>
        </div>
      </Container>
    </header>
  );
}
