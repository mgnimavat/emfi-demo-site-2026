#!/usr/bin/env python3
"""EMFI website v10 generator. Usage: python3 build.py <out_dir>"""
import json, sys, os, html, random, re

OUT = sys.argv[1] if len(sys.argv) > 1 else ".."
HERE = os.path.dirname(os.path.abspath(__file__))
HOST = "https://www.example-staging.invalid"   # replace with production host
PROD = os.environ.get('EMFI_PROD') == '1'
T = lambda s: '' if PROD else f'<span class="todo">{s}</span>'
HOLD = lambda review, prod='': prod if PROD else review   # unverified names/claims: shown in review build only
FCA, DFSA = "https://register.fca.org.uk/", "https://www.dfsa.ae/public-register"
FCAQ = lambda frn: f"https://register.fca.org.uk/s/search?q={frn}&type=Companies"
LON = "25-26 Dering Street, Third Floor, Mayfair, London W1S 1AW"
DXB = "Damac Park Towers, DIFC, Dubai, United Arab Emirates"
CAY = "Suite #7, Grand Pavilion Commercial Centre, 802 West Bay Road, P.O. Box 10250, Grand Cayman KY1-1103, Cayman Islands"
PEOPLE = "https://emfi-demo-site-2026.vercel.app/people/"   # hotlinked for now; host the approved portraits on the production domain

NAV = [("intelligence-execution.html", "Intelligence &amp; Execution"), ("settlement-custody.html", "Settlement &amp; Custody"), ("wealth-asset-management.html", "Wealth &amp; Asset Management")]
POWER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 3v8"/><path d="M6.3 6.8a8 8 0 1 0 11.4 0"/></svg>'

def header(active):
    n = "".join(f'<a href="{h}"{" aria-current=page" if h == active else ""}>{t}</a>' for h, t in NAV)
    r = "".join(f'<a href="{h}"{" aria-current=page" if h == active else ""}>{t}</a>' for h, t in [("about.html", "About"), ("contact.html", "Contact")])
    return f'''<a class="skip" href="#main">Skip to content</a><header class="hdr"><div class="hdr-in"><a class="logo" href="index.html" aria-label="EMFI home"><img src="assets/img/emfi-logo-light.png" alt="EMFI" width="82" height="38"></a>
<button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav">&#9776;</button><nav class="nav" id="nav" aria-label="Primary"><div class="nav-c">{n}</div><div class="nav-r">{r}<span class="lang" role="group" aria-label="Language"><button type="button" lang="en" aria-pressed="true">EN</button><button type="button" lang="es" disabled title="Spanish version in preparation">ES</button><button type="button" lang="ar" disabled title="Arabic version in preparation">AR</button></span><a class="login" href="https://login.emfi.uk" target="_blank" rel="noopener" aria-label="Client login">{POWER}</a></div></nav></div></header>'''

LEGAL = f'''<div class="flegal"><strong>EMFI Securities Limited</strong> (FRN 763979) and <strong>EMFI Capital Limited</strong> (FRN 822389) are authorised and regulated by the Financial Conduct Authority. <strong>EMFI Capital (DIFC) Limited</strong> is authorised and regulated by the Dubai Financial Services Authority (F011663). EMFI Group Limited is a holding company and is not itself FCA-authorised. For professional clients and eligible counterparties only; not directed at retail clients or US persons. Company details and permissions by entity: <a href="dependable.html#entities">Regulatory information</a>. Check the <a href="{FCA}" target="_blank" rel="noopener">FCA Register</a> and <a href="{DFSA}" target="_blank" rel="noopener">DFSA Public Register</a>. Third-party names and logos belong to their owners and do not imply endorsement. {T("Compliance to approve")}</div>'''

# logos extracted from the supplied logo library (hotlinked until official files are hosted)
_lib = open(os.path.join(HERE, "logo_library.html"), encoding="utf-8").read()
LOGO = {}
for _m in re.finditer(r'<img src="([^"]+)" alt="([^"]+?) logo"', _lib):
    LOGO[_m.group(2)] = _m.group(1)
LOGO["Euroclear FundSettle"] = LOGO.get("Euroclear")
LOGO["Tradegate"] = LOGO.get("Tradegate Berlin Stock Exchange")
LOGO["Apex"] = LOGO.get("Apex Group")
def FLOGO(n):
    u = LOGO.get(n)
    return f'<img class="flogo" src="{u}" alt="{n}" loading="lazy" onerror="this.outerHTML=\'<b>{n.upper()}</b>\'">' if u else f"<b>{n.upper()}</b>"
def lg(n, label=None):
    u = LOGO.get(n); label = label or n
    inner = f'<img src="{u}" alt="{n}" loading="lazy" onerror="this.outerHTML=\'<b>{n}</b>\'">' if u else f'<b>{n}</b>{T("logo slot")}'
    return f'<div class="lg rv">{inner}<small>{label}</small></div>'
