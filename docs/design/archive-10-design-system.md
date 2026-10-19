# Archive 10 — EMFI design system

Extracted on 19 October 2026 from `docs/reference/archive-10/index.html` and its embedded resources. The accompanying `docs/reference/archive-10/README.md` identifies this as **EMFI Homepage v54**.

This reference describes the archive, not the current Next.js site's design tokens. Values were read from CSS and checked against browser computed styles at viewport widths **390, 768, 1024, and 1440px**, each at **1000px height**. Sizes below are CSS pixels. Fluid values depend on viewport width; `vh`/`dvh` values also depend on height.

The archive contains multiple revisions of the same CSS and hidden alternate designs. The tables prioritize the active light accountability layout and final cascade. Token names in the suggested token map are newly assigned for reuse; only `--site-container` and `--site-gutter` are original layout tokens.

## 1. Visual character

- Large, tightly tracked, extra-bold Inter headlines; lighter animated supporting phrases.
- White and cool gray page surfaces, pale blue cards, navy text and dark full-width sections.
- Generous section spacing, shared horizontal alignment, and vertically centered hero columns.
- Pill-shaped hero actions, softly rounded cards, circular icon containers, fine separators.
- Brand mark as a prominent vector element, with blue ambient gradients and restrained shadows.
- Section transitions use curved full-width edges rather than enclosing every section in a card.

## 2. Typography

### Font families and loading

Primary stack: **`Inter, Arial, sans-serif`** for body, headings, navigation, buttons, and forms. No dedicated monospace family is used in the active design.

The base style declares embedded TrueType `@font-face` entries for weights **400, 500, 600, 700, 800, and 900**, with `font-style: normal` and `font-display: swap`. A Google Fonts stylesheet also requests **300 and 800**. The manifest holds five TTF resources; declarations should not be interpreted as six independently packaged font files. In the inspection browser, weights 300–800 used by the page loaded; 900 was declared but unused/unloaded.

| Weight | Observed role |
| --- | --- |
| 300 — Light | Animated hero accent phrase |
| 400 — Regular | Default body/inherited text and alternate preview copy |
| 500 — Medium | Main card paragraphs, accountability paragraphs, service subtitle, form values |
| 600 — Semibold | Navigation, form labels, client-login label |
| 700 — Bold | Primary actions, flow labels, benefit labels, footer email links |
| 800 — Extra bold | All `h1`, `h2`, `h3`; prominent brand/display text |
| 900 — Black | Declared; also referenced by a legacy miniature team mark |

### Type styles

| Role / selector | Font size | Weight | Line height | Tracking | Color |
| --- | --- | --- | --- | --- | --- |
| Hero headline `#home h1` | `clamp(70px, 10vw, 132px)` desktop | 800 | `0.94` | `-0.045em` | `#071832` |
| Hero animated accent `.hero-accent` | `clamp(36px, 4.2vw, 58px)`; 36px below 600px | 300 | `1.25` | `-0.03em` | `#071832` |
| Hero service subtitle `.hero-service-heading` | `clamp(18px, 1.15vw, 19px)` | 500 | `1.35` | `-0.02em` | `#585C65` |
| “Expect more” `#expect h2` | `clamp(56px, 7vw, 104px)` | 800 | `0.96` | `-0.045em` | `#071932` |
| Benefit section headings: direct, responsive, accountable | `clamp(38px, 4.5vw, 60px)` | 800 | `1.1` | `-0.04em` active final style | White on navy; `#071832` on light |
| Responsive card heading `.responsive-card h3` | `clamp(22px, 2vw, 28px)` | 800 | `1.16` | `-0.03em` | `#071832` |
| Responsive card paragraph | 17px | 500 | `1.6` = 27.2px | Normal | `#24344B` |
| Accountability heading `.acc-belief-heading h3` | `clamp(22px, 2vw, 27px)`; 23px at ≤860px | 800 | `1.18` | `-0.025em` | `#071832` |
| Accountability paragraph | 17px | 500 | `1.65` = 28.05px | Normal | `#24344B` |
| Flow benefit card label `.flow-benefits p` | `clamp(18px, 1.7vw, 24px)` | 700 | `1.2` | `-0.03em` | `#071932` |
| Contact headline | `clamp(48px, 5.2vw, 72px)` | 800 | `1.04` | `-0.04em` | `#071832` |
| Header navigation | 16px | 600 | Browser `normal` | Normal | `#C9D4E5` |
| Hero primary action | 13px | 700 | Browser `normal` | `0.02em` | White |
| Form label | 15px | 600 | `1.4` = 21px | Normal | `#071832` |
| Form input/textarea | 16px | 500 | `1.4` = 22.4px | Normal | `#071832` |
| Form submit | 16px | 700 | `1` = 16px | Normal | White |
| Footer email link | 15px | 700 | Browser `normal` | Normal | `#A2C2FD` |

