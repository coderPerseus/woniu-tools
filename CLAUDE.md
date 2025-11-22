# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Woniu Toolbox (蜗牛工具箱)** - A collection of online tools for developers, designers, and productivity enthusiasts. Built with Next.js 16 TypeScript starter using the App Router, React 19, and pnpm. Features 16 tools across 5 categories including image tools, AI assistants, developer tools, entertainment tools, and educational resources. Configured with strict TypeScript, ESLint 9, Prettier, Husky git hooks, T3 Env for type-safe environment variables, Tailwind CSS 4, and shadcn/ui components.

## Essential Commands

### Development
```bash
pnpm dev              # Start dev server (Turbopack enabled)
pnpm build            # Production build with type checking
pnpm start            # Start production server
pnpm analyze          # Analyze bundle size
```

### Quality Checks
```bash
pnpm type-check       # TypeScript validation (tsc --noEmit)
pnpm lint             # Run ESLint on src/**/*.+(ts|js|tsx)
pnpm lint:fix         # Run ESLint with --fix
pnpm format           # Format all files with Prettier
pnpm format:check     # Check Prettier formatting
```

### Adding New Tools
```bash
# 1. Update tool configuration
# Edit: src/constants/tools.ts (add to appropriate category)

# 2. Add translations
# Edit: messages/zh.json and messages/en.json (add tool.name and tool.desc)

# 3. Create component (if internal tool)
# Create: src/components/tools/your-tool-name.tsx

# 4. Update translations if needed
# The tool will automatically appear in the correct category
```

### Git Workflow
```bash
# Stage changes
git add .

# Commit (uses Husky and commitlint)
git commit -m "feat: add new tool"

# Push
git push

# Pre-commit hooks can be enabled:
echo 'HUSKY_ENABLED=true' > .husky/_/pre-commit.options
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

### Tailwind CSS 4

This project uses Tailwind CSS v4 with the following setup:

- **Configuration**: `tailwind.config.ts` for theme customization
- **PostCSS**: Configured in `postcss.config.mjs` with `@tailwindcss/postcss`
- **Global CSS**: Uses `@import "tailwindcss"` directive in `src/app/globals.css`
- **Theme Variables**: CSS variables defined in `:root` with `@theme inline` for Tailwind integration
- **Dark Mode**: Configured with `darkMode: 'class'` - toggle by adding/removing `dark` class on `<html>`

Key differences from Tailwind v3:
- Uses `@import "tailwindcss"` instead of `@tailwind` directives
- Theme variables use `@theme inline` to expose CSS variables to Tailwind
- Colors use HSL format with CSS variables (e.g., `hsl(var(--background))`)
- OkLCH color space support for better color representation

**Dark Mode Implementation:**
```css
.dark {
  --background: oklch(0.2223 0.0060 271.1393);
  --foreground: oklch(0.9551 0 0);
  /* ... more color variables ... */
}
```

The `dark` class is toggled on `<html>` by `next-themes`, applying the color scheme switch instantly.

### Theme Toggle

The theme toggle button is located in `src/components/site-nav.tsx`:
- Uses `next-themes` for theme management
- Sun/Moon icon transitions with rotation and scale
- Responsive positioning ensures icons align correctly
- Stores user preference in localStorage
- Respects system preference on first visit

### shadcn/ui Components

shadcn/ui is configured for this project:

- **Components Directory**: `src/components/ui/`
- **Utilities**: `src/lib/utils.ts` contains the `cn()` helper for merging class names
- **Configuration**: `components.json` defines paths and preferences
- **Adding Components**: Run `pnpm dlx shadcn@latest add <component-name>`

Example usage:
```tsx
import { Button } from '@/components/ui/button';

