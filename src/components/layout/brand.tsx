/**
 * Original brand artwork (project-owned, see public/art/original/MANIFEST.md).
 * Abstract star-and-wing constellation motif. No official AION 2 marks or art.
 */

export function BrandMark({ className = '', idSuffix = 'main' }: { className?: string; idSuffix?: string }) {
  const gradientId = `brand-star-${idSuffix}`;
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-accent-strong)" />
          <stop offset="1" stopColor="var(--color-accent-deep)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="14" r="11.5" fill="none" stroke="var(--color-line)" strokeWidth="1" />
      <path d="M16 3.5 17.7 12.3 26.5 14 17.7 15.7 16 24.5 14.3 15.7 5.5 14 14.3 12.3Z" fill={`url(#${gradientId})`} />
      <path d="M3.5 22.5c4.6.4 8.6-1.6 11-5.3M28.5 22.5c-4.6.4-8.6-1.6-11-5.3" fill="none" stroke="var(--color-accent)" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="16" cy="28" r="1.2" fill="var(--color-aura)" />
    </svg>
  );
}

const STARS: [number, number, number][] = [
  [62, 48, 1.2], [118, 92, 0.8], [176, 34, 1], [236, 70, 0.7], [298, 26, 1.1], [352, 88, 0.8], [418, 40, 1.3],
  [482, 76, 0.7], [520, 140, 1], [470, 196, 0.8], [536, 262, 1.1], [500, 338, 0.7], [440, 392, 1], [372, 420, 0.8],
  [300, 400, 0.7], [226, 430, 1.1], [150, 396, 0.8], [88, 350, 1], [40, 282, 0.7], [70, 208, 1.2], [26, 150, 0.8],
  [140, 160, 0.6], [408, 150, 0.6], [196, 300, 0.6], [360, 300, 0.6], [270, 128, 0.6],
];

/** Homepage hero illustration: astrolabe rings + wing constellation. */
export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 460" className={className} aria-hidden focusable="false">
      <defs>
        <radialGradient id="hero-aura" cx="0.5" cy="0.48" r="0.5">
          <stop offset="0" stopColor="var(--color-aura)" stopOpacity="0.22" />
          <stop offset="0.55" stopColor="var(--color-aura)" stopOpacity="0.05" />
          <stop offset="1" stopColor="var(--color-aura)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-accent-strong)" />
          <stop offset="1" stopColor="var(--color-accent-deep)" />
        </linearGradient>
        <linearGradient id="hero-wing" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--color-accent)" stopOpacity="0.8" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle cx="280" cy="220" r="220" fill="url(#hero-aura)" />

      {/* Astrolabe rings */}
      <g fill="none" stroke="var(--color-line)" strokeWidth="1">
        <circle cx="280" cy="220" r="178" />
        <circle cx="280" cy="220" r="132" strokeDasharray="2 6" />
        <circle cx="280" cy="220" r="86" stroke="var(--color-line-subtle)" />
        <ellipse cx="280" cy="220" rx="208" ry="64" transform="rotate(-18 280 220)" stroke="var(--color-line-subtle)" />
      </g>
      <g stroke="var(--color-accent-deep)" strokeWidth="1">
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = 178;
          const r2 = i % 6 === 0 ? 166 : 172;
          return (
            <line
              key={i}
              x1={(280 + Math.cos(a) * r1).toFixed(2)}
              y1={(220 + Math.sin(a) * r1).toFixed(2)}
              x2={(280 + Math.cos(a) * r2).toFixed(2)}
              y2={(220 + Math.sin(a) * r2).toFixed(2)}
            />
          );
        })}
      </g>

      {/* Wing constellation */}
      <g fill="none" stroke="url(#hero-wing)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M280 232C238 214 196 206 150 214 116 220 86 236 64 258" />
        <path d="M280 232C322 214 364 206 410 214 444 220 474 236 496 258" />
        <path d="M268 246C232 244 196 252 162 270 140 282 122 298 108 316" opacity="0.7" />
        <path d="M292 246C328 244 364 252 398 270 420 282 438 298 452 316" opacity="0.7" />
        <path d="M262 260C236 268 212 282 192 302" opacity="0.45" />
        <path d="M298 260C324 268 348 282 368 302" opacity="0.45" />
      </g>
      <g fill="var(--color-accent-strong)">
        {[
          [150, 214], [64, 258], [410, 214], [496, 258], [162, 270], [108, 316], [398, 270], [452, 316], [192, 302], [368, 302],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" />
        ))}
      </g>

      {/* Central star */}
      <path d="M280 120 288 210 372 220 288 230 280 320 272 230 188 220 272 210Z" fill="url(#hero-star)" opacity="0.95" />
      <path d="M280 176 283.5 216.5 324 220 283.5 223.5 280 264 276.5 223.5 236 220 276.5 216.5Z" fill="var(--color-ink)" opacity="0.9" />

      {/* Distant stars */}
      <g fill="var(--color-muted)">
        {STARS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} opacity={0.35 + r * 0.3} />
        ))}
      </g>
    </svg>
  );
}

/** Quiet decorative arcs for index-page heroes. */
export function HeroPattern({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 420" className={className} aria-hidden focusable="false">
      <defs>
        <radialGradient id="pattern-fade" cx="0.6" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="pattern-mask">
          <rect width="640" height="420" fill="url(#pattern-fade)" />
        </mask>
      </defs>
      <g mask="url(#pattern-mask)" fill="none" stroke="var(--color-line)" strokeWidth="1">
        <circle cx="400" cy="180" r="220" />
        <circle cx="400" cy="180" r="160" strokeDasharray="2 7" />
        <circle cx="400" cy="180" r="100" stroke="var(--color-accent-deep)" />
        <path d="M150 260C250 210 330 196 400 196S560 214 640 250" stroke="var(--color-accent-deep)" />
        <g fill="var(--color-accent)" stroke="none">
          <circle cx="400" cy="80" r="2" />
          <circle cx="500" cy="180" r="1.6" />
          <circle cx="300" cy="230" r="1.6" />
          <circle cx="560" cy="226" r="2" />
        </g>
      </g>
    </svg>
  );
}
