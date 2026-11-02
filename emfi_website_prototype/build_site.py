from pathlib import Path

ROOT = Path('/mnt/data/emfi_website_prototype')

NAV_PAGES = [
    ('Research & Execution', 'research-execution.html'),
    ('Settlement & Custody', 'settlement-custody.html'),
    ('Wealth & Asset Management', 'wealth-asset-management.html'),
    ('Direct Access', 'direct-access.html'),
    ('Responsive Service', 'responsive-service.html'),
    ('Dependable Operations', 'dependable-operations.html'),
]


def brand(dark=False):
    return '''<a class="brand" href="index.html" aria-label="EMFI inner-page prototype overview">
      <span class="brand-mark" aria-hidden="true"></span><span><span class="brand-word">EMFI</span><span class="brand-sub">INSTITUTIONAL INFRASTRUCTURE</span></span>
    </a>'''


def nav_html(active=''):
    service_links = ''.join(f'<a href="{href}" {"aria-current=\"page\"" if active == href else ""}>{name}</a>' for name, href in NAV_PAGES[:3])
    why_links = ''.join(f'<a href="{href}" {"aria-current=\"page\"" if active == href else ""}>{name}</a>' for name, href in NAV_PAGES[3:])
    return f'''<header class="site-header"><div class="container header-inner">
      {brand()}
      <button class="mobile-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
      <nav class="nav" aria-label="Main navigation">
        <div class="nav-group"><a href="index.html#services">Services</a><div class="nav-menu">{service_links}</div></div>
        <div class="nav-group"><a href="index.html#why-emfi">Why EMFI</a><div class="nav-menu">{why_links}</div></div>
      </nav>
    </div></header>'''


def footer_html():
    service_links = ''.join(f'<a href="{href}">{name}</a>' for name, href in NAV_PAGES[:3])
    why_links = ''.join(f'<a href="{href}">{name}</a>' for name, href in NAV_PAGES[3:])
    return f'''<footer class="site-footer"><div class="container">
      <div class="footer-top">
        <div class="footer-brand">{brand()}<p class="footer-note">Institutional capabilities, delivered without unnecessary institutional complexity.</p></div>
        <div><div class="footer-col-title">Services</div><div class="footer-links">{service_links}</div></div>
        <div><div class="footer-col-title">Why EMFI</div><div class="footer-links">{why_links}</div></div>
      </div>
      <div class="footer-bottom"><span>© EMFI Group Limited</span><span>Information on this prototype is subject to final legal, regulatory and brand approval.</span></div>
    </div></footer>'''


def hero(title, phrase, words, desc, idx, group):
    return f'''<section class="page-hero"><div class="container hero-inner">
      <div><div class="kicker">{group} &nbsp; / &nbsp; {idx:02d}</div>
        <h1 class="hero-title">{phrase}<span class="rotating-word" data-rotate-words="{words}">{words.split('|')[0]}</span></h1>
        <p class="hero-copy">{desc}</p>
      </div><div class="hero-index"><strong>{idx:02d} / 06</strong>EMFI CAPABILITIES</div>
    </div></section>'''


def section_dark(kicker, title, body, visual, extra_class=''):
    return f'''<section class="section section-dark {extra_class}"><div class="container section-grid">
      <div><div class="section-kicker">{kicker}</div><h2>{title}</h2>{body}</div>
      <div class="section-visual">{visual}</div>
    </div></section>'''


def section_light(kicker, title, body, visual, extra_class=''):
    return f'''<section class="section section-light {extra_class}"><div class="container section-grid">
      <div><div class="section-kicker">{kicker}</div><h2>{title}</h2>{body}</div>
      <div class="section-visual">{visual}</div>
    </div></section>'''


def facts(title, content, link_text, link_href='#'):
    link = f'<a class="fact-link" href="{link_href}">{link_text}</a>' if link_text else ''
    return f'''<section class="fact-section"><div class="container fact-inner"><div class="fact-title">{title}</div><div class="fact-copy">{content}{link}</div></div></section>'''


def page_html(title, active, hero_html, section1, section2, fact_html, page_no):
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{title} | EMFI institutional infrastructure">
  <title>{title} | EMFI</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  {nav_html(active)}
  <main>
    {hero_html}
    {section1}
    {section2}
    {fact_html}
  </main>
  {footer_html()}
  <script src="script.js"></script>