def logos(items):
    return '<div class="logos">' + "".join(lg(*i) if isinstance(i, tuple) else lg(i) for i in items) + '</div>'

CRED = [f'<a class="cred" href="https://www.euroclear.com" target="_blank" rel="noopener">{FLOGO("Euroclear")}<span>Direct Participant</span></a>',
        '<a class="cred" href="https://www.emta.org/membership/list-of-members/" target="_blank" rel="noopener"><b>EMTA</b><span>Buy-Side Member</span></a>',
        '<a class="cred" href="https://www.cisi.org/cisiweb2/cisi-website/who-we-are/cisi-chartered-firm" target="_blank" rel="noopener"><b>CISI</b><span>Chartered Firm&trade;</span></a>']
FOOT = f'''<footer class="ftr"><div class="wrap"><div class="f5">
<div class="f-e"><a href="index.html" aria-label="EMFI home"><img src="assets/img/emfi-e-white.png" alt="EMFI" width="72" height="72"></a></div>
<div class="f-p"><a class="big" href="direct.html">Direct</a><p>Fewer intermediaries. Fewer handovers.</p>{HOLD(CRED[0])}</div>
<div class="f-p"><a class="big" href="responsive.html">Responsive</a><p>Technology that works. People who respond.</p>{HOLD(CRED[1])}</div>
<div class="f-p"><a class="big" href="dependable.html">Dependable</a><p>Institutional safeguards. Clear accountability.</p>{HOLD(CRED[2])}</div>
<div class="f-r"><h4>Legal</h4><a href="dependable.html#entities">Regulatory information</a><a href="legal.html#terms">Terms of use</a><a href="legal.html#privacy">Privacy &amp; cookies</a><a href="legal.html#terms">Complaints &amp; policies</a><a href="legal.html#accessibility">Accessibility</a>
{HOLD('<h4>Follow</h4><a href="#" rel="noopener">LinkedIn</a> <span class="todo">add social links</span><h4>Get the app</h4><div class="apps"><span>App Store</span><span>Google Play</span></div><span class="todo">add verified store links</span>')}</div></div>
{LEGAL}<div class="fcopy"><span>&copy; <span data-year>2026</span> EMFI Group Limited. All rights reserved.</span></div></div></footer>{"" if PROD else '<button class="flagbtn" type="button">Hide review flags</button>'}'''

def page(fn, title, desc, body, active=None):
    url = f"{HOST}/{'' if fn == 'index.html' else fn}"
    org = {"@context": "https://schema.org", "@graph": [
        {"@type": "Organization", "@id": f"{HOST}/#org", "name": "EMFI Group", "legalName": "EMFI Group Limited", "url": HOST + "/", "logo": f"{HOST}/assets/img/emfi-logo.png",
         "address": {"@type": "PostalAddress", "streetAddress": "25-26 Dering Street, Third Floor, Mayfair", "addressLocality": "London", "postalCode": "W1S 1AW", "addressCountry": "GB"},
         "telephone": "+44 20 3983 3634", "email": "contact@emfi.uk"},
        {"@type": "WebPage", "@id": url, "name": title, "description": desc, "isPartOf": {"@id": f"{HOST}/#org"}, "inLanguage": "en-GB"}]}
    h = f'''<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>{title}</title><meta name="description" content="{desc}"><link rel="canonical" href="{url}">
<meta property="og:type" content="website"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:url" content="{url}"><meta property="og:image" content="{HOST}/assets/img/og.png"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#001a34"><link rel="icon" href="assets/img/favicon.png"><link rel="preload" href="assets/fonts/Inter-ExtraBold.otf" as="font" type="font/otf" crossorigin>
<link rel="stylesheet" href="assets/css/site.css"><script type="application/ld+json">{json.dumps(org)}</script></head><body>{header(active)}<main id="main">{body}</main>{FOOT}<script src="assets/js/site.js" defer></script></body></html>'''
    open(os.path.join(OUT, fn), "w", encoding="utf-8").write(h)

def mapbox(q, title):
    return f'<div class="mapbox" data-map data-q="{q}" data-title="{title}"><div><p>The map is provided by Google. Loading it shares your IP address with Google.</p><button type="button">Load map</button></div></div>'

def sec(cls, inner, id_=""):
    return f'<section class="sec {cls}"{f" id={id_}" if id_ else ""}><div class="wrap">{inner}</div></section>'

def split(kick, title, lead):
    return f'<div class="split"><div class="rv"><h2>{title}</h2></div><div class="rv"><p class="lead">{lead}</p></div></div>'

G = '<span class="dot">.</span>'

