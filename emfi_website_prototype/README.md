# EMFI inner-page website prototype

This package contains a responsive HTML/CSS/JavaScript prototype for the six EMFI inner pages, plus a simple overview page for navigation and developer review.

## Files

- `index.html` — prototype overview and links to all six pages. It is not a replacement for the approved public homepage.
- `research-execution.html`
- `settlement-custody.html`
- `wealth-asset-management.html`
- `direct-access.html`
- `responsive-service.html`
- `dependable-operations.html`
- `styles.css` — shared visual system and responsive styles.
- `script.js` — changing-word hero animation, mobile navigation and research prototype filters.
- `build_site.py` — source generator used to produce the HTML pages.

## Visual system

Each inner page uses the agreed four-part sequence:

1. White hero with backspaced changing-word animation.
2. Dark EMFI-blue first concept section.
3. White second concept section with teal accents.
4. Light-blue factual end section with a small contextual reference link.

The prototype intentionally contains no sales CTAs. Header/footer navigation is retained, as are contextual legal/document reference links in the factual sections.

## Developer replacement items before production

1. **Research API:** the research list is a functional front-end filter prototype containing placeholder records only. Connect it to the EMFI research API and apply the existing client access and report-permission logic.
2. **Product screenshots:** the Workstation, Dashboard and Mobile panels are illustrative interface frames. Replace them with approved, current screenshots. Do not treat sample dashes or interface labels as actual live account data.
3. **Provider/regulatory logos:** provider tiles are typographic placeholders, not official logos. Replace with approved SVG/PNG assets and obtain any required brand-use approvals. Do not use FCA, DFSA or CIMA marks in a way that implies endorsement.
4. **CIMA details:** confirm the current registered fund name, status and licence/reference particulars for EMFI Fund SPC before publishing. Public materials currently appear inconsistent about the name associated with reference 1664891, so the reference number has deliberately not been hard-coded.
5. **Entity-specific roles:** confirm which legal entity performs each service, and confirm current fund-level service-provider appointments before publication. Provider appointments may differ between segregated portfolios.
6. **DMA and market infrastructure:** Legal/Compliance should approve the exact description of DMA, supported venues/instruments, client eligibility criteria, account-size/activity thresholds and the description of Euroclear, FundSettle and Allfunds arrangements.
7. **CASS / DIFC client assets:** Legal/Compliance should approve the precise scope of CASS protections and the DFSA/DIFC client asset statements, including which assets the relevant entity holds or controls.
8. **Factual end links:** replace `href="#"` in the fact sections with the final policies, disclosures, register entries or fund documents. These are deliberately non-sales reference links.
9. **Recognition and press:** only populate the FocusEconomics and media slots with verified award details, publication logos and attributed coverage.

## Run locally

Open `index.html` in a browser. No build step, package manager or external JavaScript library is required.

The prototype uses system fonts and local assets only, so it can be reviewed offline.
