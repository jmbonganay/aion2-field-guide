import type { EntityKind, RoutableKind } from './schemas';

export const KIND_BASE: Record<RoutableKind, string> = {
  guide: '/guides/',
  class: '/classes/',
  dungeon: '/dungeons/',
  system: '/systems/',
};

export const KIND_LABEL: Record<EntityKind, string> = {
  guide: 'Guide',
  class: 'Class',
  dungeon: 'Dungeon',
  system: 'System',
  skill: 'Skill',
  item: 'Item',
};

export function hrefFor(record: { kind: RoutableKind; slug: string }): string {
  return `${KIND_BASE[record.kind]}${record.slug}/`;
}

/** Anchor id used for an embedded record (skill/item) on the page that shows it. */
export function anchorFor(record: { kind: EntityKind; slug: string }): string {
  return `${record.kind}-${record.slug}`;
}

/** Only allow same-site paths or https URLs through to `href`. */
export function safeHref(value: string): string | null {
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  if (value.startsWith('#')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Record detail paths (`/<section>/<slug>/`). Other internal paths are static pages. */
export const RECORD_PATH = /^\/(guides|classes|dungeons|systems)\/[a-z0-9-]+\/?(?:#.*)?$/;

/** Internal record links in an MDX body: `](/dungeons/draupnir/)`. */
export function bodyRecordLinks(body: string): string[] {
  return [...body.matchAll(/\]\((\/[^)\s]+)\)/g)].map((m) => m[1] as string).filter((p) => RECORD_PATH.test(p));
}

/** Normalise `/dungeons/draupnir#x` → `/dungeons/draupnir/`. */
export function recordPathOf(path: string): string {
  const bare = path.split('#')[0] as string;
  return bare.endsWith('/') ? bare : `${bare}/`;
}