def short_hero(kick, h1, lead, extra=""):
    return f'<section class="hero short"><div class="wrap"><p class="kicker">{kick}</p><h1>{h1}</h1><p class="sub">{lead}</p>{extra}</div><div class="ghostword" aria-hidden="true">e</div></section>'

# ---------------------------------------------------------------- the stroke-drawn "e"
EMARK = '''<div class="emark" aria-hidden="true"><svg viewBox="738 303 520 520"><defs><linearGradient id="eg" gradientUnits="userSpaceOnUse" x1="760" y1="320" x2="1240" y2="800"><stop offset="0" stop-color="#3f9fc9"/><stop offset="1" stop-color="#4fc3b0"/></linearGradient></defs>
<g class="par"><circle class="halo" cx="998" cy="563" r="262"/><circle class="halo" cx="998" cy="563" r="300"/><path class="ring" pathLength="1" d="M998 373A190 190 0 1 0 1144 442"/><path class="stem" pathLength="1" d="M997.5 374V590"/></g></svg></div>'''

# ---------------------------------------------------------------- anonymised product UI (synthetic data)
GRY = ["#8a93a5", "#b0bfe0", "#3f4249", "#8d9199", "#001a34", "#9ab8d6"]
def donut():
    segs = [(45, "#8a93a5"), (27, "#b0bfe0"), (12, "#3f4249"), (9, "#8d9199"), (5, "#001a34"), (2, "#ee2b2b")]
    s = '<svg viewBox="0 0 390 262" role="img" aria-label="Illustrative balances by currency"><g transform="rotate(180 195 222)" fill="none"><circle cx="195" cy="222" r="128" stroke="#e8eaee" stroke-width="64" pathLength="200" stroke-dasharray="100 100"/>'
    off = 0
    for v, c in segs:
        s += f'<circle cx="195" cy="222" r="128" stroke="{c}" stroke-width="58" pathLength="200" stroke-dasharray="{v} 200" stroke-dashoffset="{-off}"/>'
        off += v
    s += '</g><g font-size="9" font-weight="700" fill="#2b3340">'
    for i, (c, col) in enumerate([("USD", "#6b7686"), ("EUR", "#b0bfe0"), ("GBP", "#0b1220"), ("CHF", "#0b1220"), ("AED", "#b0bfe0"), ("CAD", "#6b7686"), ("SEK", "#ee2b2b")]):
        s += f'<rect x="{18 + i * 52}" y="244" width="2" height="12" fill="{col}"/><text x="{24 + i * 52}" y="254">{c}</text>'
    return s + '</g></svg>'
def cols(labels, vals, colors, mx, ticks):
    s = '<svg viewBox="0 0 390 262" role="img" aria-label="Illustrative column chart"><g font-size="9" fill="#6b7686">'
    for t in ticks:
        y = 220 - t / mx * 190
        s += f'<path d="M36 {y}H380" stroke="#e8eaee"/><text x="28" y="{y + 3}" text-anchor="end">{t}</text>'
    n = len(vals); w = 304 / n
    for i, v in enumerate(vals):
        h = v / mx * 190
        s += f'<rect x="{44 + i * w + w * .17}" y="{220 - h}" width="{w * .66}" height="{h}" rx="2" fill="{colors[i % len(colors)]}"/><text x="{44 + i * w + w / 2}" y="240" text-anchor="middle">{labels[i]}</text>'
    return s + '</g></svg>'
def hbars(labels, vals, mx, ticks, lw=118):
    s = '<svg viewBox="0 0 390 262" role="img" aria-label="Illustrative bar chart"><g font-size="8.5" fill="#2b3340">'
    for t in ticks:
        x = lw + 14 + t / mx * (390 - lw - 40)
        s += f'<path d="M{x} 10V224" stroke="#eef0f3"/><text x="{x}" y="244" text-anchor="middle" fill="#6b7686">{t}</text>'
    rh = 214 / len(vals)
    for i, v in enumerate(vals):
        y = 10 + i * rh
        s += f'<text x="{lw}" y="{y + rh / 2 + 3}" text-anchor="end">{labels[i]}</text><rect x="{lw + 14}" y="{y + rh * .22}" width="{v / mx * (390 - lw - 40)}" height="{rh * .52}" rx="2" fill="{GRY[i % 6]}"/>'
    return s + '</g></svg>'
