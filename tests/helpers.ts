import { emptyBundle, type ContentBundle } from '@/lib/bundle';
import { factSchema, patchSchema, recordSchemas, sourceSchema, type ContentRecord, type Fact, type Guide, type Patch, type Source } from '@/lib/schemas';

/**
 * Test-only builders. Values are synthetic and only exercise validation
 * logic — they are not game data and never touch src/content.
 */
export const NOW = new Date('2026-10-22T12:00:00Z');
const T = '2026-10-20T00:00:00Z';

export function source(overrides: Partial<Source> = {}): Source {
  return sourceSchema.parse({
    id: 'source:test-official',
    title: 'Test source',
    url: 'https://example.org/test',
    publisher: 'Test publisher',
    grade: 'official',
    region: 'global',
    retrievedAt: T,
    scope: 'Unit tests only',
    ...overrides,
  });
}

export function fact(overrides: Partial<Fact> = {}): Fact {
  return factSchema.parse({
    id: 'fact:test-claim',
    subjectId: 'guide:test-guide',
    property: 'testProperty',
    value: 'synthetic',
    region: 'global',
    sourceIds: ['source:test-official'],
    evidence: 'Synthetic location',
    capturedBy: 'capturer-c',
    capturedAt: T,
    verification: 'confirmed',
    verifiedBy: 'reviewer-b',
    lastVerifiedAt: T,
    ...overrides,
  });
}

export function guide(overrides: Partial<Guide> = {}): Guide {
  const { body = 'Synthetic body.', ...meta } = overrides;
  const parsed = recordSchemas.guide.parse({
    id: 'guide:test-guide',
    slug: 'test-guide',
    title: 'Test guide',
    summary: 'Synthetic summary for unit tests.',
    category: 'general',
    region: 'global',
    status: 'published',
    author: 'author-a',
    reviewedBy: 'reviewer-b',
    createdAt: T,
    updatedAt: T,
    lastVerifiedAt: T,
    sourceIds: ['source:test-official'],
    ...meta,
  });
  return { ...parsed, kind: 'guide', body };
}

export function classRecord(overrides: Record<string, unknown> = {}): ContentRecord {
  const parsed = recordSchemas.class.parse({
    id: 'class:test-class',
    slug: 'test-class',
    name: 'Test class',
    summary: 'Synthetic class.',
    region: 'global',
    status: 'published',
    author: 'author-a',
    reviewedBy: 'reviewer-b',
    createdAt: T,
    updatedAt: T,
    lastVerifiedAt: T,
    sourceIds: ['source:test-official'],
    ...overrides,
  });
  return { ...parsed, kind: 'class', body: '' };
}

export function patch(overrides: Partial<Patch> = {}): Patch {
  return patchSchema.parse({
    id: 'patch:test-update',
    title: 'Test update',
    region: 'global',
    sourceId: 'source:test-official',
    label: 'Test label',
    effectiveAt: '2026-10-21T06:30:00Z',
    changedIds: [],
    summary: 'Synthetic patch',
    ...overrides,
  });
}

export function recordOf(kind: 'skill' | 'item' | 'dungeon' | 'system', overrides: Record<string, unknown> = {}): ContentRecord {
  const base = {
    slug: `test-${kind}`,
    name: `Test ${kind}`,
    summary: 'Synthetic record.',
    region: 'global',
    status: 'published',
    author: 'author-a',
    reviewedBy: 'reviewer-b',
    createdAt: T,
    updatedAt: T,
    lastVerifiedAt: T,
    sourceIds: ['source:test-official'],
    id: `${kind}:test-${kind}`,
    ...(kind === 'skill' ? { classId: 'class:test-class' } : {}),
    ...(kind === 'item' ? { itemType: 'material' } : {}),
    ...(kind === 'dungeon' ? { category: 'Test' } : {}),
    ...overrides,
  };
  return { ...recordSchemas[kind].parse(base), kind, body: (overrides.body as string) ?? '' } as ContentRecord;
}

export function bundleOf(parts: { sources?: Source[]; facts?: Fact[]; patches?: Patch[]; records?: ContentRecord[] }): ContentBundle {
  const bundle = emptyBundle();
  bundle.sources.push(...(parts.sources ?? []));
  bundle.facts.push(...(parts.facts ?? []));
  bundle.patches.push(...(parts.patches ?? []));
  bundle.records.push(...(parts.records ?? []));
  for (const item of [...bundle.sources, ...bundle.facts, ...bundle.patches, ...bundle.records]) bundle.origins.set(item.id, `test:${item.id}`);
  return bundle;
}
