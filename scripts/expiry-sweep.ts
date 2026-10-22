/**
 * Hourly expiry sweep (run by .github/workflows/expiry.yml).
 *
 * The site is a static export, so an expired record only disappears when the
 * site is rebuilt. This records every published record whose `expiresAt` has
 * passed in `src/content/expiry-log.json`. The workflow commits that file only
 * when it changes, and the push makes Vercel rebuild without the expired page.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadContentTree } from '../src/lib/load-content';
import { recordTitle } from '../src/lib/schemas';

const LOG = path.join(process.cwd(), 'src', 'content', 'expiry-log.json');
const now = new Date();
const log: { id: string; title: string; expiresAt: string; sweptAt: string }[] = fs.existsSync(LOG) ? JSON.parse(fs.readFileSync(LOG, 'utf8')) : [];
const logged = new Set(log.map((e) => e.id + e.expiresAt));

const { bundle } = loadContentTree();
const expired = bundle.records.filter(
  (r) => r.status === 'published' && r.expiresAt && Date.parse(r.expiresAt) <= now.getTime() && !logged.has(r.id + r.expiresAt),
);
for (const r of expired) {
  log.push({ id: r.id, title: recordTitle(r), expiresAt: r.expiresAt as string, sweptAt: now.toISOString().replace(/\.\d+Z$/, 'Z') });
  console.log(`expired: ${r.id} (${r.expiresAt})`);
}
if (expired.length) fs.writeFileSync(LOG, `${JSON.stringify(log, null, 2)}\n`);
console.log(expired.length ? `${expired.length} newly expired record(s) logged.` : 'Nothing newly expired.');