def dash():
    tile = lambda n, v, svg: f'<div class="tile"><h4>{n}<span>{v}</span></h4>{svg}</div>'
    return ('<div class="ui"><div class="dash">' + tile("Balances", "$12.4M", donut()) +
        tile("Transactions", "96", cols(["Submitted", "Unmatched", "Matched", "Settled", "Failing"], [9, 17, 11, 38, 21], ["#8a93a5", "#b0bfe0", "#3f4249", "#8d9199", "#ff1a1a"], 40, [0, 10, 20, 30, 40])) +
        tile("Exposure", "$8.1M", hbars(["Counterparty A", "Counterparty B", "Counterparty C", "Counterparty D", "Counterparty E", "Counterparty F"], [8.4, 2.6, 1.5, 1.3, 1.2, 1.1], 10, [0, 2, 4, 6, 8, 10])) +
        tile("Positions", "$184M", hbars(["SOV A 6.3 2031", "CORP B 5.0 2029", "SOV C 6.0 2026", "CORP D 6.0 2024", "GOLD", "SOV E 3.9 2037"], [92, 17, 16, 14, 7, 6], 100, [0, 20, 40, 60, 80, 100], 96)) +
        tile("Charges", "$842", cols(["Settlement", "Commission", "Incoming wire", "Amendment", "Execution"], [510, 290, 70, 30, 0], ["#8a93a5", "#b0bfe0", "#3f4249", "#8d9199", "#001a34"], 600, [0, 200, 400, 600])) +
        tile("Performance", "$127", hbars(["BOND A 5.8 2045", "BOND B 7.7 2035", "BOND C 4.6 2036", "BOND D 7.3 2037", "BOND E 5.7 2032", "BOND F 7.6 2057"], [100, 97, 28, 0, 0, 0], 120, [0, 20, 40, 60, 80, 100, 120])) +
        '</div></div>')

def wsx():
    fx = [("EURUSD", "EUR Curncy", "1.0821", "1.0834"), ("USDJPY", "JPY Curncy", "151.40", "151.43"), ("EURGBP", "EUR.GBP", "0.8590", "0.8604"), ("USDCHF", "CHF Curncy", "0.8812", "0.8826"), ("USDCAD", "CAD Curncy", "1.3604", "1.3617")]
    eq = [("EQUITY A PLC", "ILLUSTRATIVE", "24.10", "24.12"), ("EQUITY B INC", "ILLUSTRATIVE", "118.40", "118.46"), ("EQUITY C SA", "ILLUSTRATIVE", "9.72", "9.74"), ("EQUITY D PLC", "ILLUSTRATIVE", "61.05", "61.11"), ("EQUITY E INC", "ILLUSTRATIVE", "203.90", "204.02")]
    bd = [("SOV A 6.3 2031", "ILLUSTRATIVE", "98.250", "98.700"), ("SOV A 6.3 2031", "ILLUSTRATIVE", "98.250", "98.700"), ("CORP B 5.0 2029", "ILLUSTRATIVE", "101.40", "101.90"), ("CORP C 6.6 2038", "ILLUSTRATIVE", "87.20", "87.80"), ("SOV D 7.5 2026", "ILLUSTRATIVE", "99.10", "99.60")]
    def pn(name, rows):
        r = '<div class="r h"><span>Name</span><span>BID</span><span>ASK</span></div>' + "".join(f'<div class="r"><span>{a}<small>{b}</small></span><span class="up">{c}</span><span class="dn">{d}</span></div>' for a, b, c, d in rows)
        return f'<div class="pn"><h4>{name}<span>＋</span></h4>{r}</div>'
    pts = [.55, .75, .8, .78, .7, .72, .66, .52, .6, .7, .82, .74, .66, .5, .3, .12]
    xs = [i / (len(pts) - 1) * 600 for i in range(len(pts))]
    d = "".join(("M" if i == 0 else "L") + f"{xs[i]:.0f} {170 - p * 150:.0f}" for i, p in enumerate(pts))
    chart = f'<div class="pn"><h4>EURUSD</h4><svg viewBox="0 0 640 230" style="display:block;width:100%"><defs><linearGradient id="wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd3da" stop-opacity=".7"/><stop offset="1" stop-color="#cfd3da" stop-opacity="0"/></linearGradient></defs><g transform="translate(24 24)"><path d="{d}L600 170L0 170Z" fill="url(#wa)"/><path d="{d}" fill="none" stroke="#1b1f27" stroke-width="1.4"/><g font-size="9" fill="#6b7686"><path d="M0 170H600" stroke="#e1e4ea"/><path d="M0 100H600" stroke="#eef0f3"/><path d="M0 30H600" stroke="#eef0f3"/>' + "".join(f'<text x="{40 + i * 90}" y="190">{lab}</text>' for i, lab in enumerate(["14. Oct", "18. Oct", "22. Oct", "26. Oct", "30. Oct", "3. Nov", "7. Nov"])) + '</g></g><g font-size="10" font-weight="600" fill="#6b7686" transform="translate(420 6)"><text x="0" y="12">5D</text><text x="30" y="12" fill="#0b1220">1M</text><text x="62" y="12">6M</text><text x="94" y="12">YTD</text><text x="132" y="12">1Y</text><text x="160" y="12">5Y</text><text x="188" y="12">MAX</text></g></svg></div>'
    rows = [("T000112-1", "11/13/2026", "SOV A 6.3 2031", "MARKET", "Redeem", "120/120", "33.13", "3,975.65", "Account 001", "Counterparty A", "f"), ("T000113-1", "11/13/2026", "SOV A 6.3 2031", "MARKET", "Redeem", "120/120", "33.13", "3,975.65", "Account 001", "Counterparty B", "f"),
            ("T000114-1", "11/13/2026", "CORP B 5.0 2029", "MARKET", "Subscribe", "0/5,100", "MARKET", "0", "Account 001", "Counterparty C", "w"), ("T000115-1", "11/13/2026", "CORP B 5.0 2029", "MARKET", "Subscribe", "0/5,100", "MARKET", "0", "Account 002", "Counterparty B", "w"),
            ("T000116-1", "11/12/2026", "EQUITY A PLC", "MARKET", "Sell", "80/80", "197.57", "15,805.60", "Account 002", "Counterparty D", "f"), ("T000117-1", "11/12/2026", "EQUITY A PLC", "MARKET", "Sell", "80/80", "197.57", "15,805.60", "Account 001", "Counterparty E", "f")]
    tr = "".join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td><td>{e}</td><td class="num">{f}</td><td class="num">{g}</td><td class="num">{h}</td><td>{i}</td><td>{j}</td><td><span class="pill2 {k}">{"Filled" if k == "f" else "Working"}</span></td></tr>' for a, b, c, d, e, f, g, h, i, j, k in rows)
    return f'''<div class="ui"><div class="uibar"><i></i><i></i><i></i><span>Workstation</span></div><div class="wsx">{pn("Forex", fx)}{pn("Equities", eq)}{pn("Bonds", bd)}{chart}</div>
<div class="wsx2"><div class="pn"><h4>Transactions<span style="background:#ee2b2b;color:#fff;font-size:11px;border-radius:5px;padding:3px 9px">Kill All</span></h4><table class="tbl"><tr><th>Reference</th><th>Trade Date</th><th>Security</th><th>Order Type</th><th>Direction</th><th class="num">Amount</th><th class="num">Price</th><th class="num">Market Value</th><th>Account</th><th>Counterparty</th><th>Status</th></tr>{tr}</table></div>
<div class="tick"><b style="font-size:16px">Execution</b><div class="fld" style="color:#6b7686;font-weight:400">Search by ISIN or Ticker</div><div class="fld">EURUSD<small>FUT</small></div><div class="fld"><small>Broker</small>Venue A</div><div class="bs"><div><small>BID</small><b class="up">1.0821 ↑</b></div><div style="text-align:right"><small>ASK</small><b class="dn">↓ 1.0834</b></div></div><div class="bs"><div><small>Order Type</small>MARKET</div><div><small>Time</small>DAY</div></div><div class="qty"><div><small>Quantity</small>0</div><span>EUR</span></div></div></div></div>'''

