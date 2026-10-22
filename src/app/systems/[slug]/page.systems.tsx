import { RecordPage, recordMetadata, recordStaticParams } from '@/lib/record-page';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return recordStaticParams('system');
}

export function generateMetadata({ params }: Props) {
  return recordMetadata('system', params);
}

export default function Page({ params }: Props) {
  return <RecordPage kind="system" params={params} />;
}
