# Services — reference content

Source: <https://emfi-web-vision.replit.app/services>

Captured: 2026-10-16

Extraction: Page copy, link destinations and image metadata extracted from the deployed site's JavaScript bundle (`/assets/index-BQyaQpCj.js`). The HTML response is a JavaScript application shell. This capture does not transcribe text embedded inside screenshot images or include the contents of linked pages.

Purpose: Content reference for later implementation. Section order and original wording are preserved below. Shared header and footer content are included separately. Reference navigation is historical source content; the menu changes already requested for our app still apply.

## Page metadata

- Title: Services | EMFI
- Description: Research, execution, settlement, custody and asset management for professional clients.

## Hero

Breadcrumb: [Home](https://emfi-web-vision.replit.app/) › Services

Eyebrow: Services

### EMFI. SWITCHED ON.

Research, execution, settlement, custody and asset management for professional clients.

On-page navigation (accessible label: Services on this page):

| Number | Label | Target |
| --- | --- | --- |
| 6.1 | Research & Execution | `#svc-6.1` |
| 6.2 | Settlement & Custody | `#svc-6.2` |
| 6.3 | Wealth & Asset Management | `#svc-6.3` |

## 6.1 — Research & Execution

Section ID: `svc-6.1`

### KNOW THE MARKET. MAKE THE TRADE.

Research that supports the investment decision. Execution that reaches the relevant markets and securities.

1. Specialist research and market insight where relevant.
2. Execution across relevant international markets and securities.
3. Professional-client coverage and dealing support.
4. A direct line between investment requirement and execution.

CTA: [Explore Research & Execution](https://emfi-web-vision.replit.app/services/execution)

## 6.2 — Settlement & Custody

Section ID: `svc-6.2`

### THE TRADE IS ONLY THE BEGINNING.

Settlement, custody, asset servicing and operational visibility behind the transaction.

1. Settlement and post-trade processing.
2. Custody and safekeeping through relevant infrastructure and providers.
3. Asset servicing and corporate actions where applicable.
4. Operational visibility and coordination across the post-trade lifecycle.

CTA: [Explore Settlement & Custody](https://emfi-web-vision.replit.app/services/settlement-custody)

## 6.3 — Wealth & Asset Management

Section ID: `svc-6.3`

### FROM STRATEGY TO PORTFOLIO.

Investment management services delivered through EMFI’s regulated entities, with applicable MiFID and AIFMD permissions and professional-client requirements.

1. Wealth management for eligible professional clients.
2. Asset management through applicable regulated structures.
3. Portfolio construction, oversight and reporting as applicable.
4. Access to EMFI’s broader execution, settlement and custody capabilities where relevant.

CTA: [Explore Wealth & Asset Management](https://emfi-web-vision.replit.app/services/wealth-managers)

## 6.4 · Product evidence

Section ID: `product-evidence`

### EMFI in practice.

Three surfaces, three jobs. Research supports the view. The execution workstation handles the order. The dashboard shows the supplied operational view. Each image is labelled with its source and limitations; additional backoffice workflow evidence is pending.

### 01 · RESEARCH

#### Research explorer

Choose and read EMFI research by country, report type, topic and publication date. The research view behind the decision.

Source label: Screenshot-sourced

Captured from the current research interface. Not a connected live feed.

- Image: [Research report screenshot](https://emfi-web-vision.replit.app/assets/1_Screenshot_2026-10-15_173214_1792065775754-BfEvFYzh.png)
- Alt text: EMFI research report view showing a Venezuela fixed income country report
- Image fit: contain
- Figure identifier: `research`

### 02 · BACKOFFICE SYSTEM

#### Client dashboard

A supplied dashboard capture showing balances, transactions, exposure, positions, charges and performance. The six chart-card totals are blurred.

Source label: Totals blurred

Chart-card totals are obscured. This capture does not demonstrate settlement status or reconciliation.

- Image: [Client dashboard screenshot](https://emfi-web-vision.replit.app/assets/emfi-client-dashboard-redacted-D5mFkH0T.png)
- Alt text: EMFI dashboard showing six chart panels with top-right totals blurred
- Image fit: contain
- Figure identifier: `backoffice`

### 03 · WORKSTATION · EXECUTION

#### Order ticket

The execution flow: security selection, bid / ask view, order type, time in force, side and order value before submission.

Source label: Illustrative local simulation

Not live-trading proof. As the screen states: no account needed, no real trade made.

- Image: [Execution order ticket screenshot](https://emfi-web-vision.replit.app/assets/0_execution_1792065875177-DCi85LZC.png)
- Alt text: Illustrative EMFI execution order ticket simulation
- Image fit: contain
- Figure identifier: `execution`

### MOBILE APP · CLIENT ACCESS

The client-access layer: how clients reach EMFI on mobile. Approved app screens, store listings and the download QR are pending and will be added once supplied.

Status label: Content pending

## Shared header — source site

Logo: EMFI, linking to `/`.

| Menu label | Source path |
| --- | --- |
| Home | `/` |
| Services | `/services` |
| Why EMFI | `/why-emfi` |
| Capabilities | `/capabilities` |
| Intelligence | `/intelligence` |
| About | `/about` |
| Trust | `/trust` |
| Contact | `/contact` |
| CLIENT LOGIN (desktop) / Client Login (mobile) | `/login` |

Services submenu heading: DIRECT ROUTES

Services submenu prompt: Choose a service

| Number | Label | Description | Source path |
| --- | --- | --- | --- |
| 01 | Research & Execution | From investment insight to trade | `/services/execution` |
| 02 | Settlement & Custody | Direct post-trade route | `/services/settlement-custody` |
| 03 | Wealth Managers & DFMs | Institutional infrastructure | `/services/wealth-managers` |

Mobile menu button accessible label: Open navigation

## Shared footer — source site

Logo alt text: EMFI

Institutional infrastructure without the institutional layers.

EMFI Securities Ltd · EMFI Capital (DIFC) Limited

### SERVICES

- [Research & Execution](https://emfi-web-vision.replit.app/services/execution)
- [Settlement & Custody](https://emfi-web-vision.replit.app/services/settlement-custody)
- [Wealth Managers](https://emfi-web-vision.replit.app/services/wealth-managers)

### COMPANY

- [About EMFI](https://emfi-web-vision.replit.app/about)
- [Intelligence](https://emfi-web-vision.replit.app/intelligence)
- [Trust centre](https://emfi-web-vision.replit.app/trust)

### CONTACT

- [London · UK](https://emfi-web-vision.replit.app/contact)
- [Dubai · DIFC](https://emfi-web-vision.replit.app/contact)
- [hello@emfi.com](mailto:hello@emfi.com)

### Footer notice

For Professional Clients and Eligible Counterparties only. This communication is not directed at Retail Clients. © EMFI 2026. All rights reserved.

## Implementation reference — route mapping

These are mapping notes for our app, rather than source page copy. Source links above retain their original destinations.

| Source path | Existing app path |
| --- | --- |
| `/services` | `/services` |
| `/services/execution` | `/services/research-execution` |
| `/services/settlement-custody` | `/services/settlement-custody` |
| `/services/wealth-managers` | `/services/wealth-asset-management` |

The source page ends after the product evidence and mobile app panel, followed by the shared footer. There is no additional standalone closing CTA in this page component.
