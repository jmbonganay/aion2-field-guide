import { RecordPage, recordMetadata, recordStaticParams } from '@/lib/record-page';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return recordStaticParams('guide');
}

export function generateMetadata({ params }: Props) {
  return recordMetadata('guide', params);
}

export default function Page({ params }: Props) {
  return <RecordPage kind="guide" params={params} />;
}
