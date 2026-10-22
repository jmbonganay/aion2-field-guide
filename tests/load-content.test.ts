import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadContentTree, splitFrontmatter } from '@/lib/load-content';
import { selectAllPublished } from '@/lib/publication';
import { summarizeIssues, validateBundle } from '@/lib/validation';

let dir: string;
function tree(files: Record<string, string>): string {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fieldguide-content-'));
  const root = path.join(dir, 'src', 'content');
  for (const [rel, text] of Object.entries(files)) {
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
  return root;
}
afterEach(() => dir && fs.rmSync(dir, { recursive: true, force: true }));

const SOURCES = JSON.stringify([
  { id: 'source:t', title: 'T', url: 'https://example.org/t', publisher: 'P', grade: 'official', region: 'global', retrievedAt: '2026-10-20T00:00:00Z', scope: 'test' },
]);

const guideFile = (front: string, body = '## Heading\n\nSynthetic body.\n') => `---\n${front}\n---\n${body}`;
const GOOD_FRONT = `id: guide:synthetic
slug: synthetic
title: Synthetic guide
summary: Test-only guide.
category: general
region: global
status: published
author: a
reviewedBy: b
createdAt: '2026-10-20T00:00:00Z'
updatedAt: '2026-10-20T00:00:00Z'
lastVerifiedAt: '2026-10-21T00:00:00Z'
sourceIds: [source:t]`;

describe('loadContentTree', () => {
  it('loads a valid published MDX guide end to end', () => {
    const root = tree({ 'sources.json': SOURCES, 'guides/synthetic.mdx': guideFile(GOOD_FRONT) });
    const { bundle, issues } = loadContentTree(root);
    expect(issues).toEqual([]);
    expect(summarizeIssues(validateBundle(bundle, { now: new Date('2026-10-22T00:00:00Z') })).errors).toEqual([]);
    const [only] = selectAllPublished(bundle, { now: new Date('2026-10-22T00:00:00Z') });
    expect(only?.kind === 'guide' && only.body).toContain('Synthetic body.');
  });

  it('reports invalid JSON, schema errors, slug/file mismatches and missing frontmatter with file paths', () => {
    const root = tree({
      'sources.json': '[{ not json',
      'classes/wrong-name.json': JSON.stringify({ id: 'class:right', slug: 'right', name: 'X', summary: 'X', region: 'global', status: 'draft', author: 'a', createdAt: '2026-10-20T00:00:00Z', updatedAt: '2026-10-20T00:00:00Z' }),
      'dungeons/bad.json': JSON.stringify({ id: 'dungeon:bad', slug: 'bad' }),
      'guides/no-front.mdx': '# No frontmatter here',
    });
    const { issues } = loadContentTree(root);
    const text = issues.map((i) => `${i.file}: ${i.message}`).join('\n');
    expect(text).toMatch(/sources\.json: invalid JSON/);
    expect(text).toMatch(/classes\/wrong-name\.json: file name must match slug "right"/);
    expect(text).toMatch(/dungeons\/bad\.json: .*name/);
    expect(text).toMatch(/guides\/no-front\.mdx: missing YAML frontmatter block/);
  });

  it('keeps YAML dates as strings', () => {
    expect(splitFrontmatter("---\ncreatedAt: '2026-10-20T00:00:00Z'\n---\nbody")).toEqual({ data: { createdAt: '2026-10-20T00:00:00Z' }, body: 'body' });
  });
});

describe('loadContentTree — structured kinds', () => {
  const base = { summary: 'S', region: 'global', status: 'draft', author: 'a', createdAt: '2026-10-20T00:00:00Z', updatedAt: '2026-10-20T00:00:00Z' };
  it('loads skills, items, patches and companion MDX bodies; rejects orphan bodies', () => {
    const root = tree({
      'sources.json': SOURCES,
      'classes/c.json': JSON.stringify({ ...base, id: 'class:c', slug: 'c', name: 'C' }),
      'classes/c.mdx': '## Overview\n\nBody.',
      'skills/s.json': JSON.stringify({ ...base, id: 'skill:s', slug: 's', name: 'S', classId: 'class:c' }),
      'items/i.json': JSON.stringify({ ...base, id: 'item:i', slug: 'i', name: 'I (Bound)', itemType: 'material', bound: true }),
      'patches/p.json': JSON.stringify({ id: 'patch:p', title: 'P', region: 'global', sourceId: 'source:t', label: 'L', effectiveAt: null, changedIds: ['class:c'], summary: 'x' }),
      'dungeons/orphan.mdx': 'No JSON.',
    });
    const { bundle, issues } = loadContentTree(root);
    expect(bundle.records.map((r) => r.kind).sort()).toEqual(['class', 'item', 'skill']);
    expect(bundle.records.find((r) => r.id === 'class:c')?.body).toContain('Body.');
    expect(bundle.patches).toHaveLength(1);
    expect(issues.map((i) => i.message)).toEqual(['MDX body has no matching orphan.json record']);
  });
});