</body></html>'''


def workstation_mockup():
    return '''<div class="device-wrap">
      <div class="screen-label">Workstation / interface placeholder</div>
      <div class="app-screen workstation">
        <div class="app-topbar"><span class="app-brand">EMFI / WORKSTATION</span><span class="app-user">MARKETS &nbsp; ORDERS &nbsp; PORTFOLIO</span></div>
        <div class="app-body">
          <div class="app-eyebrow">Execution environment · illustrative layout</div>
          <div class="app-heading">Market overview</div>
          <div class="app-stats">
            <div class="app-stat"><span>MARKET WATCH</span><strong>—</strong></div>
            <div class="app-stat"><span>OPEN ORDERS</span><strong>—</strong></div>
            <div class="app-stat"><span>RECENT TRADES</span><strong>—</strong></div>
          </div>
          <div class="app-table"><div class="app-table-head"><span>Instrument</span><span>Bid</span><span>Ask</span><span>Status</span></div>
            <div class="app-table-row"><span>Instrument / 01</span><span>—</span><span>—</span><span>Preview</span></div>
            <div class="app-table-row"><span>Instrument / 02</span><span>—</span><span>—</span><span>Preview</span></div>
            <div class="app-table-row"><span>Instrument / 03</span><span>—</span><span>—</span><span>Preview</span></div>
          </div>
        </div>
        <div class="app-placeholder-note">DESIGN PLACEHOLDER · REPLACE WITH APPROVED WORKSTATION SCREENSHOT</div>
      </div>
    </div>'''


def dashboard_mockup():
    return '''<div class="device-wrap">
      <div class="screen-label">Dashboard / interface placeholder</div>
      <div class="app-screen">
        <div class="app-topbar"><span class="app-brand">EMFI / CLIENT DASHBOARD</span><span class="app-user">OVERVIEW　 ACCOUNTS　 REPORTS</span></div>
        <div class="app-body">
          <div class="app-eyebrow">Account overview · illustrative layout</div><div class="app-heading">Portfolio summary</div>
          <div class="app-stats">
            <div class="app-stat"><span>CASH BALANCE</span><strong>—</strong></div>
            <div class="app-stat"><span>PORTFOLIO VALUE</span><strong>—</strong></div>
            <div class="app-stat"><span>OPEN TRADES</span><strong>—</strong></div>
          </div>
          <div class="app-table"><div class="app-table-head"><span>Position</span><span>Currency</span><span>Quantity</span><span>Status</span></div>
            <div class="app-table-row"><span>Security / 01</span><span>USD</span><span>—</span><span>Settled</span></div>
            <div class="app-table-row"><span>Security / 02</span><span>EUR</span><span>—</span><span>Pending</span></div>
            <div class="app-table-row"><span>Security / 03</span><span>GBP</span><span>—</span><span>Settled</span></div>
          </div>
        </div>
        <div class="app-placeholder-note">DESIGN PLACEHOLDER · REPLACE WITH APPROVED DASHBOARD SCREENSHOT</div>
      </div>
    </div>'''


def mobile_mockup():
    return '''<div><div class="screen-label">Mobile / interface placeholder</div><div class="mobile-frame"><div class="mobile-screen">
      <div class="mobile-notch"></div><div class="mobile-header">EMFI</div>
      <div class="mobile-account"><small>ACCOUNT OVERVIEW</small><strong>—</strong><small>Portfolio value</small></div>
      <div class="mobile-list"><div class="mobile-row"><span>Cash balances</span><b>›</b></div><div class="mobile-row"><span>Positions</span><b>›</b></div><div class="mobile-row"><span>Outstanding trades</span><b>›</b></div><div class="mobile-row"><span>Activity</span><b>›</b></div></div>
    </div></div><div class="tech-caption">DESIGN PLACEHOLDER · Replace with approved mobile screenshots.</div></div>'''


def research_widget():
    return '''<div class="research-panel">
      <div class="panel-head"><div class="panel-brand">EMFI RESEARCH</div><span class="sample-label">API INTEGRATION PREVIEW</span></div>
      <div class="research-controls">
        <input type="search" placeholder="Search research, countries and keywords" aria-label="Search research" data-research-search>
        <select aria-label="Filter by country" data-research-country><option value="all">All countries</option><option value="argentina">Argentina</option><option value="egypt">Egypt</option><option value="venezuela">Venezuela</option></select>
        <select aria-label="Filter by category" data-research-category><option value="all">All categories</option><option value="country-report">Country reports</option><option value="strategy">Strategy viewpoints</option><option value="special-report">Special reports</option><option value="flash-note">Flash notes</option></select>
      </div>
      <div class="research-list">
        <article class="research-item" data-research-item data-country="argentina" data-category="country-report"><div><div class="research-meta">Country report · Argentina</div><h3>Research record placeholder 01</h3><p>API-supplied report title and short abstract will appear here.</p></div><div class="research-date">API DATE</div></article>
        <article class="research-item" data-research-item data-country="egypt" data-category="strategy"><div><div class="research-meta">Strategy viewpoint · Egypt</div><h3>Research record placeholder 02</h3><p>API-supplied report title and short abstract will appear here.</p></div><div class="research-date">API DATE</div></article>
        <article class="research-item" data-research-item data-country="venezuela" data-category="special-report"><div><div class="research-meta">Special report · Venezuela</div><h3>Research record placeholder 03</h3><p>API-supplied report title and short abstract will appear here.</p></div><div class="research-date">API DATE</div></article>
        <article class="research-item" data-research-item data-country="argentina" data-category="flash-note"><div><div class="research-meta">Flash note · Argentina</div><h3>Research record placeholder 04</h3><p>API-supplied report title and short abstract will appear here.</p></div><div class="research-date">API DATE</div></article>
        <div class="empty-state" data-research-empty>No matching research records in the prototype dataset.</div>
      </div>
      <div class="research-foot"><span>Searchable prototype · sample metadata only</span><span>Production: connect to EMFI research API</span></div>
    </div>'''


def logo_tile(name, role, style=''):
    return f'<div class="logo-tile"><div class="logo-word {style}">{name}</div><div class="logo-role">{role}</div></div>'

# --- 01 Research & Execution ---
hero1 = hero('Research & Execution','Beyond the ', 'headlines|consensus|obvious', 'Independent research and specialist execution, connected by a team that understands the markets it covers.', 1, 'Services')
body1a = '''<p class="lead">Research should help you see beyond the consensus.</p>
<p class="body-copy">Our research combines economic analysis, country-level intelligence, quantitative models and market insight to develop independent views on the markets we cover.</p>
<p class="body-copy">From sovereign fundamentals and debt sustainability to political developments and relative value, we focus on the factors that drive investment decisions.</p>
<p class="small-note">Search the research library by keyword, country, subject or report type. Production records, report links and access controls are to be supplied by the EMFI research API.</p>'''
section1a = section_dark('01 / RESEARCH','Less noise. More signal.',body1a,research_widget())
body1b = '''<p class="lead">Understanding the opportunity is only the beginning.</p>
<p class="body-copy">Our sales and trading team works directly with clients and counterparties to source liquidity, assess pricing and execute transactions.</p>
<p class="body-copy">We combine market knowledge with specialist execution capabilities, focusing on the details that matter: price, liquidity, timing and settlement.</p>
<h3 style="margin-top:28px">The EMFI Workstation</h3>
<p class="body-copy">A dedicated execution interface connecting market information, trading activity and transaction workflows.</p>'''
section1b = section_light('02 / EXECUTION','Insight into execution.',body1b,workstation_mockup())
fact1 = facts('Regulatory & research information', '''<p><strong>EMFI Securities Limited</strong> is authorised and regulated by the Financial Conduct Authority (FCA), United Kingdom. Reference Number: 763979.</p>
<p>Execution services are provided to eligible professional clients, subject to applicable regulatory permissions, client classification and execution arrangements.</p>
<p>Research is provided for informational purposes and does not constitute a personal recommendation or an offer to buy or sell financial instruments.</p>''','Execution Policy & Research Disclosures','#')
(ROOT/'research-execution.html').write_text(page_html('Research & Execution','research-execution.html',hero1,section1a,section1b,fact1,1),encoding='utf-8')

# --- 02 Settlement & Custody ---
hero2 = hero('Settlement & Custody','Your assets. ', 'visible|accounted for|in view', 'Institutional custody and settlement services, supported by technology that brings greater visibility to positions, balances and transactions.', 2, 'Services')
body2a = '''<p class="lead">The trade is only one part of the transaction.</p>
<p class="body-copy">Cash movements, securities positions and outstanding trades all need to be accounted for. Our post-trade infrastructure connects settlement activity with account information, providing a clearer picture of what has happened and what remains outstanding.</p>
<h3 style="margin-top:27px;color:#fff">Your portfolio at a glance.</h3>
<p class="body-copy">The EMFI Dashboard brings together key account information:</p>
<ul class="bullet-list"><li>Cash balances</li><li>Securities positions</li><li>Outstanding trades</li><li>Transaction history</li><li>Fees and charges</li></ul>'''
section2a = section_dark('01 / SETTLEMENT','Nothing left in the dark.',body2a,dashboard_mockup())
body2b = '''<p class="lead">Holding client money and securities comes with specific obligations.</p>
<p class="body-copy">Our UK custody and safeguarding arrangements operate within the FCA's Client Assets Sourcebook (CASS).</p>
<div class="two-col-copy" style="margin-top:25px">
  <div><h3>CASS 7 | Client Money</h3><p class="body-copy">Client money held or controlled by EMFI Capital Limited is subject to applicable segregation requirements. These include appropriate records, reconciliations and arrangements with the banks holding client money.</p><p class="body-copy">The statutory trust framework is designed to protect client money in the event of a firm's failure.</p></div>
  <div><h3>CASS 6 | Safe Custody Assets</h3><p class="body-copy">Safe custody assets are subject to separate requirements governing their safekeeping, records and reconciliations.</p><p class="body-copy">These rules are designed to protect clients' ownership rights and help distinguish client assets from those belonging to the firm or other clients.</p></div>
