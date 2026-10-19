# Fonts and Vercel builds

The reported Vercel failure came from generated `next/font/google` CSS referencing `@vercel/turbopack-next/internal/font/google/font`. All application Google font loaders have been replaced with `next/font/local` and committed WOFF2 assets, following the [Next.js local font API](https://nextjs.org/docs/app/api-reference/components/font#local-fonts).

- The root layout loads Inter variable weights 100–900 and IBM Plex Mono weights 400/500/600/700.
- The `/home-2`, `/home-3`, and `/home-4` layouts load Oswald variable weights 200–700.
- Existing CSS variable names and `font-display: swap` are preserved. Shared sans-serif and heading tokens explicitly use `--font-inter` so the local font family applies to both redesigned and old pages.
- Files, sources, and SIL Open Font Licenses are in `src/assets/fonts/`. These normal-style Latin subsets support the site's existing English content.
- Fonts no longer require Google downloads during the build or browser font loading. There is no new package dependency and no change to the default Turbopack build command.

Verification uses `npm run lint`, the default `npm run build`, `npx tsc --noEmit` after the build, and browser checks of the root, Why EMFI, old About, Research & Execution, and the three Oswald variants. Vercel must deploy the commit containing both the loader changes and the bundled font files. If a redeployment still reports the old Google loader path, redeploy that commit without reusing the previous build cache.
