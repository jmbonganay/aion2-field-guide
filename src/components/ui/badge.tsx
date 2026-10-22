import type { ReactNode } from 'react';
import type { Fact, Source } from '@/lib/schemas';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

const toneClass: Record<BadgeTone, string> = {
  neutral: 'border-line text-muted bg-raised/60',
  accent: 'border-accent/45 text-accent-strong bg-accent/10',
  success: 'border-success/40 text-success bg-success/10',
  warning: 'border-warning/40 text-warning bg-warning/10',
  danger: 'border-danger/45 text-danger bg-danger/10',
  info: 'border-info/40 text-info bg-info/10',
};

/** Status chip. Meaning is always carried by the text label, never colour alone. */
export function Badge({ tone = 'neutral', children, title }: { tone?: BadgeTone; children: ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs leading-5 font-medium whitespace-nowrap ${toneClass[tone]}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}

const REGION_LABEL = { global: 'Global', kr: 'Korea (KR)', tw: 'Taiwan (TW)', unspecified: 'Region unspecified' } as const;

export function RegionTag({ region }: { region: keyof typeof REGION_LABEL }) {
  return (
    <Badge tone={region === 'global' ? 'info' : 'neutral'} title="Game region this applies to">
      {REGION_LABEL[region]}
    </Badge>
  );
}

const MODE_LABEL = { pve: 'PvE', pvp: 'PvP', both: 'PvE & PvP' } as const;

export function ModeTag({ mode }: { mode: keyof typeof MODE_LABEL }) {
  return <Badge>{MODE_LABEL[mode]}</Badge>;
}

const STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  in_review: { label: 'In review', tone: 'warning' },
  published: { label: 'Verified', tone: 'success' },
  stale: { label: 'Needs re-check', tone: 'danger' },
  archived: { label: 'Archived', tone: 'neutral' },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, tone: 'neutral' as const };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

const GRADE: Record<Source['grade'], { label: string; tone: BadgeTone; hint: string }> = {
  official: { label: 'Official', tone: 'accent', hint: 'Published by the game operator' },
  firsthand: { label: 'Firsthand test', tone: 'success', hint: 'Documented in-game observation' },
  independent: { label: 'Independent data', tone: 'info', hint: 'Verifiable third-party extraction with method' },
  community: { label: 'Community report', tone: 'neutral', hint: 'Player report — useful, not definitive alone' },
};

export function EvidenceBadge({ grade }: { grade: Source['grade'] }) {
  const g = GRADE[grade];
  return (
    <Badge tone={g.tone} title={g.hint}>
      {g.label}
    </Badge>
  );
}

const VERIFICATION: Record<Fact['verification'], { label: string; tone: BadgeTone }> = {
  confirmed: { label: 'Confirmed', tone: 'success' },
  reported: { label: 'Reported', tone: 'warning' },
  disputed: { label: 'Disputed', tone: 'danger' },
};

export function VerificationBadge({ verification }: { verification: Fact['verification'] }) {
  const v = VERIFICATION[verification];
  return <Badge tone={v.tone}>{v.label}</Badge>;
}

export function KindTag({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}
