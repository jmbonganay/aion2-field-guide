/**
 * Original, project-owned share image (no game artwork), rendered with next/og.
 */
import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import { site } from '../src/config/site';

// Original, project-owned share image (no game artwork). Generated once at build time.
const alt = `${site.name} — an unofficial, source-checked AION 2 Global companion`;
const size = { width: 1200, height: 630 };


function render() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'radial-gradient(circle at 82% 18%, #1d2a4a 0%, #0b1019 55%)',
          color: '#f4f0e7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 32 32">
            <circle cx="16" cy="14" r="11.5" fill="none" stroke="#344155" strokeWidth="1" />
            <path d="M16 3.5 17.7 12.3 26.5 14 17.7 15.7 16 24.5 14.3 15.7 5.5 14 14.3 12.3Z" fill="#ebd29d" />
            <path d="M3.5 22.5c4.6.4 8.6-1.6 11-5.3M28.5 22.5c-4.6.4-8.6-1.6-11-5.3" fill="none" stroke="#d8b87a" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="16" cy="28" r="1.2" fill="#7f9cf5" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 40, fontWeight: 700 }}>{site.name}</span>
            <span style={{ fontSize: 20, letterSpacing: 6, color: '#93a0b4' }}>UNOFFICIAL · GLOBAL</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, maxWidth: 900 }}>A field guide built on evidence, not guesswork.</span>
          <span style={{ fontSize: 28, color: '#bac4d2', maxWidth: 920 }}>Every published claim shows its source, region and last-verified date.</span>
        </div>
        <div style={{ display: 'flex', height: 2, width: '100%', background: 'linear-gradient(90deg, #8a6a33, #d8b87a 50%, transparent)' }} />
      </div>
    ),
    size,
  );
}

// Usage: npm run og:generate — writes public/og/field-guide.png (commit the result).
const png = Buffer.from(await render().arrayBuffer());
fs.mkdirSync('public/og', { recursive: true });
fs.writeFileSync('public/og/field-guide.png', png);
console.log(`wrote public/og/field-guide.png (${png.length} bytes, ${size.width}x${size.height}) — alt: ${alt}`);
