# EMFI website v4: review and handoff

Open `index.html`. Static HTML/CSS/JS, no build step needed. `_source/build.py` regenerates all pages (`python3 _source/build.py <out_dir>`).
Yellow tags in the pages are review flags; the button bottom-right hides them (or add `?clean`).

## What changed from v3 (a full redesign, not a reskin)
- **Home**: navy hero kept, with a stroke-drawn "e" mark that draws itself and follows the cursor; marquee of credentials; giant Direct / Responsive / Dependable rows; a scroll-pinned route that collapses 4 hops to 2; product showcase (Dashboard / Workstation / Mobile); Say Less quiz; research teaser; story teaser.
- **Product screens**: rebuilt from your screenshots in HTML/SVG, headers and tabs removed, all data synthetic (counterparties, instruments, references, portfolios, amounts). Not copies of real screens. Mobile positions treemap is generated live.
- **Intelligence & Execution**: research sign-up CTA with professional-client confirmation and consent; searchable archive (22 titles); research team from your image (names and titles only).
- **Wealth & Asset Management**: EMFI Opportunities Fund trend chart (placeholder shape based on your image; no values; gated by a professional-investor confirmation; past-performance warning).
- **About**: new origin story as a scroll-driven timeline (2016 to 2026); team with portraits.
- Vertical "WHY" dropped. Footer keeps the three taglines and credentials verbatim.

## Updated after your replies
- Research team: Cesar Petit excluded, Elena Sanchez added ("Quantitative Analyst (Intern)"). Salary data never used.
- Fund renamed **EMFI Opportunities Fund** everywhere. Share class still to add.
- Origin story: no founders or founding moment, as asked.
- Alan Tooker and Damian Juric: their bios are A.R.C. Directors Ltd profiles, so they are shown as **fund directors (EMFI Fund SPC)** on the Wealth page with portraits and short bios (contact details removed) and in the About grid. Confirm the directorship wording and whether to say "independent".
- Added Usman Sheikh, Peter Timson, Hitesh Bilochi, Asmita Sojitra and Albani Granado (Senior Quantitative Analyst, from the research list). LinkedIn only showed other employers for Peter (ComplyCraft), Hitesh (Ocorian) and Asmita (Tuvoc), so **their EMFI titles are blank and flagged**. No portraits for them or Usman/Albani yet (initials show). Bhavin removed.
- Logos: MarketAxess, Trumid and Allfunds are hotlinked from the vendors' sites (shown as black silhouettes; text fallback if blocked). **Not captured**: Tradeweb, Borse Berlin, FundSettle/Euroclear, EMTA, CISI and the provider logos (Apex, Baker Tilly, Walkers, Dechert, BDO, NatWest, Santander, Northern Trust); the tool I use blocks encoded extraction of inline SVGs. They stay as flagged slots/text. Download the official files and drop them in, and host all logos locally for production.

## Latest changes
- Fund directors are **Usman Sheikh, Alan Tooker, Damian Juric**; Jose removed from the Wealth page (he stays on About).
- About grid is in the exact order supplied. Roles: Usman Founder; Peter Compliance, UK; Hitesh Compliance, DIFC; Asmita Business Analyst; Albani Senior Quantitative Analyst (his title from the research list).
- Francesco Odone is on the grid with no title yet. His CV and passport were NOT used: personal data, and no photo from an ID document.

## Still needed from you
1. EMFI title for Francesco Odone.
2. Approved portraits (not ID scans) for Usman, Peter, Hitesh, Francesco, Asmita, Albani, and a short bio for Usman.
3. Fund share class.


## Restructure (v4b): ChatGPT section order restored
- Heroes only on Home and Settlement & Custody. Other pages use a plain title band; Contact has none (form, then London / Dubai / Cayman maps); Wealth leads with the gated fund chart.
- Header: logo | three services | About, Contact, EN/ES, Login. Footer: e mark | Direct | Responsive | Dependable (with logos) | Legal, Follow, Get the app.
- "Research" renamed "Intelligence" everywhere; archive and sign-up on white. Intelligence team uses About-style placeholder cards.
- Settlement: old sections 04 (dashboard) and 05 (custody) dropped to match the original order.
- Directors' bios (A.R.C. Directors profiles) are not on the page; add as expandable detail if wanted.
- Logos are hotlinked from the logo library URLs (_source/logo_library.html); EMTA and CISI stay as text chips.
- Placeholders: social links, app store links, language switcher, Francesco Odone's title, missing portraits.


## v5 changelog (this build; previous delivery was v4)
- Section backgrounds alternate white / navy / light blue on every page; every section is at least one screen tall.
- About: animated "e" hero; all eleven years 2016-2026 in the sticky timeline (2021 and 2023 have no public source: flagged); group structure drawn as an org chart; Cayman. London. Dubai. order everywhere.
- Contact: ChatGPT copy restored, form first, three maps (Cayman, London, Dubai).
- Language selector: EN / ES / AR (visual only; no translations or RTL layout yet).
- Footer legal text condensed; company numbers and entity details live on Dependable > Clear entities.
- Sources for milestones: Companies House (incorporation 26 Oct 2016), FCA Register extract (Capital authorised 1 Feb 2019; AIFM 29 Oct 2019), supplied register (SNB Securities name, May 2018 incorporations, DFSA 30 Jul 2025, EMTA Q4 2025).


