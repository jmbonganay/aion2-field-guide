# Agent Instructions — AION 2 Field Guide

These rules apply to all coding and content agents working in this repo.

## Source of truth
- Read `README.md`, `docs/01-PRD.md`, `docs/04-ARCHITECTURE.md`, `docs/05-CONTENT-SCHEMAS.md`, `docs/06-ACCURACY-POLICY.md`, and `docs/09-ROADMAP.md` before implementing changes.
- Prefer Next.js docs shipped with the installed `next` version (if present in `node_modules/next/dist/docs/`) over memory for APIs. Use official online docs if unavailable.
- Treat the specs here as requirements, not proof of in-game facts. Game data must be independently verified.

## Build constraints
- Static-only Next.js App Router (`output: 'export'`), TypeScript strict, Tailwind CSS, local Markdown/MDX, local structured JSON/TS.
- No server database, login, tracking SDK, external paid API, edge functions, server actions, API routes, or runtime scraping.
- No server runtime dependencies. Browser-local preferences may use `localStorage` ONLY client-side with safe hydration.
- Routes must be statically known; generate dynamic paths with `generateStaticParams()` and set `dynamicParams = false`.
- Keep images locally optimized and rights-cleared. Do not assume default Next.js image optimization works with `output: 'export'`.

## Accuracy is a release blocker
- Do NOT invent mechanics or publish uncited numerical values.
- A guide must pass `docs/06-ACCURACY-POLICY.md` to be published. Otherwise mark as draft and exclude from navigation, search, sitemap and static paths.
- Store region (`global`, `kr`, `tw`) and `lastVerifiedAt` separately from `updatedAt`.
- Uncertainty MUST be written as uncertainty. For conflicts, do not silently choose a favorable source.
- Do not use old conversation answers as proof. They may contain errors or version mismatches.
- No automatic AI content publication. Human review gate for patch-sensitive recommendations.

## UX, legal and security
- Clear unofficial fansite disclaimer. Accessible keyboard focus, semantic HTML, labeled inputs, reduced-motion support.
- Never download, hotlink, or redistribute copyrighted assets without clearance; create original abstract fantasy UI assets instead.
- No automated scraping of protected sources or bypassing anti-bot restrictions. Follow site terms and robots directives.
- Avoid malicious script injection; source content is trusted only after curation. Sanitize user-influenced URL parameters.

## Workflow discipline
1. Work on the next incomplete phase only.
2. List files changed and why; summarize design/content decisions.
3. Run typecheck, lint, content validation, production build, and applicable tests before reporting completion.
4. If content cannot be verified, present a polished 'Content under verification' fallback in development; do not publish invented values.
5. Never claim deployment or tests succeeded without actual command evidence.
6. Update `docs/14-DECISIONS.md` for material changes.

## Phase stop rule
After meeting a phase's acceptance criteria, STOP and provide the user a summary plus next-phase plan. Do not continue into later phases without a new instruction.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
