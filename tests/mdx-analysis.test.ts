import { describe, expect, it } from 'vitest';
import { extractCiteRefs, extractFactRefs, extractHeadings, slugifyHeading, uncitedNumbers } from '@/lib/mdx-analysis';

describe('mdx analysis', () => {
  it('extracts h2/h3 headings with stable ids, ignoring code blocks', () => {
    const body = '## Quick answer\n\ntext\n\n### Hard mode: rewards\n\n```\n## not a heading\n```\n';
    expect(extractHeadings(body)).toEqual([
      { depth: 2, text: 'Quick answer', id: 'quick-answer' },
      { depth: 3, text: 'Hard mode: rewards', id: 'hard-mode-rewards' },
    ]);
    expect(slugifyHeading("Philosopher's Stone: Revelation")).toBe('philosophers-stone-revelation');
  });

  it('extracts Fact and Cite references', () => {
    const body = 'A <Fact id="fact:a" /> and <Fact label="x" id="fact:b"/> per <Cite id="source:s" />.';
    expect(extractFactRefs(body)).toEqual(['fact:a', 'fact:b']);
    expect(extractCiteRefs(body)).toEqual(['source:s']);
  });

  it('flags numbers outside Fact/Term/code/links/game name/list markers', () => {
    expect(uncitedNumbers('Costs 25,000 Kina for 30 items.')).toEqual(['25,000', '30']);
    expect(uncitedNumbers('<Fact id="fact:a" /> in AION 2 with <Term>Specialty 1</Term> and `x2` [link](/a/1/)\n\n1. step')).toEqual([]);
  });
});