## v6 changelog
- All page copy restored to the original prototype wording (Home, Settlement, Intelligence, Wealth, Direct, Responsive, Dependable, Legal, About, Contact). Design, animations and section order unchanged from v5.
- Removed claims that were not in the original copy: fee tiers, hop/firm counters, Citi, "Boring by design"-style lines, DMA step cards.
- Cayman registered office corrected to the original: Suite #7, Grand Pavilion Commercial Centre, 802 West Bay Road, KY1-1103.
- Kept by request: Intelligence sign-up CTA, intelligence team (11 people with public job titles), About timeline 2016-2026, org chart, EN/ES/AR, condensed footer legal text.
- Dubai address keeps the more specific "P7A-10, Tower A" detail on About and Contact: confirm; original said "Park Towers, DIFC".


## v7 changelog (design pass; copy and compliance are proposals only)
- Full recommendations are in the review document "EMFI Website v7: Design, Copy and Compliance Review" (Claude Docs artifact).
- Brand navy corrected to #001A34. Teal-green gradient and hot-pink accent retired; gradient limited to the e mark, the route line and the route progress bar. Accent #2A5CA8 (on dark #8DB4F0). Semantic Positive #1B7A50 / Alert #C53030 reserved for product and form states.
- One button system (12px radius, primary / secondary / text link), one focus ring, motion cut back (see document for the table).
- Two builds: review (yellow flags) in this folder, and production/ (flags and flags button stripped from the HTML). Rebuild with: python3 _source/build.py <out>  or  EMFI_PROD=1 python3 _source/build.py <out>
- production/ is a technical proof, not publishable until the open items in the document are closed.


## v8 changelog (facts supplied by the client; no copy or compliance proposals applied)
- Dubai address: Damac Park Towers, DIFC (suite detail dropped). EMFI Group address: 25-26 Dering Street (confirm it is the registered office).
- Roles: Robert Hagon and Mark Cleary = Distribution, UK. Jose Bermudez and Francesco Odone = Distribution, DIFC.
- EMFI Fund SPC: the three-portfolio graphic is removed; the page no longer implies how many portfolios exist (the single current portfolio is not to be disclosed publicly).
- Intelligence sign-up: "New Intelligence most weekdays".
- EMFI blue confirmed as the logo navy #001A34.


## v9 changelog (copy + compliance proposals applied; controls applied)
Copy: Home sub-line; plain-verb Direct paragraph; plain ledger; quiz retitled, result links to Contact; Settlement tagline "Less Financing. Less Re-keying. Less Cross-Client Exposure."; Settlement paragraphs shortened; "Less Cost" -> "Less Duplication"; Intelligence sub-line; Wealth step two; About connected story; new title tags/descriptions. Title Case headlines kept (open decision).
Compliance: rebuilt fund gate (status, country, risk acknowledgement, "I am not" button, US blocked); marketing-communication notice and performance-basis line; "Provided by" lines; per-publication line in the archive; privacy notice and accessibility statement (draft for counsel); FCA register links by FRN; third-party-logo line in footer.
Controls: quiz check marks; EN/ES/AR buttons (ES/AR disabled pending translation); year cross-fade; fund redraw 1.4s; tabs code deleted. Fixes found in review: quiz body stayed visible on the result screen; hidden route counters were showing; quiz fine print contrast; mock-up "Portfolio 001/002" renamed "Account".
Build modes: review (flags visible) vs production (EMFI_PROD=1). Production omits unverified names/badges, placeholder press section, fee PDF link and the synthetic fund chart. Launch blockers: counsel on the fund chart (FSMA s238); Euroclear/CISI/EMTA wording and permissions; provider appointments; form backend; Terms/complaints/client-asset/execution/publication documents; Contact response time; portraits; ES/AR translations; noindex and staging host in robots.txt/sitemap.


## v10 changelog
- Palette: teal returns (gradient #3f9fc9 to #4fc3b0 on the "e", route line, progress bars, pillar words; flat #4fc3b0 on dark, #0f7a7c on light). Footer now the same navy as every dark section, set off by a teal hairline. Light tint changed from blue to a neutral teal-grey (#e9f1f1). Quiz section moved to white with a navy card. No page ends on a navy section above the navy footer.
- Copy: removed the emerging-markets lines (Home sub-line, Intelligence lead, titles and descriptions, Wealth step two); EM is now mentioned only in About history. Home sections lead with Direct. / Responsive. / Dependable. About hero is "Ten years. One connected chain." Contact has a real headline, contact details and the form on a tinted card. Intelligence page stripped to title, filters and list.
- Fix: three-column cards ("Less Overlap / Complexity / Exposure") ran off the right edge; columns are now equal.
- PDFs: fee schedule and corporate presentation recoloured to the brand navy (#001A34) with teal rules and badges (v2 files). Original generator source is not available, so this is a post-process; the deck text itself is unchanged and still has EM-first wording.

## v11 changelog
- Teal pulled back to accents: headline pillar words and light-section gradient text are now solid ink/white; buttons on navy are white (teal on hover); nav/language states, footer hairline and quiz card borders neutral; tinted backgrounds more neutral. Teal remains in the "e", gradient words on dark, kickers, progress bars and route lines.
- Review-build fee schedule download now points to the v4 fee schedule PDF.
