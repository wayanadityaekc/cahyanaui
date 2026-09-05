#!/usr/bin/env node
// The extracted content/ is a snapshot of the legacy HTML. When main changes a
// price, image or paragraph, that snapshot silently goes stale and the build
// still passes every other gate. This checks each extracted string is still
// present somewhere in the legacy HTML it came from.
const fs = require("fs");
const path = require("path");

const ENT = { amp: "&", ndash: "-", mdash: "-", nbsp: " ", quot: '"', apos: "'", "#39": "'", rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"', hellip: "...", rarr: "->", times: "x", middot: "·", deg: "°" };
const decode = (s) => s.replace(/&(#?\w+);/g, (m, k) => (k in ENT ? ENT[k] : m));
const norm = (s) => decode(String(s)).replace(/\s+/g, " ").replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim();

const htmlFiles = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (["node_modules", ".next", "out", ".git", "docs"].includes(f.name)) continue;
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith(".html")) htmlFiles.push(p);
  }
})(".");

const HAY = norm(htmlFiles.map((f) => fs.readFileSync(f, "utf8")).join("\n"));
const JS = norm(fs.readFileSync("script.js", "utf8") + fs.readFileSync("data.js", "utf8"));

const contentFiles = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith(".js")) contentFiles.push(p);
  }
})("content");

const CHECK = ["desc", "priceFallback", "img", "meta", "name", "alt", "title", "sub", "lead", "tag"];
// Migration-era UI copy with no legacy counterpart to match against: the
// "See All Programs" entry point added to the home search dropdown (a new
// page). Intentional new labels, not stale/invented content - same reasoning
// as the SKIP_PARENT waiver for heroSlides below.
// "Ubud Highlights..." is the homepage card label Wayan chose for the Ubud Tour
// card (the tour itself is unchanged - pricing key stays "Ubud Tour").
const INTENTIONAL = new Set([
  "All Programs",
  "Browse everything in one place",
  "Ubud Highlights: Rice Terrace & Monkey Forest",
].map(norm));
const stale = [];
let checked = 0;

for (const file of contentFiles) {
  const mod = require(path.resolve(file));
  const seen = new Set();
  // heroSlides is a migration-era addition (the per-program hero slider Wayan
  // asked for); its captions have no legacy counterpart to match against.
  const SKIP_PARENT = new Set(["heroSlides"]);
  (function scan(v, parent) {
    if (Array.isArray(v)) return v.forEach((x) => scan(x, parent));
    if (v && typeof v === "object") {
      if (SKIP_PARENT.has(parent)) return;
      for (const [k, val] of Object.entries(v)) {
        if (typeof val === "string" && CHECK.includes(k) && val.length > 8) {
          const n = norm(val);
          if (seen.has(n)) continue;
          seen.add(n);
          checked++;
          if (INTENTIONAL.has(n)) continue;
          if (!HAY.includes(n) && !JS.includes(n)) stale.push(`${file}  ${k}: ${val.slice(0, 90)}`);
        } else scan(val, k);
      }
      return;
    }
  })(mod);
}

// A priceName with no matching data-price in the legacy HTML means a price was
// invented for a card that never had one - how eight destination cards ended up
// showing a fabricated $45.
const legacyPrices = new Set();
const legacyFallback = new Map();
for (const f of htmlFiles) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/data-price="([^"]*)"/g)) legacyPrices.add(decode(m[1]));
  for (const m of src.matchAll(/<span[^>]*data-price="([^"]*)"[^>]*>([^<]*)<\/span\s*>/g)) legacyFallback.set(decode(m[1]), m[2].trim());
}
for (const m of fs.readFileSync("script.js", "utf8").matchAll(/data-price=\\?"([^"\\]*)/g)) legacyPrices.add(decode(m[1]));
for (const file of contentFiles) {
  for (const m of fs.readFileSync(file, "utf8").matchAll(/"priceName": "([^"]+)"/g)) {
    checked++;
    if (!legacyPrices.has(m[1])) stale.push(`${file}  priceName with no legacy data-price: ${m[1]}`);
  }
  // The fallback is what a visitor reads before the live price arrives, so a
  // stale one briefly shows an old price. It has to equal the legacy span.
  for (const m of fs.readFileSync(file, "utf8").matchAll(/"priceName": "([^"]+)",\s*\n\s*"priceFallback": "([^"]*)"/g)) {
    checked++;
    const want = legacyFallback.get(m[1]);
    if (want !== undefined && want !== m[2]) stale.push(`${file}  priceFallback for ${m[1]}: has ${m[2]}, legacy says ${want}`);
  }
}

console.log(`Strings checked : ${checked}`);
console.log(`Not found in legacy source : ${stale.length}`);
if (stale.length) {
  console.error("\nSTALE OR INVENTED CONTENT:");
  stale.slice(0, 40).forEach((s) => console.error("  " + s));
  if (stale.length > 40) console.error(`  ... and ${stale.length - 40} more`);
  process.exit(1);
}
console.log("\nContent matches the legacy source.");