</div>
<div class="callout">Protection through process. Segregation, accurate records, reconciliations and oversight are fundamental to the way custody arrangements operate.</div>
<p class="body-copy">Our wider control framework and regulatory oversight are explained on the <a class="inline-link" href="dependable-operations.html">Dependable Operations</a> page.</p>'''
section2b = section_light('02 / CUSTODY','Custody is a responsibility, not a feature.',body2b,'''<div class="device-grid"><div><div class="screen-label">CASS / controls at a glance</div><div class="cass-stack"><div class="cass-card"><strong>CASS 7</strong><b>Client money</b><span>Segregation · records · reconciliations</span></div><div class="cass-card"><strong>CASS 6</strong><b>Safe custody assets</b><span>Safekeeping · ownership records · reconciliations</span></div><div class="cass-card"><strong>Oversight</strong><b>Defined responsibilities</b><span>Controls · acknowledgements · escalation</span></div></div><p class="tech-caption">Simplified summary of relevant UK client asset controls.</p></div><div>''' + mobile_mockup() + '''</div></div>''')
fact2 = facts('Client asset information', '''<p><strong>EMFI Capital Limited</strong> is authorised and regulated by the FCA and is subject to the applicable CASS requirements in respect of client money and safe custody assets it holds or controls.</p>
<p><strong>EMFI Capital (DIFC) Limited</strong> is separately regulated by the DFSA and subject to the applicable DIFC client asset requirements.</p>
<p>Client asset protections do not eliminate all custody, banking or third-party risks and do not protect against investment losses.</p>''','Client Asset Disclosures','#')
(ROOT/'settlement-custody.html').write_text(page_html('Settlement & Custody','settlement-custody.html',hero2,section2a,section2b,fact2,2),encoding='utf-8')

# --- 03 Wealth & Asset Management ---
hero3 = hero('Wealth & Asset Management','Capital, managed with ', 'purpose|discipline|perspective', 'We combine tailored portfolio management with dedicated investment strategies and properly structured investment vehicles.', 3, 'Services')
body3a = '''<p class="lead">Investment objectives differ. So should the approach.</p>
<p class="body-copy">We work with professional investors to understand their objectives, risk appetite, liquidity requirements and investment constraints.</p>
<p class="body-copy">Our approach to wealth management is based on defined mandates, considered portfolio construction and ongoing investment oversight.</p>
<p class="body-copy">For asset managers and investors seeking dedicated investment structures, we provide access to established fund arrangements supported by specialist management and professional services.</p>'''
section3a = section_dark('01 / WEALTH MANAGEMENT','Management built around the mandate.',body3a,'''<div class="screen-label">Portfolio management / concept visual</div><div class="app-screen"><div class="app-topbar"><span class="app-brand">EMFI / PORTFOLIO OVERSIGHT</span><span class="app-user">MANDATE　 RISK　 REPORTING</span></div><div class="app-body"><div class="app-eyebrow">Illustrative portfolio framework</div><div class="app-heading">A mandate-led approach</div><div class="app-stats"><div class="app-stat"><span>OBJECTIVES</span><strong>01</strong></div><div class="app-stat"><span>RISK FRAMEWORK</span><strong>02</strong></div><div class="app-stat"><span>OVERSIGHT</span><strong>03</strong></div></div><div class="app-table"><div class="app-table-head"><span>Portfolio dimension</span><span>Approach</span><span>Review</span><span>Status</span></div><div class="app-table-row"><span>Investment objectives</span><span>Defined</span><span>Ongoing</span><span>Mandate</span></div><div class="app-table-row"><span>Risk parameters</span><span>Agreed</span><span>Ongoing</span><span>Control</span></div><div class="app-table-row"><span>Liquidity needs</span><span>Defined</span><span>Ongoing</span><span>Review</span></div></div></div><div class="app-placeholder-note">CONCEPT VISUAL · NOT A CLIENT PORTFOLIO SCREENSHOT</div></div>''')
body3b = '''<p class="lead">An investment strategy needs more than capital and an investment manager.</p>
<p class="body-copy">It requires a proper legal structure, defined responsibilities and professional oversight.</p>
<p class="body-copy"><strong>EMFI Fund SPC</strong> is a Cayman Islands segregated portfolio company providing a common fund structure for distinct investment portfolios.</p>
<p class="body-copy">Each segregated portfolio has its own investment mandate, assets and applicable portfolio-level arrangements, subject to the company's constitutional documents and relevant offering materials.</p>
<h3 style="margin-top:25px">A network of professional service providers</h3>
<p class="body-copy">The fund ecosystem combines EMFI's investment and operational capabilities with specialist administration, audit and legal services. The roles shown below reflect appointments disclosed for relevant portfolio arrangements; appointments and responsibilities may differ between portfolios.</p>'''
visual3b = '''<div class="fund-structure">
  <div class="fund-node primary"><strong>EMFI Fund SPC</strong><span>Cayman Islands · Segregated portfolio company</span></div>
  <div class="fund-arrow">↓</div>
  <div class="fund-branch"><div class="fund-node"><strong>Portfolio 01</strong><span>Distinct mandate & assets</span></div><div class="fund-node"><strong>Portfolio 02</strong><span>Distinct mandate & assets</span></div><div class="fund-node"><strong>Portfolio 03</strong><span>Distinct mandate & assets</span></div></div>
</div>
<div class="logo-wall" style="margin-top:28px">
  {0}{1}{2}{3}{4}{5}
</div>
<p class="logo-disclaimer">Selected providers and roles appearing in relevant portfolio arrangements. Specific appointments and responsibilities are portfolio-specific and must be confirmed against the relevant fund documentation.</p>'''.format(
    logo_tile('EMFI Capital','Investment Manager & AIFM'),
    logo_tile('EMFI Capital','Custodian & Prime Broker'),
    logo_tile('APEX','Fund administration'),
    logo_tile('Baker Tilly','Audit','serif'),
    logo_tile('WALKERS','Legal counsel','spaced'),
    logo_tile('DECHERT','Legal counsel','spaced')
)
section3b = section_light('02 / ASSET MANAGEMENT','A fund is more than a portfolio.',body3b,visual3b)
fact3 = facts('Fund structure information', '''<p><strong>EMFI Fund SPC</strong> is established in the Cayman Islands as a segregated portfolio company and operates within the applicable Cayman Islands regulatory framework.</p>
<p>The structure supports distinct investment portfolios, each subject to its respective investment mandate, governing documents, appointed service providers and eligibility requirements.</p>
<p>Fund investments involve risk, including possible loss of capital. The relevant offering documents contain the full details of each portfolio and its investment terms.</p>
<p><em>Developer verification:</em> confirm the current CIMA registered name and licence/reference particulars before publication. Public records and the existing EMFI website currently show a naming/reference discrepancy.</p>''','Fund Documentation','#')
(ROOT/'wealth-asset-management.html').write_text(page_html('Wealth & Asset Management','wealth-asset-management.html',hero3,section3a,section3b,fact3,3),encoding='utf-8')

