import { isIndexable, resolveSiteUrl } from '@/lib/site-url';

export const site = {
  name: 'AION 2 Field Guide',
  shortName: 'Field Guide',
  tagline: 'An unofficial, source-checked companion for AION 2 Global.',
  description:
    'An independent, unofficial and read-only AION 2 Global reference. Every published claim shows its source, region and last-verified date.',
  url: resolveSiteUrl(),
  indexable: isIndexable(),
  locale: 'en',
  /**
   * Public corrections channel (e.g. a GitHub Issues URL). `null` until the
   * user-owned repository exists; the UI then explains how corrections work
   * without linking anywhere.
   */
  correctionsUrl: 'https://github.com/jmbonganay/aion2-field-guide/issues/new?template=correction.yml' as string | null,
  editorialFocus: 'Sorcerer',
  disclaimer:
    'This is an independent, unofficial AION 2 fan-made guide. AION 2 and related names, marks and artwork belong to their respective owners. This site is not endorsed by or affiliated with NCSOFT. In-game information may change with updates; please verify important details in the game and official announcements.',
} as const;

export type NavItem = {
  label: string;
  href: `/${string}`;
  description: string;
  /** Disabled sections stay in config but render nowhere until they have verified content. */
  enabled: boolean;
};

/** Primary navigation (docs/02-SITEMAP.md). Order is display order. */
export const primaryNav: NavItem[] = [
  { label: 'Guides', href: '/guides/', description: 'Reviewed, source-backed how-to guides.', enabled: true },
  { label: 'Classes', href: '/classes/', description: 'Class overviews and build guidance.', enabled: true },
  { label: 'Dungeons', href: '/dungeons/', description: 'Entry details, rewards and mechanics.', enabled: true },
  { label: 'Systems', href: '/systems/', description: 'Progression and character systems explained.', enabled: true },
  { label: 'Gear', href: '/gear/', description: 'Equipment records and acquisition paths.', enabled: false },
  { label: 'Farming', href: '/farming/', description: 'Curated resource and material routes.', enabled: false },
  { label: 'Updates', href: '/updates/', description: 'Official updates that changed pages here.', enabled: true },
];

export const utilityNav: NavItem[] = [
  { label: 'Sources', href: '/sources/', description: 'How information is researched and verified.', enabled: true },
  { label: 'About', href: '/about/', description: 'What this project is and is not.', enabled: true },
];

export const legalNav: NavItem[] = [
  { label: 'Disclaimer', href: '/disclaimer/', description: 'Unofficial fansite notice.', enabled: true },
  { label: 'Privacy', href: '/privacy/', description: 'What this site does and does not collect.', enabled: true },
];

export const enabled = (items: NavItem[]) => items.filter((item) => item.enabled);

/** Static (non-record) routes included in the sitemap. */
export const staticRoutes = ['/', ...enabled(primaryNav).map((i) => i.href), ...enabled(utilityNav).map((i) => i.href), ...enabled(legalNav).map((i) => i.href)];