def phones():
    top = lambda t: f'<div class="top"><span>☰ {t} ⌄</span><i><u></u><u></u></i></div>'
    nb = lambda a: '<div class="nb">' + "".join(f'<span class="{"on" if i == a else ""}">{s}</span>' for i, s in enumerate(["$", "▦", "☰", "↗", "+"])) + '</div>'
    bal = "".join(f'<div class="row"><span>{c}</span><div><i style="width:{w}%;background:{col}"></i></div><span style="text-align:right">{v}<small>{p}</small></span></div>' for c, w, col, v, p in [("USD", 100, "#8a93a5", "$6.1M", "49%"), ("EUR", 64, "#b0bfe0", "$3.2M", "26%"), ("GBP", 38, "#3f4249", "$1.9M", "15%"), ("CHF", 20, "#8d9199", "$0.9M", "7%"), ("AED", 8, "#001a34", "$0.3M", "3%")])
    p1 = f'<div class="ph"><div class="scr">{top("Balances")}<div class="mv">Total: $12.4M</div><div class="bal">{bal}</div><div style="flex:1"></div>{nb(0)}</div></div><span class="pcap">Balances</span>'
    p2 = f'<div class="ph"><div class="scr">{top("Positions")}<div class="mv">Market Value: $184M</div><div class="tm" data-tree></div>{nb(1)}</div></div><span class="pcap">Positions</span>'
    p3 = f'<div class="ph"><div class="scr">{top("Order Entry")}<div class="oe"><div class="fld"><small>Search</small>EURUSD</div><div class="fld"><small>Broker</small>Venue A</div><div class="fld"><small>Order Type</small>MARKET</div><div class="fld"><small>Time</small>DAY</div><div class="fld"><small>Quantity</small>0</div></div><div class="cta2">Buy</div><div style="flex:1"></div>{nb(4)}</div></div><span class="pcap">Order entry</span>'
    return f'<div class="phones"><div>{p1}</div><div>{p2}</div><div>{p3}</div></div>'