# --- 04 Direct Access ---
hero4 = hero('Direct Access','Closer to ', 'markets|infrastructure|counterparties', 'Institutional access should not require an institutional maze. We connect professional investors to established market infrastructure, fund platforms and execution arrangements through a specialist operating model.', 4, 'Why EMFI')
body4a = '''<p class="lead">Access to market infrastructure is fundamental to how financial services operate.</p>
<p class="body-copy">Our established arrangements provide connectivity to international securities settlement and custody infrastructure, alongside specialist fund dealing and distribution platforms.</p>
<p class="body-copy">These are complementary capabilities, not interchangeable depositories.</p>'''
visual4a = '''<div class="provider-groups">
  <div class="provider-group"><h3>Securities settlement & custody</h3><div class="logo-wall">{0}</div><p class="small-note">International securities settlement, custody and asset servicing infrastructure.</p></div>
  <div class="provider-group"><h3>Fund settlement</h3><div class="logo-wall">{1}</div><p class="small-note">Euroclear's dedicated fund solution, supporting order routing, subscriptions, redemptions, switches and settlement.</p></div>
  <div class="provider-group"><h3>Fund distribution & technology</h3><div class="logo-wall">{2}</div><p class="small-note">Fund dealing, distribution and investment technology connecting financial institutions and asset managers.</p></div>
</div>'''.format(logo_tile('EUROCLEAR','Market infrastructure','spaced'),logo_tile('FundSettle','Fund platform','serif'),logo_tile('allfunds','Fund distribution & technology'))
section4a = section_dark('01 / MARKET INFRASTRUCTURE','Closer to the source.',body4a,visual4a)
body4b = '''<p class="lead">For eligible clients and supported instruments, we provide Direct Market Access (DMA) arrangements to selected trading venues.</p>
<p class="body-copy">DMA allows approved clients to submit orders electronically through designated execution arrangements, subject to applicable pre-trade controls, risk limits and ongoing monitoring.</p>
<p class="body-copy">Access is not automatic or unrestricted. Eligibility and availability depend on professional client classification, account size and activity, instrument and venue availability, operational suitability, credit limits and risk controls.</p>
<p class="body-copy">Access is assessed individually and remains subject to EMFI's approval and applicable venue requirements.</p>'''
visual4b = '''<div class="screen-label">Direct Market Access / simplified operating model</div>
<div class="dma-flow"><div class="dma-step"><b>01 / Client</b><span>Approved professional client submits order.</span></div><div class="dma-step"><b>02 / EMFI</b><span>Pre-trade controls and risk thresholds.</span></div><div class="dma-step"><b>03 / Venue</b><span>Order routed through approved access.</span></div><div class="dma-step"><b>04 / Post-trade</b><span>Execution, confirmation and settlement.</span></div></div>
<div style="margin-top:23px"><div class="screen-label">Access conditions</div><div class="condition-list"><div class="condition"><i>✓</i><span>Professional client classification and onboarding</span></div><div class="condition"><i>✓</i><span>Account size and trading activity criteria</span></div><div class="condition"><i>✓</i><span>Supported instruments and trading venues</span></div><div class="condition"><i>✓</i><span>Operational, credit and risk controls</span></div></div></div>'''
section4b = section_light('02 / EXECUTION ACCESS','Direct Market Access.',body4b,visual4b)
fact4 = facts('Access & execution information', '''<p>Access to Euroclear, FundSettle and Allfunds is subject to the relevant account, connectivity and service arrangements.</p>
<p>DMA is available only to approved clients for supported instruments and venues, subject to due diligence, account criteria, risk controls and applicable regulatory requirements.</p>
<p>Infrastructure provider names identify relevant platforms and services; their inclusion does not imply an endorsement of EMFI.</p>''','Execution Policy & Regulatory Disclosures','#')
(ROOT/'direct-access.html').write_text(page_html('Direct Access','direct-access.html',hero4,section4a,section4b,fact4,4),encoding='utf-8')

