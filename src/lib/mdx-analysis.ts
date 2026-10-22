/**
 * Static analysis of MDX bodies (no compilation): fact references, headings
 * for the table of contents, and numbers that are not backed by a `<Fact>`.
 */

export type Heading = { depth: 2 | 3; text: string; id: string };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function withoutCode(body: string): string {
  return body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

export function extractHeadings(body: string): Heading[] {
  const headings: Heading[] = [];
  for (const line of withoutCode(body).split('\n')) {
    const match = line.match(/^(##|###)\s+(.+?)\s*#*\s*$/);
    if (!match) continue;
    const text = (match[2] ?? '').replace(/<[^>]+>/g, '').replace(/[*_`]/g, '').trim();
    headings.push({ depth: match[1] === '##' ? 2 : 3, text, id: slugifyHeading(text) });
  }
  return headings;
}

/** Fact ids referenced via `<Fact id="fact:..." />`. */
export function extractFactRefs(body: string): string[] {
  return [...body.matchAll(/<Fact\s+[^>]*id=["']([^"']+)["'][^>]*\/?>/g)].map((m) => m[1] as string);
}

/** `<Fact>` usages with their optional display label. */
export function extractFactUsages(body: string): { id: string; label: string | null }[] {
  return [...body.matchAll(/<Fact\s+([^>]*?)\/?>/g)].map((m) => {
    const attrs = m[1] ?? '';
    return {
      id: attrs.match(/id=["']([^"']+)["']/)?.[1] ?? '',
      label: attrs.match(/label=["']([^"']*)["']/)?.[1] ?? null,
    };
  });
}

/** Source ids referenced via `<Cite id="source:..." />`. */
export function extractCiteRefs(body: string): string[] {
  return [...body.matchAll(/<Cite\s+[^>]*id=["']([^"']+)["'][^>]*\/?>/g)].map((m) => m[1] as string);
}

/**
 * Numbers in prose that are not inside `<Fact>`, `<Term>`, code, links' URLs,
 * JSX attributes or the game's own name. Every actionable number must come
 * from a Fact record (docs/06-ACCURACY-POLICY.md).
 */
export function uncitedNumbers(body: string): string[] {
  const text = withoutCode(body)
    .replace(/<Fact\b[^>]*\/>/g, ' ')
    .replace(/<Term>[\s\S]*?<\/Term>/g, ' ')
    .replace(/<[A-Za-z][^>]*>/g, ' ') // remaining JSX/HTML tags incl. attributes
    .replace(/<\/[A-Za-z]+>/g, ' ')
    .replace(/\]\([^)]*\)/g, ']') // markdown link targets
    .replace(/\bAION\s?2\b/gi, ' ')
    .replace(/^\s*\d+\.\s/gm, ' ') // ordered-list markers
    .replace(/^#{1,6}\s/gm, ' ');
  return [...text.matchAll(/\d[\d,.:%]*/g)].map((m) => m[0]);
}
