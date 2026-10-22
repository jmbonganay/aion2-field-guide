import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const css = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
const token = (name: string): string => {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match?.[1]) throw new Error(`token --color-${name} not found`);
  return match[1];
};

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

// WCAG 2.2 AA: 4.5:1 for normal text on every surface text appears on.
const TEXT = ['ink', 'muted', 'subtle', 'accent', 'accent-strong', 'danger', 'success', 'warning', 'info', 'focus'];
const SURFACES = ['canvas', 'surface', 'raised', 'sunken'];

describe('design token contrast', () => {
  for (const fg of TEXT) {
    for (const bg of SURFACES) {
      it(`${fg} on ${bg} >= 4.5:1`, () => {
        expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('focus ring is >= 3:1 against every surface (non-text contrast)', () => {
    for (const bg of SURFACES) expect(contrast(token('focus'), token(bg))).toBeGreaterThanOrEqual(3);
  });

  it('skip link text (canvas on accent) >= 4.5:1', () => {
    expect(contrast(token('canvas'), token('accent'))).toBeGreaterThanOrEqual(4.5);
  });
});