# --- 05 Responsive Service ---
hero5 = hero('Responsive Service','Straight to ', 'the people|the detail|a solution', 'Technology should make financial services simpler. People should make them work. We combine direct access to specialists with technology designed to provide greater visibility, flexibility and control across the investment lifecycle.', 5, 'Why EMFI')
body5a = '''<p class="lead">Financial markets do not always follow standard workflows. Neither do client requirements.</p>
<p class="body-copy">Some transactions involve unusual instruments, complex settlement arrangements, restricted liquidity or operational requirements that do not fit an off-the-shelf process.</p>
<p class="body-copy">We take a practical, case-by-case approach. Our specialists assess the underlying requirement, identify the relevant operational and regulatory constraints and, where feasible, work with clients and counterparties to identify an appropriate solution.</p>
<div class="callout">Good technology handles the routine. Experienced people handle the exceptions.</div>
<p class="body-copy">Where standard arrangements are insufficient, our objective is to find a workable alternative within our permissions, risk framework and available infrastructure.</p>'''
visual5a = '''<div class="screen-label">Specialist-led exception handling / illustrative workflow</div><div class="app-screen"><div class="app-topbar"><span class="app-brand">EMFI / OPERATING MODEL</span><span class="app-user">ASSESS　 COORDINATE　 RESOLVE</span></div><div class="app-body"><div class="app-eyebrow">A case-by-case approach</div><div class="app-heading">From requirement to workable route</div><div class="dma-flow" style="grid-template-columns:repeat(3,1fr);margin-top:15px"><div class="dma-step"><b>Understand</b><span>Clarify the client requirement and transaction context.</span></div><div class="dma-step"><b>Assess</b><span>Review permissions, counterparties, controls and constraints.</span></div><div class="dma-step"><b>Coordinate</b><span>Where feasible, identify and implement an appropriate route.</span></div></div></div><div class="app-placeholder-note">CONCEPT VISUAL · NOT A PRODUCTION WORKFLOW SCREENSHOT</div></div>'''
section5a = section_dark('01 / SPECIALIST SERVICE','Not everything fits a dropdown.',body5a,visual5a)
body5b = '''<p class="lead">Our technology is designed to bring together execution, account information and portfolio visibility.</p>
<p class="body-copy">The tools provide the information and workflows. Our people provide the expertise, communication and judgement required when something falls outside the ordinary course of business.</p>
<p class="body-copy">A connected technology environment supports the routine, while direct access to specialists helps address the exceptions.</p>'''
visual5b = '''<div class="tech-showcase"><div><div class="screen-label">Workstation / screenshot placeholder</div>''' + workstation_mockup() + '''<div class="tech-caption">Execution interfaces and trading workflows.</div></div><div class="tech-side"><div><div class="screen-label">Dashboard / screenshot placeholder</div>''' + dashboard_mockup() + '''<div class="tech-caption">Balances, positions, outstanding trades, transaction history and fees.</div></div><div>''' + mobile_mockup() + '''</div></div></div>'''
section5b = section_light('02 / TECHNOLOGY & PEOPLE','Technology with people behind it.',body5b,visual5b)
fact5 = facts('Digital services information', '''<p>Our digital services are provided to eligible clients and authorised users in accordance with the relevant account arrangements.</p>
<p>Available functionality varies according to the service, account and instrument. Interface images in this prototype are illustrative and must be replaced with approved production screenshots. Official statements, confirmations and contractual records remain authoritative.</p>''','Digital Services & User Disclosures','#')
(ROOT/'responsive-service.html').write_text(page_html('Responsive Service','responsive-service.html',hero5,section5a,section5b,fact5,5),encoding='utf-8')

