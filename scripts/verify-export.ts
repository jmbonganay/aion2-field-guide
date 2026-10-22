/**
 * Post-build checks on the static export in `out/` (docs/10-QA-CHECKLIST.md):
 * required files, no fixtures/drafts, one H1 per page, and no broken internal links.
 */
import fs from 'node:fs';
import path from 'node:path';
import { staticRoutes } from '../src/config/site';
import { hrefFor } from '../src/lib/links';
import { loadContentTree } from '../src/lib/load-content';
import { selectAllPublished, selectRoutablePublished } from '../src/lib/publication';
import { buildSearchIndex } from '../src/lib/search-index';

const OUT = path.join(process.cwd(), 'out');
const errors: string[] = [];

if (!fs.existsSync(OUT)) {
  console.error('✖ out/ does not exist. Run `next build` first.');
  process.exit(1);
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(OUT);
const relFiles = new Set(files.map((f) => path.relative(OUT, f).split(path.sep).join('/')));

// 1. Required output
const required = ['index.html', '404.html', 'sitemap.xml', 'robots.txt', 'search-index.json', 'og/field-guide.png', ...staticRoutes.map((r) => `${r.slice(1)}index.html`)];
for (const file of required) if (!relFiles.has(file)) errors.push(`missing required output: ${file}`);

// 2. Published records produce pages; nothing else under record routes
const { bundle } = loadContentTree();
const published = selectRoutablePublished(bundle);
const publishedPaths = new Set(published.map((r) => `${hrefFor(r).slice(1)}index.html`));
for (const p of publishedPaths) if (!relFiles.has(p)) errors.push(`published record has no page: ${p}`);
for (const file of relFiles) {
  const match = file.match(/^(guides|classes|dungeons|systems)\/([^/]+)\/index\.html$/);
  if (match && !publishedPaths.has(file)) errors.push(`unpublished record page exported: ${file}`);
}

// 3. No fixtures or dev pages anywhere
for (const devRoute of ['design-preview', 'review']) {
  if ([...relFiles].some((f) => f.startsWith(`${devRoute}/`))) errors.push(`dev-only /${devRoute}/ route was exported`);
}
// No unpublished record may leak by id into any exported file.
const publicIdSet = new Set(selectAllPublished(bundle).map((r) => r.id));
const hiddenIds = bundle.records.filter((r) => !publicIdSet.has(r.id)).map((r) => r.id);
const FORBIDDEN = [/designFixture/, /source:fixture-/, /fact:fixture-/, /fixture-layout-guide/, /example\.com\/design-fixture/i, /design fixture/i];
const textFiles = files.filter((f) => /\.(html|json|xml|txt|js|css)$/.test(f));
for (const file of textFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of FORBIDDEN) {
    if (pattern.test(text)) errors.push(`fixture marker ${pattern} found in ${path.relative(OUT, file)}`);
  }
  for (const id of hiddenIds) {
    if (text.includes(`"${id}"`) || text.includes(`${id}<`)) errors.push(`unpublished record ${id} appears in ${path.relative(OUT, file)}`);
  }
}

// 4. Search index and sitemap contain only published records
const index = JSON.parse(fs.readFileSync(path.join(OUT, 'search-index.json'), 'utf8')) as { documents: { id: string }[] };
const expectedDocs = new Set(buildSearchIndex(bundle).documents.map((d) => d.id));
for (const doc of index.documents) if (!publicIdSet.has(doc.id)) errors.push(`search index contains unpublished record ${doc.id}`);
if (index.documents.length !== expectedDocs.size) errors.push(`search index has ${index.documents.length} docs, expected ${expectedDocs.size}`);
const sitemap = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1] as string).pathname);
const expectedUrls = new Set([...staticRoutes, ...published.map(hrefFor)]);
for (const u of sitemapUrls) if (!expectedUrls.has(u)) errors.push(`sitemap contains unexpected URL ${u}`);
if (sitemapUrls.length !== expectedUrls.size) errors.push(`sitemap has ${sitemapUrls.length} URLs, expected ${expectedUrls.size}`);

// 5. One <h1> per page and no broken internal links
const htmlFiles = files.filter((f) => f.endsWith('.html'));
let linkCount = 0;
for (const file of htmlFiles) {
  const rel = path.relative(OUT, file);
  const html = fs.readFileSync(file, 'utf8');
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) errors.push(`${rel} has ${h1s} <h1> elements (expected exactly 1)`);
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    if (!href || href.startsWith('/_next/')) continue;
    linkCount++;
    const target = href.endsWith('/') ? `${href.slice(1)}index.html` : href.slice(1);
    if (!relFiles.has(target) && !relFiles.has(`${target}/index.html`)) errors.push(`${rel} links to missing ${href}`);
  }
}

console.log('Static export verification');
console.log(`  files: ${files.length}, html pages: ${htmlFiles.length}, internal links checked: ${linkCount}`);
console.log(`  published records: ${published.length}, search docs: ${index.documents.length}, sitemap URLs: ${sitemapUrls.length}`);
if (errors.length) {
  for (const e of [...new Set(errors)]) console.error(`  error  ${e}`);
  console.error(`\n✖ ${new Set(errors).size} export problem(s).`);
  process.exit(1);
}
console.log('\n✔ Export verified: no fixtures, drafts or broken internal links.');
