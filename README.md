# Website2026

`Website2026` is a polished Astro marketing site for an electrical contractor brand. It combines content-driven pages, selective React islands for rich interactivity, PWA support, local draft persistence for quote flows, and searchable static output.

## Stack

- Astro 5 with MDX content collections
- React 19 islands for interactive widgets
- Tailwind CSS 4 for styling
- Biome for formatting and linting
- Vitest for unit tests
- Playwright for end-to-end checks
- Pagefind for on-site search indexing
- Dexie for client-side quote draft persistence

## Getting started

1. Install dependencies with `npm install`.
2. Start the dev server with `npm run dev`.
3. Open `http://localhost:4321/Website2026/`.

## Available scripts

| Command | Purpose |
| :-- | :-- |
| `npm run dev` | Start the Astro development server. |
| `npm run build` | Run `astro check`, build the site, then generate Pagefind search assets. |
| `npm run preview` | Preview the built site locally. |
| `npm run lint` | Run Biome checks across the repository. |
| `npm run format` | Format the codebase with Biome. |
| `npm run test` | Run Vitest unit tests in `jsdom`. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run test:e2e` | Run Playwright browser tests. |

## Project structure

```text
.
├── public/                  # Static assets, offline page, icons, images, videos
├── src/
│   ├── assets/              # Source-managed images and other assets
│   ├── components/
│   │   ├── islands/         # Hydrated React components
│   │   ├── layout/          # Header, footer, mobile nav
│   │   ├── sections/        # Astro page sections
│   │   └── ui/              # Shared React UI primitives
│   ├── content/             # MDX and JSON content collections
│   ├── layouts/             # Top-level Astro layouts
│   ├── lib/                 # Shared utilities, analytics, client DB, schemas, types
│   ├── pages/               # Route definitions and dynamic content routes
│   └── styles/              # Global Tailwind and theme styles
├── tests/
│   ├── e2e/                 # Playwright tests
│   └── unit/                # Vitest tests
├── astro.config.mjs         # Astro, Vite, PWA, sitemap, and build configuration
├── biome.json               # Formatting and lint rules
├── playwright.config.ts     # E2E test configuration
└── vitest.config.ts         # Unit test configuration
```

## Content model

The site is driven by Astro content collections defined in `src/content/config.ts`.

- `blog`: MDX posts
- `services`: MDX service pages
- `projects`: MDX project case studies
- `faq`: JSON FAQ entries
- `testimonials`: JSON testimonial entries

If you add or change frontmatter fields, update the matching Zod schema in `src/content/config.ts` at the same time.

## Architecture notes

- **Astro first, React where needed**: Layouts, pages, and most sections are Astro components. React islands are used for client-side interactivity such as forms, lightboxes, maps, and toggles.
- **Base-path aware deployment**: The site is configured for GitHub Pages-style hosting with `base: '/Website2026'` and `trailingSlash: 'always'`. Route changes should preserve that behavior.
- **Search build order matters**: Pagefind runs after the Astro build. Keep the existing `npm run build` sequence intact.
- **Client-only persistence**: Quote drafts are stored in IndexedDB via Dexie, while theme and local analytics history live in `localStorage`.
- **PWA enabled**: The site includes an offline page, manifest configuration, and runtime caching via the PWA integration.

## Important implementation caveats

- Branding placeholders still exist in the manifest, structured data, and some content strings; update those consistently before production use.
- Navigation and some tests currently account for the `/Website2026` base path explicitly.
- Contact submission currently relies on an external Formspree endpoint.
- Search assets are loaded relative to `import.meta.env.BASE_URL`, so changes to deployment paths should be tested carefully.

## Quality checks

Before shipping meaningful changes, run:

- `npm run lint`
- `npm run test`
- `npm run build`

Add `npm run test:e2e` when you change routing, navigation, or interactive flows.
