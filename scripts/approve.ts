/**
 * HUMAN REVIEW SIGN-OFF — run only by the responsible human reviewer after
 * re-checking every fact against its source.
 *
 *   npm run content:approve -- <record-id> --reviewer "Your Name" --i-checked-the-sources [--dry-run]
 *
 * Sets the record (and its embedded skills/items) to `published` with
 * `reviewedBy` and `lastVerifiedAt`, and marks each fact `verifiedBy`. It
 * refuses if the reviewer authored the content or captured a fact, or if the
 * result would not pass the full publication gate. `updatedAt` is left alone:
 * verification is not an edit.
 */
import fs from 'node:fs';
import path from 'node:path';
import { stringify as stringifyYaml } from 'yaml';
import { planApproval } from '../src/lib/approve';
import { loadContentTree, splitFrontmatter } from '../src/lib/load-content';
import type { ContentRecord, Fact } from '../src/lib/schemas';

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const option = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const recordId = args.find((a) => !a.startsWith('--') && a !== option('--reviewer'));
const reviewer = option('--reviewer') ?? '';
const dryRun = flag('--dry-run');

if (!recordId || !reviewer) {
  console.error('Usage: npm run content:approve -- <record-id> --reviewer "Your Name" --i-checked-the-sources [--dry-run]');
  process.exit(2);
}
if (!flag('--i-checked-the-sources')) {
  console.error('Refusing: pass --i-checked-the-sources to confirm you re-checked every fact against its cited source.');
  process.exit(2);
}

const { bundle, issues } = loadContentTree();
if (issues.some((i) => i.level === 'error')) {
  console.error('Refusing: content has load errors. Run `npm run content:validate` first.');
  process.exit(1);
}
const plan = planApproval(bundle, recordId, reviewer);
if (!plan.ok) {
  console.error(`✖ Cannot approve ${recordId}:`);
  for (const e of plan.errors) console.error(`  - ${e}`);
  process.exit(1);
}

const root = process.cwd();
const fileOf = (id: string) => path.join(root, bundle.origins.get(id) as string);

function writeRecord(record: ContentRecord) {
  const file = fileOf(record.id);
  const changes = { status: record.status, reviewedBy: record.reviewedBy, lastVerifiedAt: record.lastVerifiedAt };
  if (file.endsWith('.mdx')) {
    const split = splitFrontmatter(fs.readFileSync(file, 'utf8'));
    if (!split) throw new Error(`${file} lost its frontmatter`);
    const data = { ...(split.data as Record<string, unknown>), ...changes };
    if (!dryRun) fs.writeFileSync(file, `---\n${stringifyYaml(data, { lineWidth: 0 })}---\n${split.body}`);
  } else {
    const data = { ...JSON.parse(fs.readFileSync(file, 'utf8')), ...changes };
    if (!dryRun) fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  }
  console.log(`  record  ${record.id}  -> published (${path.relative(root, file)})`);
}

function writeFacts(facts: Fact[]) {
  const byFile = new Map<string, Fact[]>();
  for (const f of facts) byFile.set(fileOf(f.id), [...(byFile.get(fileOf(f.id)) ?? []), f]);
  for (const [file, list] of byFile) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>[];
    for (const entry of data) {
      const f = list.find((x) => x.id === entry.id);
      if (f) Object.assign(entry, { verifiedBy: f.verifiedBy, lastVerifiedAt: f.lastVerifiedAt });
    }
    if (!dryRun) fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`  facts   ${list.length} verified in ${path.relative(root, file)}`);
  }
}

console.log(`${dryRun ? '[dry run] ' : ''}Approving ${recordId} as ${reviewer} at ${plan.verifiedAt}`);
plan.records.forEach(writeRecord);
writeFacts(plan.facts);
console.log(dryRun ? '\nDry run only — no files changed.' : '\n✔ Approved. Run `npm run build` to publish it.');
