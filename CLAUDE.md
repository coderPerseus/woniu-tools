# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 TypeScript starter using the App Router, React 19, and pnpm as the package manager. It's configured with strict TypeScript, ESLint 9, Prettier, Husky git hooks, and T3 Env for type-safe environment variables.

## Essential Commands

### Development
```bash
pnpm dev              # Start dev server at http://localhost:3000
pnpm build            # Production build
pnpm start            # Start production server
```

### Quality Checks
```bash
pnpm type-check       # TypeScript validation (tsc --noEmit)
pnpm lint             # Run ESLint on src/**/*.+(ts|js|tsx)
pnpm lint:fix         # Run ESLint with --fix
pnpm format           # Format all files with Prettier
pnpm format:check     # Check Prettier formatting
```

## Architecture

### Environment Variables (T3 Env)

Environment variables are managed through T3 Env with Zod schemas:

- **Server-side variables**: Define in `src/lib/env/server.ts` using the `server` object
- **Client-side variables**: Define in `src/lib/env/client.ts` using the `client` object (must be prefixed with `NEXT_PUBLIC_`)
- Both files are imported in `next.config.ts` to ensure validation at build time
- Set `SKIP_ENV_VALIDATION=1` to bypass validation (useful for Docker builds)

When adding new environment variables, update the appropriate schema file with Zod validation.

### Redirects System

Redirects are centrally managed in `redirects.ts` as a typed array. The file exports a `Redirect[]` that's imported and used in `next.config.ts`. This provides autocomplete and type safety for redirect definitions.

### Content Security Policy

The project implements security headers in `next.config.ts`:
- Minimal CSP defined in `ContentSecurityPolicy` constant
- Missing CSP directives (frame-src, connect-src, script-src, etc.) are intentionally left for per-project customization
- Headers applied to all routes via `async headers()` config

### Path Mapping

TypeScript path aliases are configured in `tsconfig.json`:
- `@/*` maps to `./src/*`
- `@/public/*` maps to `./public/*`

Import using these aliases:
```tsx
import { Component } from '@/components/Component';
import logo from '@/public/logo.png';
```

## Git Workflow

### Commit Message Format

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (enforced by commitlint):
```
type(scope?): subject

Examples:
feat: add user authentication
fix(api): resolve timeout issue
docs: update README
```

### Husky Hooks

Three git hooks are configured:

1. **pre-commit** (disabled by default): Runs lint-staged (ESLint --fix + Prettier on staged files)
   - Enable by running: `echo 'HUSKY_ENABLED=true' > .husky/_/pre-commit.options`
2. **commit-msg**: Validates commit message format with commitlint
3. **post-merge**: Runs `pnpm install` if `pnpm-lock.yaml` changed

### Lint-staged Configuration

Defined in `.lintstagedrc.js`:
- Runs ESLint --fix on staged `*.{js,jsx,ts,tsx}` files
- Runs Prettier --write on staged files

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/lib/env/` - T3 Env configuration for server/client environment variables
- `public/` - Static assets
- `redirects.ts` - Centralized redirect definitions
- `next.config.ts` - Next.js configuration with CSP and security headers

## Configuration Files

- **TypeScript**: Strict mode enabled with `noUncheckedIndexedAccess`, ES2022 target, ESNext modules
- **React Compiler**: Enabled via `reactCompiler: true` in next.config.ts
- **Turbopack**: File system caching enabled for dev via `turbopackFileSystemCacheForDev`
- **Node Version**: Requires Node.js >= 24, pnpm 10 (see `.nvmrc`)
