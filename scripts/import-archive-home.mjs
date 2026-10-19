import { readFile, writeFile, mkdir } from "node:fs/promises";

// Keep the supplied artifact intact; only adapt its navigation for this site.
const source = await readFile(new URL("../docs/reference/archive-10/index.html", import.meta.url), "utf8");
const templatePattern = /(<script[^>]*type="__bundler\/template"[^>]*>)([\s\S]*?)(<\/script>)/;
const match = source.match(templatePattern);
if (!match) throw new Error("Archive 10 template is missing");
let template = JSON.parse(match[2]);
template = template.replaceAll("https://emfi.uk/english/services", "/services");
// Match the site's existing menu: Services, Why EMFI, About, Contact.
template = template.replace(/<a\b[^>]*>Trust<\/a>/g, "");
for (const [label, href] of [["Why EMFI", "/why-emfi"], ["About", "/about"]]) {
  template = template.replace(new RegExp(`(<a\\b[^>]*href=")#("[^>]*>${label}<\\/a>)`, "g"), `$1${href}$2`);
}
// Use the same footer data and styles as every application page.
const footer = JSON.parse(await readFile(new URL("../src/content/site-footer.json", import.meta.url), "utf8"));
const footerCss = await readFile(new URL("../src/styles/site-footer.css", import.meta.url), "utf8");
const originalFooter = template.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
if (!originalFooter) throw new Error("Archive footer is missing");
const logoData = originalFooter.match(/src="data:image\/svg\+xml;base64,([^"]+)"/)?.[1];
if (!logoData) throw new Error("Archive footer logo is missing");
await mkdir(new URL("../public/brand/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/brand/archive-footer-logo.svg", import.meta.url), Buffer.from(logoData, "base64").toString("utf8").replaceAll("\r\n", "\n"));
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const navigation = JSON.parse(await readFile(new URL("../src/content/site-navigation.json", import.meta.url), "utf8"));
const headerCss = await readFile(new URL("../src/styles/site-header.css", import.meta.url), "utf8");
const loginMark = `<svg sc-camel-view-box="0 0 145 145" class="emfi-client-icon" aria-hidden="true" focusable="false"><path d="${escape(navigation.markPath)}" fill="currentColor"></path></svg>`;
const links = (mobile = false) => navigation.links.map((link) => `<a href="${escape(link.href)}"${mobile ? ' sc-camel-on-click="{{ closeMenu }}"' : ""}>${escape(link.label)}</a>`).join("");
const sharedHeader = `<header class="emfi-site-header"><div class="emfi-header-inner"><a href="/" aria-label="EMFI home" class="emfi-header-home"><img src="/brand/archive-footer-logo.svg" alt="EMFI" width="140" height="56" class="emfi-header-logo"></a><sc-if value="{{ wide }}" hint-placeholder-val="{{ true }}"><nav aria-label="Main navigation" class="emfi-header-nav">${links()}</nav><div class="emfi-login-slot"><a href="${escape(navigation.loginHref)}" class="emfi-client-login" aria-label="Client Login">${loginMark}<span class="emfi-client-label">Client Login</span></a></div></sc-if><sc-if value="{{ compact }}" hint-placeholder-val="{{ false }}"><button type="button" class="emfi-menu-toggle" sc-camel-on-click="{{ toggleMenu }}" aria-expanded="{{ menuOpen }}" aria-controls="emfi-mobile-navigation">{{ menuLabel }}</button></sc-if></div><sc-if value="{{ showMobileMenu }}" hint-placeholder-val="{{ false }}"><nav id="emfi-mobile-navigation" aria-label="Mobile navigation" class="emfi-mobile-nav">${links(true)}<a href="${escape(navigation.loginHref)}" class="emfi-client-mobile" aria-label="Client Login">${loginMark}<span>Client Login</span></a></nav></sc-if></header>`;
if (!/<header\b[\s\S]*?<\/header>/.test(template)) throw new Error("Archive header is missing");
template = template.replace(/<header\b[\s\S]*?<\/header>/, () => sharedHeader);
template = template.replace("</head>", () => `<style id="emfi-shared-header">${headerCss}</style></head>`);
const offices = footer.offices.map((office) => `<address class="emfi-footer-office"><h2>${escape(office.city)}</h2><p>${office.lines.map((line) => `<span>${escape(line)}</span>`).join("")}</p><a href="mailto:${escape(office.email)}">${escape(office.email)}</a></address>`).join("");
const sharedFooter = `<footer class="emfi-site-footer"><div class="emfi-footer-inner"><div class="emfi-footer-brand"><a href="/" aria-label="EMFI home"><img src="/brand/archive-footer-logo.svg" alt="EMFI" width="160" height="64" class="emfi-footer-logo"></a></div><div class="emfi-footer-offices">${offices}</div><p class="emfi-footer-legal">${escape(footer.legal)}</p></div></footer>`;
template = template.replace(originalFooter, () => sharedFooter);
template = template.replace("</head>", () => `<style id="emfi-shared-footer">${footerCss}</style></head>`);
// JSON is embedded in a script element, so preserve HTML-safe closing tags.
const serialized = JSON.stringify(template).replaceAll("</", "<\\/");
let output = source.slice(0, match.index) + match[1] + serialized + match[3] + source.slice(match.index + match[0].length);
output = output.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">');
await mkdir(new URL("../public/archive-home/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/archive-home/index.html", import.meta.url), output);
console.log("Imported Archive 10 homepage with local navigation.");
