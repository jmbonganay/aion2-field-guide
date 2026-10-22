import { RecordPage, recordMetadata, recordStaticParams } from '@/lib/record-page';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return recordStaticParams('class');
}

export function generateMetadata({ params }: Props) {
  return recordMetadata('class', params);
}

export default function Page({ params }: Props) {
  return <RecordPage kind="class" params={params} />;
}
