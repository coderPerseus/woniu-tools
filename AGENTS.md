# Repository Guidelines

## Project Structure & Module Organization
- `src/app` (App Router) hosts layouts/pages/styles; add routes as folder segments with `page.tsx`.
- `src/lib/env` contains T3 Env schemas; extend when introducing new server/client variables.
- `public/` keeps static assets referenced at the site root.
- `redirects.ts` defines typed redirects; `next.config.ts` houses CSP and other Next settings.
- Tooling lives at the root: `eslint.config.mjs`, `.prettierrc.json`, `.commitlintrc.json`, `.husky/` hooks.

## Build, Test, and Development Commands
- `pnpm dev` — run locally at http://localhost:3000.
- `pnpm build` — production build + env validation.
- `pnpm start` — serve the built app.
- `pnpm lint` / `pnpm lint:fix` — ESLint with Next/TS/Prettier rules.
- `pnpm type-check` — TypeScript `--noEmit`.
- `pnpm format`, `pnpm format:check`, `pnpm format:ci` — Prettier with sorted imports/JSON.
- Optional pre-commit: `echo 'HUSKY_ENABLED=true' > .husky/_/pre-commit.options` to enable lint-staged.

## Coding Style & Naming Conventions
- TypeScript strict; React 19 + Next 16 App Router.
- Prettier: 2 spaces, 120 characters, single quotes, trailing commas; imports ordered via `@ianvs/prettier-plugin-sort-imports`.
- ESLint: next/core-web-vitals + typescript-eslint strict; Prettier errors fail CI.
- Paths: use aliases (`@/*`, `@/public/*`) instead of deep relative imports.
- Name routes by segment (`app/about/page.tsx`), keep components colocated with features.

## Testing Guidelines
- No tests yet; add `*.test.ts(x)` or `*.spec.ts(x)` near features or under `__tests__`.
- Run `pnpm lint` and `pnpm type-check` before pushing; adopt Playwright/React Testing Library as logic grows.

## Commit & Pull Request Guidelines
- Use Conventional Commits (checked by commitlint): e.g., `feat: add user banner`, `chore: bump deps`.
- Hooks: `commit-msg` always on; optional `pre-commit` (lint-staged); `post-merge` runs `pnpm install` if `pnpm-lock.yaml` changed.
- PRs should link an issue, summarize the change, include screenshots for UI, and note test commands run.

## Security & Configuration Tips
- Secrets live in `.env.local`; expose client-facing values with `NEXT_PUBLIC_`. Validation can be skipped via `SKIP_ENV_VALIDATION` (use sparingly).
- Requires Node.js ≥ 24 and pnpm 10. After pulling, run `pnpm install` (auto-triggered when the lockfile changes).
- Review CSP in `next.config.ts` before adding third-party scripts; manage URL changes via `redirects.ts`.