**Responsive heading exceptions:** Hero h1 uses `clamp(82px, 10vw, 96px)` at 600–899px and `clamp(60px, 16.5vw, 80px)` below 600px. Benefit section headings use `clamp(30px, 8.3vw, 38px)` below 600px. Contact h2 uses `clamp(42px, 8vw, 60px)` at ≤800px, then `clamp(40px, 11vw, 52px)` below 600px. Accountability h3 becomes 20px at ≤340px.

Global headings have `font-weight:800!important` and no automatic uppercase transform. Global h1/h2 apply a subtle `.006em` text stroke, but several section headings explicitly reset this to zero. Hero `.hero-layer` restores the `.006em` stroke. Body text is antialiased, with no global explicit line height; use the component values rather than assuming a universal body rhythm.

### Measured font sizes

These are resolved browser values, rounded to two decimals.

| Text style | 390px | 768px | 1024px | 1440px |
| --- | --- | --- | --- | --- |
| Hero h1 | 64.35px | 82.00px | 102.40px | 132.00px |
| Expect h2 | 56.00px | 56.00px | 71.68px | 100.80px |
| Benefit h2 | 32.37px | 38.00px | 46.08px | 60.00px |
| Responsive card h3 | 22.00px | 22.00px | 22.00px | 28.00px |
| Accountability h3 | 23.00px | 23.00px | 22.00px | 27.00px |
| Contact h2 | 42.90px | 60.00px | 53.25px | 72.00px |

## 3. Color palette

Names here describe observed usage; the archive mostly uses literal colors.

| Color | Role |
| --- | --- |
| `#071832` | Default ink, headings, contact submit background |
| `#071932` | Header, dark direct section, hero action, flow labels on light cards |
| `#001A34` | EMFI vector fill, action hover, diagram icon ink |
| `#041020` | Footer background |
| `#183252` | Contact submit hover |
| `#24344B` | Main supporting paragraphs; global link hover |
| `#585C65` | Muted hero subtitle |
| `#FFFFFF` | Page, cards, forms, circular icons, inverse text |
| `#DCE8F8` | Main pale blue section / technology card background |
| `#F4F7FB` | Expect band, people card, flow benefit cards |
| `#F7F9FC` | Hero base and direct animation surface |
| `#F6F8FB` | Start of the surrounding benefit-group gradient |
| `#A2C2FD` | Accent blue, footer links, glow and diagram accents |
| `#8098CC` | Focus outline and muted blue outline/glow |
| `#244F88` | Interactive diagram mark hover and animated token |
| `#C9D4E5` | Header navigation text |
| `#B8C5D5` | Contact input border |
| `#E4EAF2` | Diagram icon-disc border |

Additional values occur in alternate/legacy illustrations: `#0E2242`, `#0B2241`, `#F0F5FE`, `#F0F5FC`, `#314766`, `#263B59`, `#C6D8EF`, `#00C9A7`, `#08786B`. They should not all become primary palette tokens.

### Opacity and gradients

- Accountability separators: `rgba(7,24,50,.16)`, 1px.
- Diagram borders/tracks frequently use blue/white at approximately 16–35% opacity.
- Hero symbol ambient field: `rgba(162,194,253,.28)` with a radial mask; a second blue outline is blurred 7px.
- Benefit group background: `linear-gradient(180deg, #F6F8FB 0, #DCE8F8 96px, #DCE8F8 100%)`.
- Hero computed background at rest:

```css
background-color: #F7F9FC;
background-image:
  radial-gradient(70% 62% at 0% 0%,
    rgba(198,216,236,.78) 0%,
    rgba(220,232,248,.38) 42%, transparent 74%),
  radial-gradient(64% 58% at 100% 100%,
    rgba(186,208,234,.72) 0%,
    rgba(214,228,244,.32) 44%, transparent 76%);
```