export default function Page() {
  return <Button variant="outline">Click me</Button>;
}
```

All components are copied into your project (not installed as dependencies), allowing full customization. Components use:
- `class-variance-authority` for variant management
- `tailwind-merge` for class name merging
- `@radix-ui/*` for accessible primitives
- `lucide-react` for icons

### SEO Configuration

SEO is configured using Next.js 16's Metadata API with centralized configuration:

- **Configuration File**: `src/config/site.ts` contains all SEO-related settings
  - Site metadata (title, description, keywords, URLs)
  - Open Graph and Twitter Card settings
  - Schema.org structured data
  - Analytics IDs (Google Analytics, Baidu Analytics)
  - Author and social media information

- **Metadata**: Exported from `src/app/layout.tsx` using the Metadata API
  - Automatic meta tag generation
  - Open Graph and Twitter Card tags
  - Canonical URLs and alternate links
  - Robots meta tags for crawler control

- **Sitemap**: Generated at `src/app/sitemap.ts`
  - Automatically creates `/sitemap.xml` at build time
  - Update the sitemap when adding new pages/tools
  - Configured with proper priorities and change frequencies

- **Robots.txt**: Generated at `src/app/robots.ts`
  - Automatically creates `/robots.txt` at build time
  - Allows all crawlers by default
  - Disallows private routes (/api/private/, /admin/)

- **Structured Data**: Schema.org WebSite markup in layout
  - Improves search engine understanding
  - Enables rich snippets in search results
  - Configured for search functionality

- **PWA Manifest**: `/public/manifest.json` for progressive web app support

**Important**: Many fields in `src/config/site.ts` are intentionally left empty (marked with "To be filled by user") for you to customize:
- Author information
- Social media links
- Analytics IDs
- ICP registration
- Open Graph images
- Verification codes

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

### Site & Tools Configuration

The project uses a dual configuration system:

#### 1. Static Site Configuration (`src/config/site.ts`)
- **Site Information**: Name, title, description, keywords, URLs
- **Categories**: Tool categories with icons and descriptions (5 categories)
- **Homepage Content**: Hero section and footer text
- **Author & Social**: Contact information and social media links

**Key Exports:**
- `siteConfig` - Basic site information
- `categoriesConfig` - Tool categories configuration
- `homepageConfig` - Homepage text content
- `defaultMetadata` - SEO metadata for Next.js
- `schemaOrgConfig` - Schema.org structured data

#### 2. Dynamic Tools Data (Centralized Management)
**Two files work together for tools data:**

- **`src/constants/tools.ts`** - Defines tool structure and metadata:
  ```typescript
  export const toolKeys = {
    'image-tools': ['image-compress', 'format-converter', 'bg-remover', 'chrome-icon-generator'],
    'ai-tools': ['chatGPT', 'Gemini', 'claude', 'qwen', 'deepseek', 'kimi', 'minimax'],
    'dev-tools': ['vscode', 'claudeCode', 'codex'],
    'fun-tools': ['jsdate'],
    'other-tools': ['freeCodeCamp'],
  } as const;
  ```
  - Maps tools by category with translation keys
  - Stores external URLs via `toolUrlMap`
  - Type-safe tool definitions
  - Icon mapping for categories

- **`messages/zh.json`** & **`messages/en.json`** - Contains actual tool names and descriptions:
  ```json
  {
    "tools": {
      "image-compress": {
        "name": "图片压缩",
        "desc": "无损压缩 PNG/JPG 图片，支持批量处理。"
      },
      "chatGPT": {
        "name": "ChatGPT",
        "desc": "OpenAI 出品的对话与代码助手。"
      }
    }
  }
  ```

**Adding a New Tool:**
1. Add tool key to appropriate category in `src/constants/tools.ts`
2. Add tool data to `messages/zh.json` and `messages/en.json`
3. Add URL mapping if it's an external tool
4. Create component if it's an internal tool (e.g., `chrome-icon-generator`)

See `docs/CONFIG-GUIDE.md` for detailed configuration instructions.

### Internationalization (i18n)

The project supports Chinese (zh) and English (en) using next-intl:

- **Routing**: `src/i18n/routing.ts` - Locale configuration
- **Middleware**: `src/middleware.ts` - Automatic language detection based on browser preferences
- **Translations**: `messages/zh.json` and `messages/en.json`
- **Language Switcher**: `src/components/language-switcher.tsx` - UI component for language switching

**URL Structure:**
- `/` → Redirects to `/zh` or `/en` based on browser language
- `/zh` → Chinese version
- `/en` → English version

**Usage in Components:**
```tsx
// Server Components
import { getTranslations } from 'next-intl/server';
const t = await getTranslations();
<h1>{t('site.name')}</h1>

// Client Components
'use client';
import { useTranslations } from 'next-intl';
const t = useTranslations();
```

**Navigation:**
```tsx
import { Link } from '@/i18n/routing';
<Link href="/about">About</Link>  // Auto-prefixes with locale
```

See `docs/I18N-GUIDE.md` for complete internationalization guide.

## Project Structure

```
woniu-tools/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # Localized routes (zh/en)
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── layout.tsx           # Locale layout with providers
│   │   │   └── tools/[id]/          # Dynamic tool pages
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles & CSS variables
│   │   ├── globals.css.d.ts         # CSS types
│   │   ├── sitemap.ts               # SEO sitemap
│   │   └── robots.ts                # SEO robots.txt
│   ├── components/                   # React components
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   └── popover.tsx
│   │   ├── tools/                   # Individual tool components
│   │   │   └── chrome-icon-generator.tsx
│   │   ├── category-item.tsx        # Category display component
│   │   ├── site-nav.tsx             # Navigation with theme toggle
│   │   ├── site-footer.tsx          # Footer component
│   │   ├── tool-search.tsx          # Search functionality
│   │   ├── language-switcher.tsx    # Language switcher
│   │   └── theme-provider.tsx       # Theme provider (next-themes)
│   ├── config/
│   │   └── site.ts                  # Site configuration & SEO
│   ├── constants/
│   │   └── tools.ts                 # Tool categories & keys
│   ├── lib/                         # Utilities
│   │   ├── env/                     # T3 Env validation
│   │   │   ├── server.ts
│   │   │   └── client.ts
│   │   └── utils.ts                 # cn() helper
│   ├── i18n/                        # Internationalization
│   │   ├── routing.ts
│   │   └── request.ts
│   └── middleware.ts                # Locale detection
├── messages/                        # Translation files
│   ├── zh.json                     # Chinese translations
│   └── en.json                     # English translations
├── public/                         # Static assets
│   ├── manifest.json               # PWA manifest
│   └── *.png                       # Images
├── docs/                           # Documentation
│   ├── CONFIG-GUIDE.md
│   ├── I18N-GUIDE.md
│   ├── SEO-SETUP.md
│   └── I18N-QUICKSTART.md
├── next.config.ts                  # Next.js config with CSP
├── tailwind.config.ts              # Tailwind CSS v4 config
├── postcss.config.mjs              # PostCSS for Tailwind v4
├── components.json                 # shadcn/ui config
├── tsconfig.json                   # TypeScript config
├── redirects.ts                    # Centralized redirects
├── .nvmrc                         # Node.js version (>=24)
└── .lintstagedrc.js               # Lint-staged config
```

### Key Components

**Tool Components:**
- Located in `src/components/tools/`
- Each tool is a separate component (e.g., `chrome-icon-generator.tsx`)
- Uses client-side features (`'use client'` directive)
- Examples: Image compression, Chrome icon generator, etc.

**Site Components:**
- `site-nav.tsx` - Top navigation with sticky positioning, theme toggle, language switcher
- `category-item.tsx` - Displays tool category cards on homepage
- `tool-search.tsx` - Search/filter tools functionality
- `language-switcher.tsx` - i18n language toggle
- `site-footer.tsx` - Footer with links and copyright

**Layout Structure:**
- Root layout (`src/app/layout.tsx`) - Base HTML structure
- Locale layout (`src/app/[locale]/layout.tsx`) - Wraps pages with theme/intl providers
- Page components - Individual route pages

## Configuration Files

- **TypeScript**: Strict mode enabled with `noUncheckedIndexedAccess`, ES2022 target, ESNext modules
- **React Compiler**: Enabled via `reactCompiler: true` in next.config.ts
- **Turbopack**: File system caching enabled for dev via `turbopackFileSystemCacheForDev`
- **Node Version**: Requires Node.js >= 24, pnpm 10 (see `.nvmrc`)

## Available Tools

The site features **16 tools** across **5 categories**:

### 📷 Image Tools (4 tools)
- **Image Compress** - Lossless PNG/JPG compression with batch support
- **Format Converter** - Convert WebP to JPG or PNG
- **Background Remover** - AI-powered background removal
- **Chrome Icon Generator** - Generate full-size PNG, dark-mode inverted, and toolbar SVG

### 🤖 AI Tools (7 tools)
- **ChatGPT** - OpenAI's conversational and coding assistant
- **Gemini** - Google's conversational and coding assistant
- **Claude** - Anthropic's high-reasoning assistant, excels at coding
- **Qwen** - Alibaba's multilingual model assistant for development
- **DeepSeek** - DeepSeek's code and reasoning chat assistant
- **Kimi** - Moonshot AI's long-context assistant
- **MiniMax** - MiniMax's multimodal AI assistant

### 💻 Developer Tools (3 tools)
- **VS Code Web** - Run Visual Studio Code in browser
- **Claude Code** - Claude's code mode for quick refactoring and completion
- **OpenAI Coding CLI** - Official terminal Code Agent CLI tool

### 🎮 Entertainment (1 tool)
- **JS Date WTF** - Interactive JavaScript Date pitfalls demonstration

### 📚 Other (1 tool)
- **freeCodeCamp** - Free programming courses and project practice platform

### Tool Implementation Types

**Internal Tools** (with full components):
- `chrome-icon-generator.tsx` - Complete implementation with image processing

**External Tools** (links to external sites):
- Most tools link to their official websites (ChatGPT, Gemini, VS Code, etc.)
- URL mappings stored in `toolUrlMap` in `src/constants/tools.ts`

**Dynamic Routing:**
- Tools accessible via `/tools/[id]` route
- Dynamic pages render based on tool configuration
- Supports both internal and external tool links

## Quick Reference

### Common Tasks

**Add a New Tool (External Link):**
```typescript
// 1. src/constants/tools.ts - Add to category
export const toolKeys = {
  'ai-tools': ['chatGPT', 'your-new-tool', ...]
} as const;

// 2. Add URL mapping
export const toolUrlMap = {
  'your-new-tool': 'https://example.com'
};

// 3. messages/zh.json & messages/en.json
{
  "tools": {
    "your-new-tool": {
      "name": "Tool Name",
      "desc": "Tool description"
    }
  }
}
```

**Add a New Tool (Internal Component):**
```typescript
// 1-3. Same as above, plus:

// 4. Create component
// src/components/tools/your-tool.tsx
'use client';
export function YourTool() {
  return <div>Your tool implementation</div>;
}

// 5. Add to site.ts if it needs special handling
// (Usually not needed for simple tools)
```

**Update Translations:**
- Chinese: `messages/zh.json`
- English: `messages/en.json`
- Both files must be kept in sync

**Change Colors/Theme:**
- Edit CSS variables in `src/app/globals.css`
- Light mode: `:root` section
- Dark mode: `.dark` section
- Or use OkLCH values for better colors

**Add New Category:**
1. `src/config/site.ts` - Add to `categoriesConfig`
2. `src/constants/tools.ts` - Add category ID and tools array
3. `src/constants/tools.ts` - Add icon mapping in `categoryIcons`
4. `messages/*.json` - Add category name and description
5. Update navigation if needed

### File Locations

| Purpose | File |
|---------|------|
| Tool configuration | `src/constants/tools.ts` |
| Site configuration | `src/config/site.ts` |
| Chinese translations | `messages/zh.json` |
| English translations | `messages/en.json` |
| Global styles | `src/app/globals.css` |
| Navigation | `src/components/site-nav.tsx` |
| Tool component | `src/components/tools/*.tsx` |
| Homepage | `src/app/[locale]/page.tsx` |

### Troubleshooting

**Theme not switching?**
- Check if `.dark` class exists in `globals.css`
- Verify `ThemeProvider` wraps content in layout
- Check browser console for errors

**Tool not showing?**
- Verify key exists in `toolKeys` for its category
- Check translations in both language files
- Ensure tool URL is in `toolUrlMap` (for external tools)

**Type errors?**
- Run `pnpm type-check`
- Check if `toolKeys` type matches translation keys
- Verify `CategoryId` type covers all categories

**Build fails?**
- Check `next.config.ts` for CSP issues
- Run `pnpm lint:fix` to fix formatting
- Ensure all imports use `@/*` aliases
