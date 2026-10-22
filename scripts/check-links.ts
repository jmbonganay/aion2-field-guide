/**
 * Checks every source URL in the registry is still reachable. Manual and
 * polite: one request at a time, a short pause between requests, identified
 * user agent. Not part of `npm run build` (it needs the network).
 */
import { loadContentTree } from '../src/lib/load-content';

const { bundle } = loadContentTree();
const UA = 'AION2FieldGuide-LinkCheck/1.0 (+unofficial fan site; manual source check)';
let failures = 0;

for (const source of bundle.sources) {
  let status = 'error';
  try {
    let res = await fetch(source.url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(15000) });
    if (res.status === 405 || res.status === 403) {
      res = await fetch(source.url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(15000) });
    }
    status = String(res.status);
    if (!res.ok) failures++;
  } catch (error) {
    failures++;
    status = (error as Error).name;
  }
  console.log(`${status.padEnd(6)} ${source.id}  ${source.url}`);
  await new Promise((r) => setTimeout(r, 750));
}
console.log(failures ? `\n✖ ${failures} source URL(s) need attention.` : '\n✔ All source URLs reachable.');
process.exit(failures ? 1 : 0);
