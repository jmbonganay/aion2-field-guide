import type { ReactNode } from 'react';
import { AlertIcon, InfoIcon, ShieldCheckIcon, ClockIcon } from './icons';

export type NoteTone = 'info' | 'warning' | 'verify' | 'fixture';

const tones: Record<NoteTone, { label: string; className: string; Icon: typeof InfoIcon }> = {
  info: { label: 'Note', className: 'border-info/35 bg-info/[0.06] [--note:var(--color-info)]', Icon: InfoIcon },
  warning: { label: 'Important', className: 'border-warning/40 bg-warning/[0.07] [--note:var(--color-warning)]', Icon: AlertIcon },
  verify: { label: 'Verification pending', className: 'border-line bg-raised/50 [--note:var(--color-muted)]', Icon: ClockIcon },
  fixture: {
    label: 'Design fixture — not published',
    className: 'border-danger/45 bg-danger/[0.07] [--note:var(--color-danger)]',
    Icon: ShieldCheckIcon,
  },
};

/** Callout. The tone label is rendered as text so meaning never depends on colour. */
export function Note({ tone = 'info', title, children }: { tone?: NoteTone; title?: string; children: ReactNode }) {
  const t = tones[tone];
  return (
    <aside role="note" className={`flex gap-3 rounded-card border p-4 sm:p-5 ${t.className}`}>
      <t.Icon className="mt-0.5 shrink-0 text-xl text-(--note)" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-(--note)">{title ?? t.label}</p>
        <div className="mt-1 text-[0.95rem] leading-relaxed text-muted [&_a]:text-accent-strong [&_a]:underline [&_a]:underline-offset-2">{children}</div>
      </div>
    </aside>
  );
}
