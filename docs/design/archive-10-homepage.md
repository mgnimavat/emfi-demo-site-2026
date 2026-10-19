> Superseded by the native React homepage. See `native-homepage.md`. The importer now only regenerates the preserved archive snapshot.

# Archive 10 homepage integration

Historical integration: the main homepage (`/`) previously served the complete Archive 10 document through a Next.js internal rewrite to `public/archive-home/index.html`. The browser URL remains `/`. The archive renders directly, without an iframe or a duplicate application header/footer.

The preceding homepage is preserved at `/home-old`, using the original page component and its existing content/components. Other pages retain the application shell.

## Regenerating the homepage

Run `node scripts/import-archive-home.mjs` after updating `docs/reference/archive-10/index.html`.

The importer preserves the supplied embedded assets, runtime, styles, and animations. The shared footer uses `src/content/site-footer.json` and `src/styles/site-footer.css` in both the homepage and the application shell; the importer also extracts its original logo into `public/brand/archive-footer-logo.svg`. It adapts these links in both desktop and mobile navigation:

- Services and Explore services → `/services`
- Why EMFI → `/why-emfi`
- About → `/about`
- Removes the duplicate Trust menu entry to match the current site menu.

The homepage and application shell share navigation links from `src/content/site-navigation.json` and styling from `src/styles/site-header.css`. Contact links to `/contact` throughout the navigation. The homepage retains its original mobile-menu runtime. The archive's existing preview form behavior is retained: it displays a local confirmation and does not send an enquiry to a backend. Client Login uses `https://login.emfi.uk/`.

The original files in `docs/reference/archive-10/` remain untouched. The design extraction is in `archive-10-design-system.md`.
