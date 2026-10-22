import { getBundle } from '@/lib/content';
import { buildSearchIndex } from '@/lib/search-index';

// Emitted as a static file (`out/search-index.json`) at build time.
export const dynamic = 'force-static';

export function GET() {
  return Response.json(buildSearchIndex(getBundle()));
}
