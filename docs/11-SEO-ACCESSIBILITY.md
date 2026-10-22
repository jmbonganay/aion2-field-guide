# 11 — SEO, Accessibility & Performance

## SEO strategy
- Semantic readable URLs with slugs, breadcrumbs and descriptive headings.
- Unique meta title/description; append unofficial branding clearly.
- Build-time sitemap/robots/canonicals using configured `SITE_URL` known at deploy time. Avoid canonical URLs pointing to random preview deployments.
- Add structured data only when appropriate and grounded (`BreadcrumbList`, `Article`, `FAQPage` only if actual visible questions and current search policies support it). No fictitious reviews/ratings.
- Internal link clusters: Sorcerer -> Stigmas -> farming materials -> dungeon source.
- Version-sensitive content shows patch and verification date. Historical entries archived or noindexed where appropriate.
- Don't stuff keywords or manufacture mass-produced pages to fill gaps.

## Performance budget
- Mostly server-rendered static HTML and CSS; JavaScript only for search, filtering and local interactions.
- Lazy-load heavy search index and below-fold imagery.
- No autoplay background video; no giant remote fonts or proprietary design assets.
- Set image sizes to avoid layout shift; prefer small WebP/AVIF and vector decorations.
- Avoid dependencies requiring live API calls on visitor page loads.
- CI optionally runs Lighthouse against production build/previews without paid observability.

## Accessibility
- Meet WCAG 2.2 AA wherever practical; semantic landmarks: header/nav/main/footer.
- All icons/text have accessible names where needed; headings in order.
- Contrast normal text >=4.5:1 and large text >=3:1, verify the palette.
- Keyboard access, skip-to-content, visible focus, `aria-expanded` on menus.
- Dialog open/close properly manages focus and Escape.
- Tables have captions/headers; responsive behavior maintains relationships.
- Rarity, status, and warnings must not rely only on colors.
- Respect reduced-motion; avoid animated flashing effects.
- Form/search errors explained in text, not by red border alone.

## Privacy
- Prefer no analytics, cookies or visitor tracking during MVP.
- If progress checklists use localStorage, explain 'this device only' on site.
- Don't claim to support GDPR-specific guarantees without reviewing features and privacy disclosures.

## Release checks
`npm run build`, content validation, lighthouse, axe/core or manual accessibility audit, desktop/mobile navigation, actual Vercel deep links, readable no-JS fallback.
