# Original art manifest

Every image the site ships is listed here (docs/12-LEGAL-ASSETS.md). No official
AION 2 / NCSOFT artwork, logos, icons, screenshots or map assets are used.

```yaml
- asset: /art/original/brand-mark.svg (also src/app/icon.svg)
  creator: site team
  source: original work
  license: project-owned
  permission_verified_at: 2026-10-22
  use: brand mark and favicon

- asset: src/components/layout/brand.tsx (inline SVG — BrandMark, HeroIllustration, HeroPattern)
  creator: site team
  source: original work
  license: project-owned
  permission_verified_at: 2026-10-22
  use: header/footer mark, homepage hero illustration, index-page decoration

- asset: src/components/ui/icons.tsx (inline SVG line icons)
  creator: site team
  source: original work
  license: project-owned
  permission_verified_at: 2026-10-22
  use: interface icons
```

```yaml
- asset: /og/field-guide.png (rendered by scripts/generate-og.tsx)
  creator: site team
  source: original work (brand mark + system typography, rendered at build time)
  license: project-owned
  permission_verified_at: 2026-10-22
  use: social share preview image
```
