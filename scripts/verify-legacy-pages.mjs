import assert from "node:assert/strict";

// Run against a production server: node scripts/verify-legacy-pages.mjs [base URL]
const base = new URL(process.argv[2] ?? "http://localhost:3130");
const pairs = [
  ["/", "/home-old", "One Connection."],
  ["/services", "/services-old", "Everything connected. Nothing unnecessary."],
  ["/services/research-execution", "/services/research-execution-old", "Decision support, not a country catalogue."],
  ["/why-emfi", "/why-emfi-old", "The authorities that authorise"],
  ["/about", "/about-old", "The evolution of the platform."],
  ["/contact", "/contact-old", "Institutional enquiry"],
];

async function read(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30_000) });
  assert.equal(response.status, 200, `${path}: HTTP status`);
  return response.text();
}

const footerOf = (html) => html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
const homepage = await read("/");
const sharedFooter = footerOf(homepage);
assert.ok(sharedFooter, "Homepage footer is present");

for (const [current, old, originalContent] of pairs) {
  for (const path of [current, old]) {
    const html = path === "/" ? homepage : await read(path);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one main heading`);
    assert.equal(footerOf(html), sharedFooter, `${path}: same homepage footer`);
    const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
    assert.ok(header, `${path}: shared header`);
    for (const href of ["/services", "/why-emfi", "/about", "/contact"]) {
      assert.ok(header.includes(`href="${href}"`), `${path}: navigation to ${href}`);
    }
    assert.ok(!header.includes('href="/trust"'), `${path}: no Trust navbar link`);
    const robots = html.match(/<meta name="robots" content="([^"]*)"/g)?.join(" ") ?? "";
    assert.equal(robots.includes("noindex"), path === old, `${path}: indexing metadata`);
    if (path === old) assert.ok(html.includes(originalContent), `${path}: original design content`);
  }
  console.log(`OK ${current} and ${old}`);
}

const sitemap = await read("/sitemap.xml");
for (const [, old] of pairs) assert.ok(!sitemap.includes(old), `${old}: excluded from sitemap`);
const trust = await fetch(new URL("/trust", base), { redirect: "manual" });
assert.equal(trust.status, 308, "Trust uses a permanent redirect");
assert.equal(new URL(trust.headers.get("location"), base).pathname, "/why-emfi");
console.log("OK sitemap and Trust redirect");
