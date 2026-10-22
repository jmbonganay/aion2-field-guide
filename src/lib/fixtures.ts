import {
  fixtureClasses,
  fixtureDungeons,
  fixtureFacts,
  fixtureGuides,
  fixtureSources,
  fixtureSystems,
} from '@/content/fixtures/design-fixtures';
import { emptyBundle, type ContentBundle, type ContentIssue } from './bundle';
import { formatZodError } from './load-content';
import { factSchema, recordSchemas, sourceSchema, type ContentRecord } from './schemas';

const FIXTURE_FILE = 'src/content/fixtures/design-fixtures.ts';

/**
 * Loads design fixtures into their own bundle. Used only by the dev-only
 * design preview and by tests — never by public selectors.
 */
export function loadDesignFixtures(): { bundle: ContentBundle; issues: ContentIssue[] } {
  const bundle = emptyBundle();
  const issues: ContentIssue[] = [];
  const fail = (id: string, message: string) => issues.push({ level: 'error', file: FIXTURE_FILE, id, message });

  for (const raw of fixtureSources) {
    const parsed = sourceSchema.safeParse(raw);
    if (parsed.success) bundle.sources.push(parsed.data);
    else fail(raw.id, formatZodError(parsed.error));
  }
  for (const raw of fixtureFacts) {
    const parsed = factSchema.safeParse(raw);
    if (parsed.success) bundle.facts.push(parsed.data);
    else fail(raw.id, formatZodError(parsed.error));
  }
  for (const { body, ...raw } of fixtureGuides) {
    const parsed = recordSchemas.guide.safeParse(raw);
    if (parsed.success) bundle.records.push({ ...parsed.data, kind: 'guide', body });
    else fail(raw.id, formatZodError(parsed.error));
  }
  const groups = [
    ['class', fixtureClasses],
    ['dungeon', fixtureDungeons],
    ['system', fixtureSystems],
  ] as const;
  for (const [kind, list] of groups) {
    for (const raw of list) {
      const parsed = recordSchemas[kind].safeParse(raw);
      if (parsed.success) bundle.records.push({ ...parsed.data, kind, body: '' } as ContentRecord);
      else fail(raw.id, formatZodError(parsed.error));
    }
  }

  for (const item of [...bundle.sources, ...bundle.facts, ...bundle.records]) {
    bundle.origins.set(item.id, FIXTURE_FILE);
    if (item.designFixture !== true) fail(item.id, 'every fixture must set designFixture: true');
    if ('status' in item && item.status === 'published') fail(item.id, 'design fixtures can never be published');
  }

  return { bundle, issues };
}
