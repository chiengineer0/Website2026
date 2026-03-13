# Project Guidelines

## Architecture

- This is an Astro marketing site deployed under `/Website2026/` with React islands layered on top for interactive UI.
- Prefer Astro components, pages, and layouts for content composition, routing, and SEO. Use React only when a feature needs client-side state, browser APIs, or complex interactivity.
- Keep component boundaries consistent:
  - `src/components/layout/` for site chrome
  - `src/components/sections/` for page-level Astro sections
  - `src/components/islands/` for hydrated React components
  - `src/components/ui/` for reusable React UI primitives
- Content belongs in `src/content/`, and schema changes must be reflected in `src/content/config.ts`.

## Code Style

- Follow Biome formatting: spaces for indentation and single quotes in JavaScript and TypeScript.
- Use the `@/` import alias for modules under `src`.
- Reuse existing helpers such as `cn()` from `src/lib/utils.ts` rather than creating duplicate class-merging utilities.
- Keep shared design tokens and reusable presentation patterns in `src/styles/global.css`; prefer existing classes such as `container-shell`, `section-title`, and `surface-card` before inventing new ones.

## Routing and URLs

- `astro.config.mjs` sets `site: 'https://chiengineer0.github.io'`, `base: '/Website2026'`, and `trailingSlash: 'always'`.
- Preserve the base path when editing links, canonical URLs, PWA assets, search paths, or tests.
- When loading client-generated assets or scripts, prefer `import.meta.env.BASE_URL` over assuming the site is hosted at `/`.
- Be careful when changing navigation: `src/components/layout/Header.astro` and Playwright tests currently account for the `/Website2026` base explicitly.

## Client Behavior and Data

- Use hydration sparingly: `client:load` only for critical UI, and prefer `client:idle` or `client:visible` for lower-priority interactivity.
- There is no backend persistence layer in this project. Quote drafts use Dexie in `src/lib/db.ts`, and theme or analytics state is stored in the browser.
- Keep analytics changes compatible with the local `window.dataLayer` pattern in `src/lib/analytics.ts`.

## Build and Test

- `npm run lint` runs Biome checks.
- `npm run test` runs Vitest unit tests in `jsdom`.
- `npm run test:e2e` runs Playwright end-to-end tests.
- `npm run build` runs `astro check && astro build && npm run pagefind`; do not reorder the Pagefind step.

## Project-Specific Pitfalls

- Placeholder branding and contact details still exist in the PWA manifest, structured data, and parts of the UI. If branding changes, update them together.
- Search depends on generated Pagefind assets and currently resolves them from `import.meta.env.BASE_URL`.
- If you add or rename content frontmatter fields, update the corresponding Zod schema and any templates that consume those fields.
- Several routes and assets still use explicit `/Website2026/...` strings. Watch for regressions if you refactor URL handling.