def showcase(cls=""):
    return f'''<div data-tabs><div class="tabs" role="tablist" aria-label="Platform views"><button role="tab" aria-selected="true" type="button">Dashboard</button><button role="tab" aria-selected="false" type="button">Workstation</button><button role="tab" aria-selected="false" type="button">Mobile</button></div>
<div class="pane"><div class="scalebox"><div class="scaler">{dash()}</div></div></div><div class="pane" hidden><div class="scalebox"><div class="scaler">{wsx()}</div></div></div><div class="pane" hidden>{phones()}</div></div>
<p class="synth">Illustrative interface. All figures, names and counterparties are synthetic. {T("Replace with approved, masked screens once the new system design lands")}</p>'''

# ---------------------------------------------------------------- pinned route
def pin(extra_h=""):
    return f'''<section class="pin navy" data-pin><div class="stick"><div class="wrap" style="width:100%"><p class="kicker">Direct</p><h2>Every hand-off is a place for things to <span class="hot">go wrong</span>.</h2>
<div class="rt" role="img" aria-label="Route from you to the depository, with and without intermediaries"><div class="rn"><b>YOU</b>You</div><div class="rl"></div><div class="rn mid"><b>SA</b>Settlement agent</div><div class="rl m"></div><div class="rn mid"><b>SC</b>Sub-custodian</div><div class="rl m"></div><div class="rn mid"><b>C</b>Custodian</div><div class="rl m"></div><div class="rn emfi"><b>e</b>EMFI</div><div class="rl hot"></div><div class="rn"><b>CSD</b>Depository</div></div>
<div class="rc"><div><strong data-hops>4</strong><span>hops between you and the depository</span></div><div><strong data-firms>3</strong><span>firms in the chain</span></div></div><div class="cap" data-cap>Conventional route</div>
<p class="fine" style="margin-top:18px">Scroll to remove the hand-offs. Illustrative only: actual routes depend on the market, instrument, counterparty and your service arrangements. Direct does not mean every intermediary is removed.</p></div><div class="prog"><i></i></div></div></section>'''

QUIZ = '''<section class="qz" id="say-less"><div class="wrap"><div class="qbox" data-quiz><div><h2>How does your current set-up<br>measure up<span class="dot">.</span></h2><p class="lead" style="margin-top:22px">Six questions. Three areas to examine: cost, complexity and exposure.</p></div>
<div class="qcard"><div data-body style="display:flex;flex-direction:column;flex:1"><div class="qtop"><span data-g>COST</span><div class="qprog"><span></span></div><span data-c>1 / 6</span></div><fieldset style="border:0;padding:0;margin:0"><legend class="qq" data-q></legend><div class="qopts" data-o></div></fieldset>
<div class="qnav"><button type="button" data-back disabled>Back</button><button type="button" data-next disabled>Next</button></div></div>
<div class="qres" data-res hidden aria-live="polite"><h3 data-rt></h3><div data-scores></div><p class="fine">This questionnaire is an informational discussion aid. It is not a quotation, assessment of suitability, commitment to provide a service or guarantee of savings. Actual fees and service availability depend on client, instrument, account structure and applicable arrangements.</p><div class="qact"><a class="btn pri" href="contact.html">Discuss your result with EMFI</a><button type="button" class="qrestart" data-restart>Start again</button></div></div></div></div></div></section>'''

# ---------------------------------------------------------------- people
TEAM = [("Usman Sheikh", "Founder", "Director, EMFI Fund SPC", None), ("Atif Rashid", "Finance & Compliance", "Board member", "atif-rashid-4"), ("Gustavo Rodrigues", "Onboarding & KYC", "Board member", "gustavo-rodrigues-4"), ("Shamroz Bashir", "Risk & Reporting", "Board member", "shamroz-bashir-4"),
        ("Peter Timson", "Compliance, UK", "", None), ("Hitesh Bilochi", "Compliance, DIFC", "", None), ("Alan Tooker", "Director, EMFI Fund SPC", "A.R.C. Directors Ltd", "local:alan-tooker"), ("Damian Juric", "Director, EMFI Fund SPC", "A.R.C. Directors Ltd", "local:damian-juric"),
        ("Robert Hagon", "Distribution, UK", "", "robert-hagon-4"), ("Mark Cleary", "Distribution, UK", "", "mark-cleary-7"), ("Jose Bermudez", "Distribution, DIFC", "", "jose-bermudez-5"), ("Francesco Odone", "Distribution, DIFC", "", None),
        ("Guillermo Guerrero", "Research", "", "guillermo-guerrero-6"), ("Albani Granado", "Senior Quantitative Analyst", "", None), ("Rosamnis Marcano", "Economics", "", "rosamnis-marcano-5"), ("Matias Montes", "Strategy", "", "matias-montes-10"),
        ("Zee Amin", "Operations", "", "zee-amin-7"), ("Asmita Sojitra", "Business Analyst", "", None), ("Kishan Lashkari", "Information Technology", "", "kishan-lashkari-13"), ("Dinesh Chouhan", "Software Development", "", "dinesh-chouhan-6")]
