import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailTemplate } from '@/components/content/detail-template';
import { MdxContent } from '@/components/content/mdx-content';
import { getPublished, getPublishedBySlug, makeIsLinkable, resolveEvidence } from './content';
import { hrefFor, KIND_BASE } from './links';
import { pageMetadata } from './metadata';
import { recordTitle, type RoutableKind } from './schemas';

/**
 * Shared implementation for `/<kind>/[slug]/` routes. Static params come
 * ONLY from published records; `dynamicParams = false` in each route makes
 * every other slug a real 404.
 */
export const SECTION_LABEL: Record<RoutableKind, string> = {
  guide: 'Guides',
  class: 'Classes',
  dungeon: 'Dungeons',
  system: 'Systems',
};

type Params = Promise<{ slug: string }>;

export function recordStaticParams(kind: RoutableKind) {
  return getPublished(kind).map((record) => ({ slug: record.slug }));
}

export async function recordMetadata(kind: RoutableKind, params: Params): Promise<Metadata> {
  const { slug } = await params;
  const record = getPublishedBySlug(kind, slug);
  if (!record) return {};
  return pageMetadata({ title: recordTitle(record), description: record.summary, path: hrefFor(record) });
}

export async function RecordPage({ kind, params }: { kind: RoutableKind; params: Params }) {
  const { slug } = await params;
  const record = getPublishedBySlug(kind, slug);
  if (!record) notFound();
  const evidence = resolveEvidence(record);
  return (
    <DetailTemplate
      record={record}
      evidence={evidence}
      crumbs={[
        { label: SECTION_LABEL[kind], href: KIND_BASE[kind] },
        { label: recordTitle(record), href: hrefFor(record) },
      ]}
    >
      {record.body.trim() ? <MdxContent source={record.body} evidence={evidence} isLinkable={makeIsLinkable()} /> : null}
    </DetailTemplate>
  );
}