# --- 06 Dependable Operations ---
hero6 = hero('Dependable Operations','Built on ', 'control|precision|accountability', 'Institutional infrastructure is defined by what happens behind the scenes. Regulation, governance, audit, reconciliations and established professional relationships provide the framework within which we operate.', 6, 'Why EMFI')
body6a = '''<p class="lead">EMFI operates through specialist legal entities, each authorised or licensed for its respective activities.</p>
<p class="body-copy">The regulatory status of each entity, rather than the group name alone, defines the services it may provide and the responsibilities it undertakes.</p>
<p class="body-copy">The entities below are linked to their respective public registers for independent verification.</p>'''
visual6a = '''<div class="regulatory-grid">
  <div class="regulatory-card"><div class="region">United Kingdom / FCA</div><strong>EMFI Securities Limited</strong><span>Reference Number: 763979</span><span>Authorised and regulated by the Financial Conduct Authority.</span></div>
  <div class="regulatory-card"><div class="region">United Kingdom / FCA</div><strong>EMFI Capital Limited</strong><span>Reference Number: 822389</span><span>Authorised and regulated by the Financial Conduct Authority.</span></div>
  <div class="regulatory-card"><div class="region">DIFC / DFSA</div><strong>EMFI Capital (DIFC) Limited</strong><span>Reference Number: F011663</span><span>Endorsement: Holding or Controlling Client Assets.</span></div>
</div>
<p class="small-note" style="margin-top:13px">EMFI Fund SPC is addressed separately in the Wealth & Asset Management page. Confirm current CIMA naming and reference particulars before publication.</p>'''
section6a = section_dark('01 / REGULATION & OVERSIGHT','Regulated. Structured. Accountable.',body6a,visual6a)
body6b = '''<p class="lead">Controls. Reconciliations. Audit trails. Defined responsibilities.</p>
<p class="body-copy">The things that matter most are rarely the things that make the best marketing.</p>
<p class="body-copy">Our operating environment is supported by specialist professional firms and financial market infrastructure. The organisations below are grouped by their relevant role, rather than presented as generic endorsements.</p>'''
visual6b = '''<div class="provider-groups">
  <div class="provider-group"><h3>Regulated by</h3><div class="logo-wall">{0}{1}{2}</div><p class="logo-disclaimer">FCA and DFSA regulatory status is entity-specific. CIMA status relates to the fund structure.</p></div>
  <div class="provider-group"><h3>Authorised under / regulatory framework</h3><div class="logo-wall">{3}{4}</div><p class="logo-disclaimer">MiFID and AIFMD references apply only to the relevant authorised EMFI entity and activities.</p></div>
  <div class="provider-group"><h3>Audited by</h3><div class="logo-wall">{5}{6}</div><p class="logo-disclaimer">BDO: relevant DIFC entity. Baker Tilly: relevant fund structures.</p></div>
  <div class="provider-group"><h3>Administered by</h3><div class="logo-wall">{7}</div></div>
  <div class="provider-group"><h3>Legal counsel</h3><div class="logo-wall">{8}{9}</div></div>
  <div class="provider-group"><h3>Connected to / banking & infrastructure</h3><div class="logo-wall">{10}{11}{12}{13}</div></div>
  <div class="provider-group"><h3>Quoted in</h3><div class="logo-wall">{14}</div><p class="logo-disclaimer">Insert only verified publications containing attributed EMFI commentary, with links to the original coverage.</p></div>
  <div class="provider-group"><h3>Independent recognition</h3><div class="logo-wall">{15}</div><p class="logo-disclaimer">Add only independently assessed recognition with the award name, year and category.</p></div>
</div>
<p class="logo-disclaimer">Provider appointments, audit scopes and operational relationships vary by EMFI legal entity, fund and service. Each logo should be accompanied by its precise role and approved for use before publication.</p>'''.format(
    logo_tile('FCA','United Kingdom regulator','spaced'),logo_tile('DFSA','DIFC regulator','spaced'),logo_tile('CIMA','Cayman Islands regulator','spaced'),logo_tile('MiFID','Relevant investment services framework','serif'),logo_tile('AIFMD','Relevant alternative fund manager framework','serif'),logo_tile('BDO','Audit','spaced'),logo_tile('Baker Tilly','Audit','serif'),logo_tile('APEX','Fund administration'),logo_tile('WALKERS','Legal counsel','spaced'),logo_tile('DECHERT','Legal counsel','spaced'),logo_tile('NatWest','Client money banking','serif'),logo_tile('Santander','Client money banking','serif'),logo_tile('EUROCLEAR','Market infrastructure','spaced'),logo_tile('allfunds','Fund platform'),logo_tile('PUBLICATIONS','Verified media logos pending'),logo_tile('FocusEconomics','Research recognition','serif')
)
section6b = section_light('02 / PROFESSIONAL OVERSIGHT','Boring, by design.',body6b,visual6b)
fact6 = facts('Regulatory & provider information', '''<p>The regulatory permissions described above apply to the named legal entities and the activities each is authorised or licensed to conduct. The DFSA register identifies EMFI Capital (DIFC) Limited under reference F011663 with an endorsement for Holding or Controlling Client Assets; its dealing-as-principal activity is restricted to matched-principal deals.</p>
<p>Third-party providers perform their respective functions under separate contractual arrangements. Their inclusion does not imply endorsement of EMFI or guarantee the performance of its services or investments.</p>
<p>Fund appointments and audit arrangements apply to the relevant legal entity or portfolio. Recognition and media references should be supported by the underlying award or publication.</p>''','Regulatory Information & Legal Disclosures','#')
(ROOT/'dependable-operations.html').write_text(page_html('Dependable Operations','dependable-operations.html',hero6,section6a,section6b,fact6,6),encoding='utf-8')

