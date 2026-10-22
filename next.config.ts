import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import { DETAIL_ROUTE_EXTENSION, detailRouteExtensions, publishedKinds } from './src/lib/route-gating';

/**
 * Static-only invariant (docs/04-ARCHITECTURE.md): the site is a pure
 * `output: 'export'` build. Do not add redirects, rewrites, headers,
 * API routes, Server Actions, ISR or the default image loader.
 */
export default function nextConfig(phase: string): NextConfig {
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

  // `*.dev.tsx` pages (design-fixture previews) exist only on the local dev
  // server, so fixtures can never be part of `next build`.
  // Detail routes (`page.<section>.tsx`) are enabled per section only when it
  // has published records — see src/lib/route-gating.ts.
  const pageExtensions = isDevServer
    ? ['dev.tsx', ...Object.values(DETAIL_ROUTE_EXTENSION), 'tsx', 'ts']
    : [...detailRouteExtensions(publishedKinds()), 'tsx', 'ts'];

  return {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    reactStrictMode: true,
    poweredByHeader: false,
    pageExtensions,
  };
}
