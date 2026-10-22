import { RecordPage, recordMetadata, recordStaticParams } from '@/lib/record-page';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return recordStaticParams('dungeon');
}

export function generateMetadata({ params }: Props) {
  return recordMetadata('dungeon', params);
}

export default function Page({ params }: Props) {
  return <RecordPage kind="dungeon" params={params} />;
}
