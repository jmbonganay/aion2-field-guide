import { ModeTag, RegionTag, StatusBadge } from '@/components/ui/badge';
import { EntryCard } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { hrefFor, KIND_LABEL } from '@/lib/links';
import { recordTitle, type ContentRecord, type RecordOfKind, type RoutableKind } from '@/lib/schemas';

export function recordKindLabel(record: ContentRecord): string {
  if (record.kind === 'dungeon') return `Dungeon · ${record.category}`;
  if (record.kind === 'guide') return `Guide · ${record.category}`;
  return KIND_LABEL[record.kind];
}

export function RecordCard({ record, href, showStatus = false }: { record: RecordOfKind<RoutableKind>; href?: string; showStatus?: boolean }) {
  const verified = formatDate(record.lastVerifiedAt);
  return (
    <EntryCard
      href={href ?? hrefFor(record)}
      kind={recordKindLabel(record)}
      title={recordTitle(record)}
      summary={record.summary}
      badges={
        <>
          <RegionTag region={record.region} />
          {record.kind === 'guide' && record.mode ? <ModeTag mode={record.mode} /> : null}
          {record.kind === 'class' ? record.modes.map((m) => <ModeTag key={m} mode={m} />) : null}
          {showStatus ? <StatusBadge status={record.status} /> : null}
        </>
      }
      meta={verified ? <>Verified <time dateTime={record.lastVerifiedAt ?? undefined}>{verified}</time></> : 'Not yet verified'}
    />
  );
}
