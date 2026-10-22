import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { z } from 'zod';
import { emptyBundle, type ContentBundle, type ContentIssue } from './bundle';
import { factSchema, patchSchema, recordSchemas, sourceSchema, type ContentRecord } from './schemas';

/**
 * Build-time file loader for `src/content/`. Server/build only.
 *
 * Layout:
 *   sources.json                         array of Source
 *   facts/*.json                         array of Fact per file
 *   patches/*.json                       one Patch per file
 *   classes|dungeons|systems|skills|items/<slug>.json   one record per file
 *   classes|dungeons|systems|skills|items/<slug>.mdx    optional MDX body for that record
 *   guides/<slug>.mdx                    YAML frontmatter + MDX body
 *   fixtures/                            NEVER read here (design fixtures only)
 */

export const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

export const RECORD_DIRS = [
  { dir: 'classes', kind: 'class' },
  { dir: 'dungeons', kind: 'dungeon' },
  { dir: 'systems', kind: 'system' },
  { dir: 'skills', kind: 'skill' },
  { dir: 'items', kind: 'item' },
] as const;

export type LoadResult = { bundle: ContentBundle; issues: ContentIssue[] };

export function formatZodError(error: z.ZodError): string {
  return error.issues.map((i) => `${i.path.length ? i.path.join('.') : '(root)'}: ${i.message}`).join('; ');
}

/** Split `---\nYAML\n---\nbody`. Returns null when no frontmatter block exists. */
export function splitFrontmatter(source: string): { data: unknown; body: string } | null {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  return { data: parseYaml(match[1] ?? ''), body: match[2] ?? '' };
}

function listFiles(dir: string, ext: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort();
}

function rel(root: string, file: string): string {
  return path.relative(path.dirname(path.dirname(root)), file) || file;
}

export function loadContentTree(root: string = CONTENT_ROOT): LoadResult {
  const bundle = emptyBundle();
  const issues: ContentIssue[] = [];
  const error = (file: string, message: string, id?: string) => issues.push({ level: 'error', file: rel(root, file), id, message });

  const readJson = (file: string): unknown => {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      error(file, `invalid JSON: ${(e as Error).message}`);
      return undefined;
    }
  };

  // Sources
  const sourcesFile = path.join(root, 'sources.json');
  if (fs.existsSync(sourcesFile)) {
    const raw = readJson(sourcesFile);
    if (raw !== undefined && !Array.isArray(raw)) {
      error(sourcesFile, 'sources.json must be an array');
    } else if (Array.isArray(raw)) {
      raw.forEach((entry, i) => {
        const parsed = sourceSchema.safeParse(entry);
        if (!parsed.success) return error(sourcesFile, `source[${i}]: ${formatZodError(parsed.error)}`);
        bundle.sources.push(parsed.data);
        bundle.origins.set(parsed.data.id, rel(root, sourcesFile));
      });
    }
  }

  // Facts
  const factsDir = path.join(root, 'facts');
  for (const name of listFiles(factsDir, '.json')) {
    const file = path.join(factsDir, name);
    const raw = readJson(file);
    if (raw === undefined) continue;
    if (!Array.isArray(raw)) {
      error(file, 'fact files must contain an array');
      continue;
    }
    raw.forEach((entry, i) => {
      const parsed = factSchema.safeParse(entry);
      if (!parsed.success) return error(file, `fact[${i}]: ${formatZodError(parsed.error)}`);
      bundle.facts.push(parsed.data);
      bundle.origins.set(parsed.data.id, rel(root, file));
    });
  }

  // Patches
  const patchesDir = path.join(root, 'patches');
  for (const name of listFiles(patchesDir, '.json')) {
    const file = path.join(patchesDir, name);
    const raw = readJson(file);
    if (raw === undefined) continue;
    const parsed = patchSchema.safeParse(raw);
    if (!parsed.success) {
      error(file, formatZodError(parsed.error));
      continue;
    }
    bundle.patches.push(parsed.data);
    bundle.origins.set(parsed.data.id, rel(root, file));
  }

  // Structured records (+ optional MDX body)
  for (const { dir, kind } of RECORD_DIRS) {
    const full = path.join(root, dir);
    const jsonNames = listFiles(full, '.json');
    for (const name of jsonNames) {
      const file = path.join(full, name);
      const raw = readJson(file);
      if (raw === undefined) continue;
      const parsed = recordSchemas[kind].safeParse(raw);
      if (!parsed.success) {
        error(file, formatZodError(parsed.error));
        continue;
      }
      const slug = name.replace(/\.json$/, '');
      if (parsed.data.slug !== slug) error(file, `file name must match slug "${parsed.data.slug}"`, parsed.data.id);
      const bodyFile = path.join(full, `${slug}.mdx`);
      const body = fs.existsSync(bodyFile) ? fs.readFileSync(bodyFile, 'utf8') : '';
      bundle.records.push({ ...parsed.data, kind, body } as ContentRecord);
      bundle.origins.set(parsed.data.id, rel(root, file));
    }
    for (const name of listFiles(full, '.mdx')) {
      if (!jsonNames.includes(name.replace(/\.mdx$/, '.json'))) {
        error(path.join(full, name), `MDX body has no matching ${name.replace(/\.mdx$/, '.json')} record`);
      }
    }
  }

  // Guides (MDX with frontmatter)
  const guidesDir = path.join(root, 'guides');
  for (const name of listFiles(guidesDir, '.mdx')) {
    const file = path.join(guidesDir, name);
    let split: ReturnType<typeof splitFrontmatter>;
    try {
      split = splitFrontmatter(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      error(file, `invalid frontmatter YAML: ${(e as Error).message}`);
      continue;
    }
    if (!split) {
      error(file, 'missing YAML frontmatter block');
      continue;
    }
    const parsed = recordSchemas.guide.safeParse(split.data);
    if (!parsed.success) {
      error(file, formatZodError(parsed.error));
      continue;
    }
    if (parsed.data.slug !== name.replace(/\.mdx$/, '')) error(file, `file name must match slug "${parsed.data.slug}"`, parsed.data.id);
    bundle.records.push({ ...parsed.data, kind: 'guide', body: split.body });
    bundle.origins.set(parsed.data.id, rel(root, file));
  }

  return { bundle, issues };
}
