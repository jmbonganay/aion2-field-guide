/** Prints what stands between each record and publication. Read-only. */
import { loadContentTree } from '../src/lib/load-content';
import { reviewQueue } from '../src/lib/review';

const { bundle } = loadContentTree();
const queue = reviewQueue(bundle);
if (!queue.length) {
  console.log('No records yet.');
  process.exit(0);
}
for (const entry of queue) {
  const { record } = entry;
  console.log(`\n${record.status.toUpperCase().padEnd(10)} ${record.id}  "${entry.title}"`);
  console.log(`           facts: ${entry.facts.length} (${entry.unverifiedFacts} awaiting reviewer)  ·  sources: ${record.sourceIds.length}  ·  approved with it: ${entry.bundled.map((r) => r.id).join(', ') || 'nothing'}`);
  if (record.status === 'published') continue;
  const blocking = entry.blockers.filter((b) => !/missing reviewedBy|missing lastVerifiedAt|has not been verified by a reviewer/.test(b));
  if (blocking.length) for (const b of blocking) console.log(`           ✖ ${b}`);
  else console.log(`           ✔ ready for human review${entry.previewable ? `  →  npm run dev, then /review/${record.kind}/${record.slug}/` : ''}`);
}
console.log('\nApprove (human reviewer only): npm run content:approve -- <id> --reviewer "Name" --i-checked-the-sources');
