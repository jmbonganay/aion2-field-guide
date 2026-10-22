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
