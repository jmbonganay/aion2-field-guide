import { loadContentTree } from './load-content';
import { selectRoutablePublished } from './publication';
import { KIND_BASE } from './links';
import type { RoutableKind } from './schemas';

/**
 * Detail routes live in `src/app/<section>/[slug]/page.<section>.tsx`.
 *
 * Next.js refuses an empty `generateStaticParams()` under `output: 'export'`,
 * and a placeholder slug would export a fake page with a 200 status. So a
 * section's detail route is only *enabled* (its page extension registered in
 * next.config.ts) once at least one record of that kind passes the
 * publication gate. Until then the route does not exist and any slug is a 404.
 */
export const DETAIL_ROUTE_EXTENSION: Record<RoutableKind, string> = {
  guide: 'guides.tsx',
  class: 'classes.tsx',
  dungeon: 'dungeons.tsx',
  system: 'systems.tsx',
};

export function publishedKinds(): RoutableKind[] {
  const { bundle } = loadContentTree();
  const kinds = new Set<string>(selectRoutablePublished(bundle).map((r) => r.kind));
  return (Object.keys(KIND_BASE) as RoutableKind[]).filter((k) => kinds.has(k));
}

export function detailRouteExtensions(kinds: RoutableKind[]): string[] {
  return kinds.map((k) => DETAIL_ROUTE_EXTENSION[k]);
}
