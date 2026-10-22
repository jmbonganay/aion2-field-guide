# Claude Code Handoff

This is an **implementation project** for an unofficial AION 2 companion site. All planning specs are in `docs/`.

## Operating mode
- Build one approved phase at a time. Initial instruction: **Phase 1 — Technical Foundation** only.
- Before coding, inspect repository files, report the intended changes briefly, and confirm the required tools already available locally; do not request paid accounts.
- If project folder contains only these docs, create the Next.js project IN THIS FOLDER while preserving all planning Markdown files.
- Read `AGENTS.md` first and honor every publishing/accuracy gate.
- Never add invented game information to make a UI look full. Use actual verified content or explicit non-public design fixtures.
- Design to a high production standard: consistent spacing, readable visual hierarchy, responsive layouts, keyboard controls, excellent loading/empty states.
- Source code and UI text: English by default. Internationalization can be Phase 5+.

## Phase 1 deliverable
- Running Next.js + TypeScript + Tailwind static export with a coherent theme.
- Config-driven global nav, footer, homepage shell, `/guides`, `/classes`, `/dungeons`, `/systems`, `/sources`, `/about`, 404.
- Reusable card, breadcrumb, badge, note, source list, typography, and section components.
- Typed seed data marked *design-fixture/not-published*, plus validation tooling and clean empty states.
- Static search architecture (basic UI may be enabled when verified content exists).
- Basic SEO metadata, sitemap/robots strategy, mobile navigation, accessible controls.
- Unit/content validation smoke tests, successful `next build` static export.
- README with installation, local development and Vercel deployment instructions.

## Do not do in Phase 1
- Do not invent complete Sorcerer builds, precise loot tables, item levels or dungeon caps.
- Do not implement a backend, accounts, live market values, scraping bots or paid services.
- Do not deploy without explicit user instruction and their existing project credentials.
- Do not begin mass content entry before the data schema and evidence gate are functioning.

## Phase 1 exit report
Provide: generated routes, screenshots or QA notes, commands actually run, errors/fixes, accuracy validation status, free-hosting configuration, and tasks for Phase 2.
