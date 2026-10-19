# Native EMFI homepage

The `/` route is now a native Next.js React page. It follows the user-supplied EMFI design extraction (19 October 2026), rather than running the bundled Archive 10 runtime. The original artifact remains available in `docs/reference/archive-10/` and its previously generated static snapshot in `public/archive-home/`. The earlier application homepage remains at `/home-old`.

## Implementation

- `src/app/page.tsx`: semantic page sections and exact visible copy.
- `src/components/sections/landing/`: scoped layout, original vector geometry, typewriter, visibility/reveal lifecycle, animated routing diagram and local contact form.
- `src/components/layout/header.tsx` and `src/styles/site-header.css`: shared sticky navy navigation. Four links: Services, Why EMFI, About and Contact. The user’s menu instruction takes precedence over the five-link reference specification. Why EMFI contains the former Trust page; `/trust` redirects to `/why-emfi`. Client Login uses the explicitly supplied `https://login.emfi.uk/` destination.
- `src/components/layout/footer.tsx`, `src/content/site-footer.json`, `src/styles/site-footer.css`: the approved simple footer from the user’s screenshot: 160px wordmark, London/Dubai/Cayman columns, Park Towers Dubai address and one legal line. It replaces the dense footer from the earlier extraction.

The exact 145-unit EMFI glyph is recovered from the archive and stored in `site-navigation.json`; the wordmark is `public/brand/archive-footer-logo.svg`. Endpoint icons are also recovered originals. No approximate power icon is used.

## Deliberate responsive choices

Desktop follows the supplied geometry. The header switches at 1000px so all navigation links, the full logo and reserved login slot fit. The accountability grid retains the specified zero horizontal padding on desktop; it gains 20px mobile gutters when stacked. Mobile typography and subtitle wrapping are verified against the available width rather than assuming the desktop snapshot fits small screens.

Animation observes intersection and document visibility, and cleans up observers/listeners/timers. Reduced motion shows static completed glyph/routes and fully visible content. Text is server-rendered and remains available without animation. Typewriter accessible text is stable and separate from the changing visual text.

The homepage contact form uses native browser validation and an accessible local confirmation. It makes no network request and explicitly states that no message was sent to EMFI.

The routing comparison shares an 8-second cycle. The direct Client → EMFI → Depository beams complete at 2 seconds; the upper intermediary route completes at 5.2 seconds. Desktop and mobile use the same timing, including the EMFI highlight at the first arrival.

The homepage and every application route use the same `Footer` through the root `SiteShell`; both legacy navigation exports and the footer renderer read `site-footer.json`. The approved footer has no company/service navigation or tagline. Its measured screenshot background is `#0C1725`.