## 4. Layout, alignment, and spacing

### Shared container

```css
:root {
  --site-container: 1320px;
  --site-gutter: 32px;
}
@media (max-width: 599px) {
  :root { --site-gutter: 20px; }
}
/* Shared alignment for header, hero, sections, contact, footer */
.container {
  width: calc(100% - var(--site-gutter) - var(--site-gutter));
  max-width: var(--site-container);
  margin-inline: auto;
  box-sizing: border-box;
}
```

`.container` is an illustrative alias; the source applies the rule through grouped selectors. At 1440px, the content width is **1320px**, with **60px margins**. At 1024px it is 960px / 32px margins; at 768px 704px / 32px; at 390px 350px / 20px. Some nested components add their own internal padding.

### Hero and header

- Header: navy, centered three-column grid, content minimum height 72px, vertical padding 10px, gap 24px. Measured total header height is approximately 77.36px at desktop.
- Hero: flex section with `align-items:center`; its two-column grid also uses `align-items:center`.
- Hero minimum height: `calc(100dvh - 73px)` with a `100vh` fallback. At a 1000px viewport height, the inspected page resolves to 923px after runtime adjustment.
- Desktop hero columns: `minmax(0,1fr) 400px`, gap `clamp(40px,5vw,80px)`.
- At 900–1199px, the later `emfi-hero-scale` style wins: 300px symbol column, 24px gap. At 1440px: 400px symbol, 72px gap.
- Below 900px: one column, 28px gap; symbol becomes 200px and aligns to the end.
- Hero grid vertical padding observed: 80px desktop/tablet; 64px below 761px.
- Accent phrase top margin 26px; service subtitle top margin 8px; CTA row top margin 32px, gap 12px, wraps as needed.

### Spacing vocabulary

The source has no formal spacing-token scale. These recurring values form a practical extraction:

| Value | Observed use |
| --- | --- |
| 6px | Small corner radius; navigation vertical padding |
| 8px | Label-to-field gap; button icon gap; subtitle margin |
| 10px | Header vertical padding; login icon gap |
| 12px | Action row gap; small icon-box radius |
| 14px | Input horizontal padding; primary action vertical padding |
| 16px | Accountability copy top margin; diagram/card radii |
| 18px | Responsive card title bottom margin; flow benefit grid gap |
| 20px | Mobile gutter; form row gap; main card radius |
| 24px | Main card grid gap; common layout gaps |
| 28px | Mobile card padding; hero stacked gap; primary action horizontal padding |
| 32px | Desktop gutter; CTA top margin |
| 40px | Desktop card top/side padding; section heading/content gap |
| 44px | Responsive card bottom padding; login target dimension |
| 48–56px | Common mobile section spacing and larger icon sizes |
| 64–112px | Fluid desktop section padding |

### Final section rhythm

| Section | Final spacing rule / measured behavior |
| --- | --- |
| Expect band heading wrapper | `clamp(72px,9vh,120px) 0 clamp(40px,5vh,64px)`; 90px top / 50px bottom at height 1000px; below 800px: 56px / 32px |
| Direct content | Top `clamp(64px,7vw,96px)`, bottom `clamp(56px,6vw,80px)`; desktop inner horizontal padding `clamp(20px,4vw,56px)` |
| Responsive content | `clamp(72px,8vw,104px)` top and bottom; content gap 40px |
| Responsive cards | 24px grid gap; padding `40px 40px 44px`; below 800px, 28px all sides |
| Accountability content | Top `clamp(72px,8vw,104px)`; bottom resolves to 88px desktop due to the earlier, more specific spacing rule; below 800px measured 56px top / 76px bottom |
| Accountability h2 → grid | `clamp(40px,4.5vw,60px)` bottom margin |
| Accountability grid | Three equal columns; column gap `clamp(28px,3.5vw,56px)`; stacks at ≤860px with horizontal separators |
| Contact section | `clamp(64px,6vw,96px)` vertically; below 600px: 60px top / 72px bottom |
| Contact columns | `.85fr 1.15fr`, gap `clamp(48px,6vw,96px)`; stacks at ≤800px, gap 36px, then 32px below 600px |
| Contact form | Single column; 20px row gap, 18px below 600px |