def person(n, r, b, f, role=None):
    ini = "".join(w[0] for w in n.split()[:2])
    src = "" if not f else (f"assets/img/people/{f[6:]}.jpg" if f.startswith("local:") else f"{PEOPLE}{f}.jpg")
    img = f'<img src="{src}" alt="{n}" loading="lazy" onerror="this.remove()">' if src else ""
    return f'<div class="pp rv"><div class="im"><span>{ini}</span>{img}</div><b>{n}</b><span>{role or r or T("EMFI title to confirm")}</span>{f"<em>{b}</em>" if b else ""}</div>'
def team(names=None):
    return '<div class="team">' + "".join(person(*t) for t in TEAM if names is None or t[0] in names) + '</div>'

RESEARCH = [("Guillermo Guerrero", "Head of Research"), ("Rosamnis Marcano", "Senior Economist"), ("Albani Granado", "Senior Quantitative Analyst"), ("Matias Montes", "Senior Strategist"),
            ("Melissa Evaristo", "Economist"), ("Valeria Garc&eacute;s", "Economist"), ("Andrea Mart&iacute;nez", "Economist"), ("Mohammad Ezzeddine", "Strategist"), ("Jos&eacute; Ara", "Strategist"), ("Diego Campins", "Strategist"), ("Elena S&aacute;nchez", "Quantitative Analyst (Intern)")]

# ---------------------------------------------------------------- fund chart (illustrative placeholder trend; no values)
def fund_points():
    rnd = random.Random(11)
    anchors = [(0, .02), (.001, .30), (.12, .29), (.2, .24), (.3, .16), (.45, .21), (.5, .22), (.505, .39), (.58, .41), (.66, .40), (.7, .33), (.75, .38), (.82, .44), (.88, .50), (.915, .52), (.92, .66), (.95, .74), (.97, .86), (.985, .96), (1, .84)]
    n = 260; pts = []
    for i in range(n):
        t = i / (n - 1)
        for (t0, y0), (t1, y1) in zip(anchors, anchors[1:]):
            if t0 <= t <= t1:
                y = y0 + (y1 - y0) * ((t - t0) / (t1 - t0) if t1 > t0 else 1); break
        pts.append(round(max(0.01, y + rnd.gauss(0, .012)), 4))
    return pts

def dircard(n, r, f, bio, org=" · A.R.C. Directors Ltd"):
    ini = "".join(w[0] for w in n.split()[:2])
    img = f'<img src="assets/img/people/{f[6:]}.jpg" alt="{n}" loading="lazy">' if f else f'<span style="display:grid;place-items:center;height:100%;color:#fff;font:800 56px Inter;letter-spacing:-.04em">{ini}</span>'
    return f'<article class="dir rv"><div class="im">{img}</div><div><h3>{n}</h3><p class="jur" style="margin:8px 0 14px">{r}{org}</p><p>{bio}</p></div></article>'

