# Content directory

Only records that pass the publication gate (`src/lib/publication.ts`) become pages,
search results or sitemap entries. Read `docs/05-CONTENT-SCHEMAS.md` and
`docs/06-ACCURACY-POLICY.md` before adding anything here.

| Path | Contents |
|---|---|
| `sources.json` | Source registry (array). Every cited URL lives here. |
| `facts/*.json` | Arrays of Fact records — every numeric or actionable claim. |
| `patches/*.json` | One official update per file; drives patch history and currentness checks. |
| `guides/<slug>.mdx` | Guide frontmatter (YAML) + MDX body. File name = slug. |
| `classes|dungeons|systems/<slug>.json` | One record per file, with an optional `<slug>.mdx` body. |
| `skills/<slug>.json` | Skills, shown on their class page (anchor `#skill-<slug>`). |
| `items/<slug>.json` | Items, shown on pages that list them in `relatedIds`. |
| `fixtures/` | **Design fixtures only.** Never loaded by public selectors. |

## Writing a body

- Every number or actionable value comes from a fact: `<Fact id="fact:..." />`. Use `label="…"` to reword it; any number in the label must match the fact's value.
- Cite a whole source with `<Cite id="source:..." />` (must be listed in `sourceIds`).
- A name that contains digits (a patch label, "Specialty 1") goes in `<Term>…</Term>`.
- Any other digit in prose fails the build for published content and warns for drafts.
- Use `<Note tone="info|warning">` for callouts. Label editorial advice as editorial.
- Put unanswered questions in the record's `unverified` list — never guess.

## Facts

`capturedBy`/`capturedAt` record who extracted a claim. `verifiedBy`/`lastVerifiedAt` are set
**only** by a different, human reviewer through `npm run content:approve`.

## Workflow

1. Add sources → facts → record (status `draft`, then `in_review`). Run `npm run content:validate`.
2. `npm run content:review` lists what blocks each record; `npm run dev` → `/review/` previews it.
3. A human reviewer (not the author, not the fact capturer) checks each fact and runs
   `npm run content:approve -- <id> --reviewer "Name" --i-checked-the-sources`.
4. When an official patch changes a subject, add it to `patches/` with `changedIds`; affected
   pages drop out of the site until re-verified.