# Overview / developer preview home, deliberately not a replacement for the approved public homepage.
service_cards = ''.join(f'''<a class="page-card" href="{href}"><span class="card-number">{i:02d} / SERVICE</span><h3>{name}</h3><p>{desc}</p><span class="card-arrow">↗</span></a>''' for i,(name,href,desc) in enumerate([
    ('Research & Execution','research-execution.html','Live research concept, searchable library and Workstation visual.'),
    ('Settlement & Custody','settlement-custody.html','Dashboard visibility, settlement operations and CASS framework.'),
    ('Wealth & Asset Management','wealth-asset-management.html','Mandate-led management and the EMFI Fund SPC structure.')],1))
why_cards = ''.join(f'''<a class="page-card" href="{href}"><span class="card-number">{i:02d} / WHY EMFI</span><h3>{name}</h3><p>{desc}</p><span class="card-arrow">↗</span></a>''' for i,(name,href,desc) in enumerate([
    ('Direct Access','direct-access.html','Euroclear, FundSettle, Allfunds and qualified DMA arrangements.'),
    ('Responsive Service','responsive-service.html','Direct specialist access, operational flexibility and technology.'),
    ('Dependable Operations','dependable-operations.html','Regulatory entities, audit, providers and operational controls.')],1))
index = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="EMFI six-page inner website prototype"><title>EMFI | Inner-page website prototype</title><link rel="stylesheet" href="styles.css"></head><body>
{nav_html('')}
<main>
<section class="overview-hero"><div class="container"><div class="kicker" style="color:#6bcac3">EMFI / WEBSITE PROTOTYPE</div><h1>Institutional Infrastructure.<br><span>Without the Institutional Runaround.</span></h1><p>Six inner pages designed to substantiate the homepage proposition through research, technology, market infrastructure and operating evidence.</p></div></section>
<section class="overview-nav" id="services"><div class="container">
<div class="overview-group"><div class="overview-group-head"><h2>Services</h2><span>What EMFI does</span></div><div class="page-cards">{service_cards}</div></div>
<div class="overview-group" id="why-emfi"><div class="overview-group-head"><h2>Why EMFI</h2><span>How EMFI operates</span></div><div class="page-cards">{why_cards}</div></div>
<p class="prototype-note"><strong>Developer note:</strong> This overview is a navigation and review page for the six-page prototype. It is not intended to replace the existing approved EMFI homepage. Prototype research records, interface frames and typographic provider lockups must be replaced with live API data, approved product screenshots and authorised brand assets before publication.</p>
</div></section>
</main>{footer_html()}<script src="script.js"></script></body></html>'''
(ROOT/'index.html').write_text(index,encoding='utf-8')

print('Generated:', ', '.join(p.name for p in ROOT.glob('*.html')))
