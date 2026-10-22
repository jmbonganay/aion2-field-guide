/**
 * DESIGN FIXTURES — NOT PUBLISHED. NOT GAME DATA.
 *
 * Every value here is an invented layout sample used to review components
 * on the local dev server (`/design-preview/`). None of it describes AION 2.
 * The public loader never reads this directory, every record is
 * `designFixture: true` with a non-published status, and the publication
 * gate rejects fixtures even if their status were changed.
 */
import type { z } from 'zod';
import type { classSchema, dungeonSchema, factSchema, guideMetaSchema, sourceSchema, systemSchema } from '@/lib/schemas';

type In<T extends z.ZodType> = z.input<T>;

const stamp = '2026-10-22T00:00:00Z';

export const fixtureSources: In<typeof sourceSchema>[] = [
  {
    id: 'source:fixture-official-sample',
    title: 'Design fixture — sample official source',
    url: 'https://example.com/design-fixture/official',
    publisher: 'Example publisher (fixture)',
    grade: 'official',
    region: 'global',
    publishedAt: null,
    retrievedAt: stamp,
    scope: 'Layout sample for the source list component.',
    designFixture: true,
  },
  {
    id: 'source:fixture-community-sample',
    title: 'Design fixture — sample community report',
    url: 'https://example.com/design-fixture/community',
    publisher: 'Example community (fixture)',
    grade: 'community',
    region: 'unspecified',
    publishedAt: null,
    retrievedAt: stamp,
    scope: 'Layout sample showing how community evidence is labelled.',
    designFixture: true,
  },
];

export const fixtureFacts: In<typeof factSchema>[] = [
  {
    id: 'fact:fixture-confirmed-sample',
    subjectId: 'guide:fixture-layout-guide',
    property: 'layoutSample',
    value: 'Sample confirmed value',
    region: 'global',
    effectivePatch: null,
    sourceIds: ['source:fixture-official-sample'],
    evidence: 'Sample location in the sample source.',
    capturedBy: 'design-fixture',
    capturedAt: stamp,
    verification: 'confirmed',
    verifiedBy: 'fixture-reviewer',
    lastVerifiedAt: stamp,
    designFixture: true,
  },
  {
    id: 'fact:fixture-reported-sample',
    subjectId: 'guide:fixture-layout-guide',
    property: 'layoutSampleReported',
    value: 'Sample reported value',
    region: 'global',
    effectivePatch: null,
    sourceIds: ['source:fixture-community-sample'],
    evidence: 'Sample location in the sample community report.',
    capturedBy: 'design-fixture',
    capturedAt: stamp,
    verification: 'reported',
    context: 'Sample context line explaining who reported the value.',
    designFixture: true,
  },
];

export const fixtureGuides: (In<typeof guideMetaSchema> & { body: string })[] = [
  {
    id: 'guide:fixture-layout-guide',
    slug: 'fixture-layout-guide',
    title: 'Layout sample: guide detail template',
    summary:
      'A non-public sample guide used only to review typography, metadata, evidence and source components. It contains no game information.',
    category: 'general',
    region: 'global',
    status: 'draft',
    author: 'design-fixture',
    applicability: 'Layout review only — not applicable to any game mode.',
    createdAt: stamp,
    updatedAt: stamp,
    lastVerifiedAt: null,
    sourceIds: ['source:fixture-official-sample', 'source:fixture-community-sample'],
    factIds: ['fact:fixture-confirmed-sample', 'fact:fixture-reported-sample'],
    relatedIds: ['class:fixture-class-card'],
    tags: ['layout', 'fixture'],
    designFixture: true,
    body: `## Quick answer

This paragraph demonstrates the reading width, line height and paragraph rhythm of a guide body. Values come from fact records, like <Fact id="fact:fixture-confirmed-sample" /> or a reported one, <Fact id="fact:fixture-reported-sample" />, each with a citation.

## Steps

1. A numbered step shows how instructions are laid out.
2. A second step shows spacing between list items.
3. A third step demonstrates list rhythm on narrow screens.

## Notes

> Block quotes render as quiet editorial asides.

Inline \`code\` and **strong text** use the same tokens as the rest of the site.
`,
  },
];

export const fixtureClasses: In<typeof classSchema>[] = [
  {
    id: 'class:fixture-class-card',
    slug: 'fixture-class-card',
    name: 'Fixture class card',
    summary: 'Sample class card used to review card layout. Not a game class.',
    region: 'global',
    status: 'draft',
    author: 'design-fixture',
    createdAt: stamp,
    updatedAt: stamp,
    designFixture: true,
  },
];

export const fixtureDungeons: In<typeof dungeonSchema>[] = [
  {
    id: 'dungeon:fixture-dungeon-card',
    slug: 'fixture-dungeon-card',
    name: 'Fixture dungeon card',
    category: 'Sample category',
    summary: 'Sample dungeon card used to review card layout. Not a game dungeon.',
    region: 'global',
    status: 'in_review',
    author: 'design-fixture',
    createdAt: stamp,
    updatedAt: stamp,
    designFixture: true,
  },
];

export const fixtureSystems: In<typeof systemSchema>[] = [
  {
    id: 'system:fixture-system-card',
    slug: 'fixture-system-card',
    name: 'Fixture system card',
    summary: 'Sample system card used to review card layout. Not a game system.',
    region: 'global',
    status: 'stale',
    author: 'design-fixture',
    createdAt: stamp,
    updatedAt: stamp,
    designFixture: true,
  },
];
