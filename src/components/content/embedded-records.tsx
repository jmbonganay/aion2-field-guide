import { Badge, StatusBadge } from '@/components/ui/badge';
import { anchorFor } from '@/lib/links';
import type { Fact, Patch, RecordOfKind } from '@/lib/schemas';
import { formatDate, formatFactValue, humanizeProperty } from '@/lib/format';

function factsFor(ids: string[], facts: Fact[]): Fact[] {
  const byId = new Map(facts.map((f) => [f.id, f]));
  return ids.map((id) => byId.get(id)).filter((f): f is Fact => Boolean(f));
}

function FactLines({ facts }: { facts: Fact[] }) {
  if (!facts.length) return null;
  return (
    <ul className="mt-3 space-y-1.5 text-sm text-muted">
      {facts.map((fact) => (
        <li key={fact.id} className="flex gap-2">
          <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
          <span>
            {humanizeProperty(fact.property)}:{' '}
            <a href={`#${fact.id.replace(':', '-')}`} className="link">
              {formatFactValue(fact)}
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Skills of a class, each with an anchor so search can link straight to it. */
export function SkillList({ skills, facts, showStatus = false }: { skills: RecordOfKind<'skill'>[]; facts: Fact[]; showStatus?: boolean }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {skills.map((skill) => (
        <li key={skill.id} id={anchorFor(skill)} className="scroll-mt-24 rounded-card border border-line-subtle bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg">{skill.name}</h3>
            {showStatus ? <StatusBadge status={skill.status} /> : null}
          </div>
          <p className="mt-1.5 text-[0.95rem] text-muted">{skill.summary}</p>
          <FactLines facts={factsFor(skill.factIds, facts)} />
        </li>
      ))}
    </ul>
  );
}

/** Items referenced by a page. Unknown attributes say so instead of guessing. */
export function ItemList({ items, facts, showStatus = false }: { items: RecordOfKind<'item'>[]; facts: Fact[]; showStatus?: boolean }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} id={anchorFor(item)} className="scroll-mt-24 rounded-card border border-line-subtle bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg">{item.name}</h3>
            {showStatus ? <StatusBadge status={item.status} /> : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)}</Badge>
            {item.bound === true ? <Badge tone="info">Bound</Badge> : item.bound === false ? <Badge>Tradable</Badge> : null}
            {item.rarity ? <Badge tone="accent">{item.rarity}</Badge> : null}
          </div>
          <p className="mt-2 text-[0.95rem] text-muted">{item.summary}</p>
          <FactLines facts={factsFor(item.factIds, facts)} />
        </li>
      ))}
    </ul>
  );
}

/** Official updates that changed this page's subject, newest first. */
export function PatchHistory({ patches, sourceNumber }: { patches: Patch[]; sourceNumber: Map<string, number> }) {
  return (
    <ol className="space-y-3">
      {patches.map((patch) => (
        <li key={patch.id} className="rounded-card border border-line-subtle bg-surface p-5">
          <p className="text-sm text-subtle">
            {patch.label}
            {patch.effectiveAt ? (
              <>
                {' · live from '}
                <time dateTime={patch.effectiveAt}>{formatDate(patch.effectiveAt)}</time> (UTC)
              </>
            ) : null}
          </p>
          <h3 className="mt-1 text-lg">
            {patch.title}{' '}
            <a href={`#${patch.sourceId.replace(':', '-')}`} className="link align-super text-xs">
              [{sourceNumber.get(patch.sourceId) ?? '?'}]
            </a>
          </h3>
          <p className="mt-1.5 text-[0.95rem] text-muted">{patch.summary}</p>
        </li>
      ))}
    </ol>
  );
}