The direct/responsive/accountable transitions include **72px-high curved pseudo-elements**, with `border-radius: 0 0 50% 50% / 0 0 100% 100%`. They sit outside normal inner container spacing.

## 5. Components

### Primary hero action

- Inline flex, 8px icon gap; minimum height 48px.
- Padding 14px 28px; pill radius 999px.
- Navy `#071932`, white text, Inter 13px/700, tracking `.02em`.
- Hover: background `#001A34`, lift 3px, shadow `0 12px 24px rgba(7,25,50,.16)`, arrow moves right 3px.
- At ≤360px, a separate override uses 14px text and `0 16px` padding.

### Client login control

- 44×44px icon control, radius 8px, padding 8px, 28px icon.
- Expands to 164px on hover/focus; white background and navy text.
- Label: 14px/600, line height 1. Reserved slot is 164×44px to prevent header shift.
- Touch layout exposes the full label; reduced motion disables transitions and rotation.

### Responsive capability cards

- Two equal columns desktop, one below 800px; 24px gap.
- Technology card `#DCE8F8`; people card `#F4F7FB`.
- Radius 20px, no default shadow, content-driven height.
- Desktop padding 40px 40px 44px; mobile 28px.
- Title row vertically centered with 18px icon/text gap; 52px white circular icon container.
- Title block margin-bottom 18px; paragraph maximum width 42ch.
- Preserve actual content height: older fixed minimum heights in earlier CSS are overridden.

### Accountability principles

- Three text columns rather than three enclosed cards.
- Heading and white circular icon on the same row; desktop icon 56px with 28px SVG, mobile 52px / 26px.
- Heading/icon gap 16px desktop, 14px mobile.
- Paragraph top margin 16px, maximum width 34ch.
- Fine vertical dividers between columns; horizontal dividers when stacked.

### Flow and brand illustration

- White circular client/market icon discs: 96px desktop, 84px mobile; 1.5px `#E4EAF2` border.
- Main EMFI disc: 164px desktop / 128px mobile; mark 98px / 72px.
- Flow labels: 18px/700, tracking `-.02em`; central label 16px on mobile.
- Secondary intermediary discs: 62px desktop / 56px mobile, with 26px icons.
- Benefit cards: three columns, 18px gap, radius 16px, minimum height 148px, padding `26px 24px 24px`; white icon tile 42px with 12px radius and 24px icon.
- Benefit card hover: lift 4px; shadow `0 16px 34px rgba(2,10,24,.28)`.
- At ≤760px, the main diagram becomes vertical, with vertical connection beams.

### Contact form

- Labels: 15px/600, gap 8px above fields.
- Fields: white, 1px `#B8C5D5`, radius 6px, padding 12px 14px, minimum input height 50px.
- Textarea: minimum height 112px, vertically resizable; actual height may exceed minimum.
- Focus: navy border, ring `0 0 0 2px rgba(7,24,50,.12)` plus global focus outline.
- Submit: minimum 140×50px, radius 6px, padding 0 24px, navy/white; hover `#183252`.

## 6. Borders, radii, shadows, and focus

| Treatment | Value |
| --- | --- |
| Input / submit radius | 6px |
| Login radius | 8px |
| Small icon tile | 12px |
| Flow cards / animation panel | 16px |
| Responsive capability card | 20px |
| Pill | 999px |
| Circular icon | 50% |
| Hero logo SVG drop shadow | `drop-shadow(0 16px 18px rgba(0,26,52,.18))` |
| Direct animation surface shadow | `0 16px 36px rgba(0,26,52,.1)` |
| Diagram disc shadow | `0 8px 16px rgba(0,26,52,.08)` |
| Interactive mark hover | `0 0 0 10px rgba(162,194,253,.34), 0 16px 32px rgba(0,26,52,.16)` |
| Global keyboard focus | `3px solid #8098CC`, offset 5px |
| Route mark focus | `2px solid #A2C2FD`, offset 6px |

Global `:focus-visible` rules use `!important`, so they can override narrower component outline declarations. Standard links are navy without underline; global hover is `#24344B`, with explicit component exceptions on dark surfaces.

## 7. Motion

