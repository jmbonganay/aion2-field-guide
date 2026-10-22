/**
 * Content validation gate. Run with `npm run content:validate`; also runs
 * before every `npm run build`. Exits non-zero on any error.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { ContentIssue } from '../src/lib/bundle';
import { loadDesignFixtures } from '../src/lib/fixtures';
import { CONTENT_ROOT, loadContentTree } from '../src/lib/load-content';
import { selectAllPublished } from '../src/lib/publication';
import { summarizeIssues, validateBundle } from '../src/lib/validation';

const EXPECTED: Record<string, string[]> = {
  guides: ['.mdx'],
  classes: ['.json', '.mdx'],
  dungeons: ['.json', '.mdx'],
  systems: ['.json', '.mdx'],
  skills: ['.json', '.mdx'],
  items: ['.json', '.mdx'],
  facts: ['.json'],
  patches: ['.json'],
};

function strayFileIssues(): ContentIssue[] {
  const issues: ContentIssue[] = [];
  for (const [dir, exts] of Object.entries(EXPECTED)) {
    const full = path.join(CONTENT_ROOT, dir);
    if (!fs.existsSync(full)) continue;
    for (const name of fs.readdirSync(full)) {
      if (name === '.gitkeep' || exts.some((e) => name.endsWith(e))) continue;
      issues.push({ level: 'error', file: `src/content/${dir}/${name}`, message: `unexpected file; ${dir}/ only accepts ${exts.join(', ')}` });
    }
  }
  return issues;
}

const loaded = loadContentTree();
const fixtures = loadDesignFixtures();
const issues = [...loaded.issues, ...validateBundle(loaded.bundle), ...fixtures.issues, ...strayFileIssues()];
const { errors, warnings } = summarizeIssues(issues);

const published = selectAllPublished(loaded.bundle);
const byStatus = loaded.bundle.records.reduce<Record<string, number>>((acc, r) => {
  acc[r.status] = (acc[r.status] ?? 0) + 1;
  return acc;
}, {});

console.log('Content validation');
console.log(`  sources:   ${loaded.bundle.sources.length}`);
console.log(`  facts:     ${loaded.bundle.facts.length} (${loaded.bundle.facts.filter((f) => f.verifiedBy).length} reviewer-verified)`);
console.log(`  patches:   ${loaded.bundle.patches.length}`);
console.log(`  records:   ${loaded.bundle.records.length} ${JSON.stringify(byStatus)}`);
console.log(`  public:    ${published.length} (pass the publication gate)`);
console.log(`  fixtures:  ${fixtures.bundle.records.length} records, ${fixtures.bundle.sources.length} sources, ${fixtures.bundle.facts.length} facts (never public)`);

for (const w of warnings) console.warn(`  warning  ${w.file}${w.id ? ` [${w.id}]` : ''}: ${w.message}`);
for (const e of errors) console.error(`  error    ${e.file}${e.id ? ` [${e.id}]` : ''}: ${e.message}`);

if (errors.length) {
  console.error(`\n✖ ${errors.length} error(s), ${warnings.length} warning(s). Fix the errors above before building.`);
  process.exit(1);
}
console.log(`\n✔ Content valid (${warnings.length} warning(s)).`);
