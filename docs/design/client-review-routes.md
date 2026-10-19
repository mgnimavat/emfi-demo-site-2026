# Current and preserved EMFI designs

The six old designs are available directly for client review. They use the same current navbar and approved simple footer as the redesigned pages. The navbar and CTA links lead to current pages; no version switcher is added to the public navigation.

| Page | Current design | Preserved design |
| --- | --- | --- |
| Home | `/` | `/home-old` |
| Services | `/services` | `/services-old` |
| Research & Execution | `/services/research-execution` | `/services/research-execution-old` |
| Why EMFI | `/why-emfi` | `/why-emfi-old` |
| About | `/about` | `/about-old` |
| Contact | `/contact` | `/contact-old` |

## Preservation baseline

- Home, Services, and Research & Execution retain the existing old-route implementations.
- Why EMFI-old preserves the former Trust page from commit `42e1d18`: “Authorised. Regulated. Auditable.” It does not use the former Why EMFI comparison page.
- About-old and Contact-old preserve the pages from `42e1d18`. About's alternating timeline and original people cards are separate legacy components; the redesigned timeline and square portrait cards remain on `/about`.
- Legacy About, Contact, Trust, and execution content have separate snapshots. References to regulated entities use the current `/why-emfi` destination. `/trust` continues to redirect to `/why-emfi`, and Trust remains absent from the navbar.
- All six old routes have `noindex, follow` metadata and are absent from the sitemap. They remain accessible without authentication for client review.

## Verification

```sh
npm run lint
npx tsc --noEmit
npm run build -- --webpack
npm run start -- --port 3130
```

With the production server running, use a second terminal:

```sh
node scripts/verify-legacy-pages.mjs http://localhost:3130
```

The smoke check verifies the six old and six current routes, representative original content, metadata, shared navigation/footer, sitemap exclusion, and the Trust redirect. Browser checks additionally cover mobile/desktop rendering, image loading, old contact/demo behavior, and the redesigned research reader and simulated execution ticket. Forms and execution previews retain their existing demonstration behavior; this change adds no delivery or trading API.

## Archive reference

`docs/reference/archive-10/` contains the clean original artifact input for `scripts/import-archive-home.mjs`; its generated snapshot is `public/archive-home/index.html`. These are historical references, separate from `/home-old` and the native React homepage. The optional importer works from committed inputs. The original supplied ZIP and extracted top-level `Archive 10/` folder are left untouched and excluded from the commit, including their Mac metadata.