| Behavior | Source values |
| --- | --- |
| Shared expressive easing | `cubic-bezier(.22,1,.36,1)` |
| Section reveal | 550ms opacity/transform; rises 12px |
| Hero headline entrance | 350ms; rises 18px; layers delayed 80ms and 160ms |
| Hero CTA entrance | 350ms, delay 240ms |
| Hero accent CSS fallback | 12-second cycle; phrase offsets 0, 4, 8 seconds |
| Hero runtime typewriter (`heroTypeFrame`) | Fixed prefix; initial delay 1500ms, typing 75ms per character, hold 2400ms, deletion 45ms per character, empty pause 220ms; polling every 40ms |
| Typing caret | 1.05-second stepped blink |
| Hero ambient glow | 36-second ease-in-out drift |
| Action hover | 450ms lift/background/shadow; arrow 300ms |
| Client login expansion | 320ms width; icon 420ms; short delayed label fade |
| Flow illustration | 9-second repeated beam, label, glow, and ring sequence |
| Accountability principle reveals | 700ms; delays 0 / 170 / 340ms; rises 15px |

The archive contains older logo trace/sheen keyframes that are superseded: `.hero-symbol-base` is forced visible, and trace/highlight layers are hidden. Do not copy every declared animation as an active behavior.

`prefers-reduced-motion: reduce` disables or simplifies the principal animations, removes transform transitions, and keeps content visible. Several transitions retain meaningful final diagram rails/labels without moving glows.

## 8. Responsive rules

The archive uses component-specific breakpoints rather than a single framework breakpoint system.

| Boundary | Observed purpose |
| --- | --- |
| ≤340px | Accountability title shrinks to 20px |
| ≤360px | Hero action text/padding adjustment |
| ≤480px | Legacy/alternate accountability refinements |
| ≤599px | 20px site gutters; mobile typography and contact spacing |
| ≤760px | Main flow illustration changes to a vertical route |
| ≤799px | Responsive cards stack; final mobile section/card rhythm |
| ≤800px | Contact columns stack |
| ≤860px | Accountability principles stack; separators become horizontal |
| <900px | Hero columns stack; brand mark becomes 200px |
| 900–1199px | Hero symbol becomes 300px; 24px column gap |
| ≥1000px and viewport height ≤700px | Compact illustration/section overrides |

Some earlier media queries are superseded by later selectors with greater specificity. Preserve the **computed outcomes** in this reference when consolidating the CSS.

## 9. Suggested reusable token map

This is a normalized subset of extracted values, not a verbatim source block or a request to change the app.

```css
:root {
  --font-sans: Inter, Arial, sans-serif;
  --weight-light: 300;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --weight-heading: 800;

  --ink: #071832;
  --brand: #071932;
  --brand-deep: #001A34;
  --ink-secondary: #24344B;
  --ink-muted: #585C65;
  --surface: #FFFFFF;
  --surface-subtle: #F4F7FB;
  --surface-hero: #F7F9FC;
  --surface-blue: #DCE8F8;
  --footer-bg: #041020;
  --accent: #A2C2FD;
  --focus: #8098CC;
  --field-border: #B8C5D5;

  --site-container: 1320px;
  --site-gutter: 32px;
  --radius-field: 6px;
  --radius-control: 8px;
  --radius-icon: 12px;
  --radius-panel: 16px;
  --radius-card: 20px;
  --radius-pill: 999px;
  --ease-expressive: cubic-bezier(.22,1,.36,1);
}
```

## 10. Source and verification notes

- Source: `docs/reference/archive-10/index.html`; identity/version: `docs/reference/archive-10/README.md`.
- The HTML is a self-contained bundle: its manifest contains compressed assets, and its template contains the actual page markup, inline CSS, and runtime. Inspecting only the outer HTML would miss most design details.
- Principal evidence: base unlabelled style and named blocks `emfi-distilled`, `emfi-hero-scale`, `emfi-hero-services`, `emfi-shared-container`, `emfi-responsive-two-cards`, `accountable-variant-styles`, `emfi-accountable-separators`, `emfi-accountable-spacing`, `emfi-contact-simple`, `emfi-section-finish`, and `emfi-route`.
- Local Chromium rendered the original bundle without page JavaScript errors at all four sampled viewport widths. Measurements used reduced-motion preference to avoid transient entrance/typing states; motion details were read from source styles.
- Browser measurements distinguish visible accountability content from hidden alternate headings. Computed text size is a CSS measurement, not a font rasterization or visual accessibility audit.
- This extraction does not modify the application or migrate the archive styles into it.