def fund():
    pts = json.dumps(fund_points())
    mc = '<p class="note"><strong>Past performance is not a reliable indicator of future results.</strong> The value of an investment can fall as well as rise, and you may lose some or all of your capital.</p><p class="note"><strong>Marketing communication.</strong> This page is for professional clients and eligible counterparties. It is not an offer or solicitation, and is not directed at retail clients, US persons or anyone in a jurisdiction where it would be unlawful. Read the fund&rsquo;s offering documents before any investment decision.</p>'
    if PROD:   # no unverified or illustrative performance data on a public production page
        return f'''<div class="fund open pfund"><div class="ft"><div><h3>EMFI Opportunities Fund</h3></div></div><div class="pbox"><h4>Fund information for professional investors</h4><p>Performance, share-class details and offering documents are provided to professional clients and eligible counterparties on request or through the client area.</p><div class="gb"><a class="btn dark" href="contact.html">Request fund information</a><a class="btn ghost" href="https://login.emfi.uk" target="_blank" rel="noopener">Client login</a></div></div>{mc}</div>'''
    return f'''<div class="fund" data-fund data-pts='{pts}'><div class="ft"><div><h3>EMFI Opportunities Fund {T("add share class")}</h3></div><div style="text-align:right"><div class="rng"><button type="button" data-r="1y" aria-pressed="false">1Y</button><button type="button" data-r="3y" aria-pressed="false">3Y</button><button type="button" data-r="all" aria-pressed="true">Since launch</button></div></div></div>
<svg viewBox="0 0 1000 360" role="img" aria-label="Indexed performance trend of the fund since launch, without values"><defs><linearGradient id="fg" x1="0" x2="1"><stop offset="0" stop-color="#3f9fc9"/><stop offset="1" stop-color="#4fc3b0"/></linearGradient><linearGradient id="fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f9fc9" stop-opacity=".22"/><stop offset="1" stop-color="#4fc3b0" stop-opacity="0"/></linearGradient></defs>
<g stroke="#e3eaf4"><path d="M0 14H1000M0 100H1000M0 186H1000M0 272H1000"/></g><path class="ar" fill="url(#fa)"/><path class="ln"/><g class="axl" font-size="12" fill="#56677f"></g><path d="M0 326H1000" stroke="#b9c8dd"/></svg>
<p class="note">Indexed trend, no values shown. Whether returns are net or gross of fees, and the share class, currency, period and as-at date, are set out in the fund documentation. {T("Illustrative placeholder shape, not real performance. Connect the approved feed and state net/gross, share class, currency, period and as-at date before any publication")}</p>{mc}
<div class="gate"><form class="gf" data-gateform novalidate><h4>For professional investors only</h4><p>Fund information is not for retail clients or US persons. Tell us who you are to continue.</p>
<div class="gr2"><label>I am a<select data-gs><option value="">Select</option><option value="pc">Professional client</option><option value="ec">Eligible counterparty</option></select></label><label>I am located in<select data-gc><option value="">Select</option><option>United Kingdom</option><option>United Arab Emirates</option><option>Cayman Islands</option><option value="other">Another country</option><option value="us">United States, or I am a US person</option></select></label></div>
<label class="chk"><input type="checkbox" data-gr> <span>I understand that investments can fall as well as rise, that I may lose capital, and that this is a marketing communication and not an offer.</span></label>
<div class="gb"><button class="btn dark" type="submit">View the chart</button><button class="btn ghost" type="button" data-gno>I am not a professional investor</button></div><p class="gmsg" data-gm role="alert" hidden></p>{T("Counsel to decide whether the chart may be public at all (FSMA s238); safer to place behind client login. Restricted-country list to be set by counsel")}</form></div></div>'''

# ---------------------------------------------------------------- content data
ns = {}
src = open(os.path.join(HERE, "pubs_data.py"), encoding="utf-8").read()
exec(src, ns)
pubs = ns["pubs"]
pj = json.dumps([{"date": d, "country": c, "type": t, "title": ti, "extract": e} for d, c, t, ti, e in pubs])

PROVIDERS = [("EMFI Capital", "Investment manager and AIFM", "confirm against fund documents"), ("Apex", "Fund administration", "confirm appointment"), ("Baker Tilly", "Audit", "confirm scope"), ("Walkers", "Legal counsel (Cayman)", "confirm"), ("Dechert", "Legal counsel", "confirm"), ("Northern Trust", "Role to be confirmed", "do not publish until verified")]

def entity(j, name, rows, extra=""):
    kv = "".join(f"<dt>{a}</dt><dd>{b}</dd>" for a, b in rows)
    return f'<div class="card rv"><p class="jur">{j}</p><h3>{name}</h3><dl class="kv">{kv}</dl>{extra}</div>'
E_SEC = entity("United Kingdom · FCA", "EMFI Securities Limited", [("Company no.", "10447140"), ("FCA reference", f'763979 · <a href="{FCAQ(763979)}" target="_blank" rel="noopener">FCA Register</a>'), ("Office", LON)])
E_CAP = entity("United Kingdom · FCA", "EMFI Capital Limited", [("Company no.", "11380609"), ("FCA reference", f'822389 · <a href="{FCAQ(822389)}" target="_blank" rel="noopener">FCA Register</a>'), ("Client assets", "Held within the FCA&rsquo;s CASS 6 (safe custody assets) and CASS 7 (client money), where applicable")])
E_DIFC = entity("Dubai International Financial Centre · DFSA", "EMFI Capital (DIFC) Limited", [("DFSA reference", f'F011663 · <a href="{DFSA}" target="_blank" rel="noopener">DFSA Register</a>'), ("Licensed", "30 July 2025"), ("Office", DXB), ("Client assets", "Endorsed by the DFSA to hold or control client assets, under the DFSA&rsquo;s own rules, which are separate from UK CASS")], T("DFSA counsel to supply the exact status line, licence category and client-classification wording; confirm permissions against the current DFSA register"))
E_GRP = entity("United Kingdom · Holding company", "EMFI Group Limited", [("Company no.", "11391808"), ("Address", LON + " " + T("confirm this is the registered office"))], '<p class="fine" style="margin-top:12px">Not itself authorised or regulated by the FCA.</p>')

