#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
const SITEMAP = path.join(__dirname, '..', 'sitemap.xml');

function walk(dir, base = '') {
  let found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '_next') continue;
    const full = path.join(dir, entry.name);
    const url = base + '/' + entry.name;
    if (entry.isDirectory()) found = found.concat(walk(full, url));
    else if (entry.name.endsWith('.html')) found.push(url);
  }
  return found;
}

if (!fs.existsSync(OUT)) {
  console.error('out/ not found - run the build first.');
  process.exit(1);
}

const built = new Set(walk(OUT).map((u) => (u === '/index.html' ? '/' : u)));
const expected = [...fs.readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace('https://cahyanaubudexperience.com', ''),
);

const missing = expected.filter((u) => !built.has(u));

if (missing.length) {
  console.error(`URL CHECK FAILED - ${missing.length} live URL(s) missing from the build:`);
  missing.forEach((u) => console.error('  ' + u));
  process.exit(1);
}

console.log(`URL check passed - all ${expected.length} live URLs present in out/.`);

// Legacy guide pages relied on <base href="/">, which the export does not carry.
// Any relative src/href left in the extracted HTML resolves against /guide/ and
// 404s - it broke 104 images and 319 links before this check existed.
(function checkRelativeUrls() {
  const path = require("path");
  const files = [];
  (function w(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) w(p);
      else if (/\.jsx?$/.test(e.name)) files.push(p);
    }
  })("content");
  const bad = [];
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    for (const m of src.matchAll(/(src|href)=(\\?")([^"\\]+)/g)) {
      const u = m[3];
      if (/^(https?:|\/|#|mailto:|tel:|data:|\{)/.test(u)) continue;
      bad.push(file + "  " + m[1] + '="' + u + '"');
    }
    // Inline styles hide the same problem inside CSS url(), which the attribute
    // scan above cannot see.
    for (const m of src.matchAll(/url\(\s*(\\?['"]?)([^'")\\]+)/g)) {
      const u = m[2];
      if (/^(https?:|\/|#|data:)/.test(u)) continue;
      bad.push(file + "  url(" + u + ")");
    }
  }
  if (bad.length) {
    console.error("\nRELATIVE URLS IN EXTRACTED HTML (must be root-absolute):");
    bad.slice(0, 20).forEach((b) => console.error("  " + b));
    if (bad.length > 20) console.error("  ... and " + (bad.length - 20) + " more");
    process.exitCode = 1;
  } else {
    console.log("Relative URLs in extracted HTML : none");
  }
})();

// A new page that never reaches sitemap.xml is invisible to search, and nothing
// else notices - our-company.html and programs.html both shipped without it.
// Pages marked noindex are meant to be absent, so they are skipped.
(function checkSitemap() {
  const path = require("path");
  const OUT = path.join(__dirname, "..", "out");
  const SITEMAP = path.join(__dirname, "..", "sitemap.xml");
  if (!fs.existsSync(OUT) || !fs.existsSync(SITEMAP)) return;
  const sitemap = fs.readFileSync(SITEMAP, "utf8");
  const pages = [];
  (function w(d, rel) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      // assets/ holds a favicon <head> snippet, not a page
      if (e.name === "_next" || e.name === "assets") continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) w(p, rel + e.name + "/");
      else if (e.name.endsWith(".html")) pages.push(rel + e.name);
    }
  })(OUT, "");
  const missing = [];
  for (const p of pages) {
    if (/^(404|_not-found)\.html$/.test(p)) continue;
    const html = fs.readFileSync(path.join(OUT, p), "utf8");
    if (/name="robots"[^>]*noindex/.test(html)) continue;
    if (p === "index.html") {
      if (!/<loc>https:\/\/cahyanaubudexperience\.com\/<\/loc>/.test(sitemap)) missing.push(p + " (homepage)");
      continue;
    }
    if (!sitemap.includes("/" + p + "<")) missing.push(p);
  }
  if (missing.length) {
    console.error("\nINDEXABLE PAGES MISSING FROM sitemap.xml:");
    missing.forEach((m) => console.error("  " + m));
    process.exitCode = 1;
  } else {
    console.log("Indexable pages missing from sitemap : none");
  }
})();

// Two sitemaps exist: sitemap.xml at the repo root (hand-kept checklist, read by
// the checks above) and out/sitemap.xml (generated from lib/routes.js - the one
// that actually ships). They silently drifted once: the root file dropped the six
// retired legal/about pages while routes.js kept them, so the live sitemap sent
// Google to six redirects. Comparing them makes that impossible to repeat.
(function checkSitemapsAgree() {
  const path = require("path");
  const root = path.join(__dirname, "..", "sitemap.xml");
  const built = path.join(__dirname, "..", "out", "sitemap.xml");
  if (!fs.existsSync(root) || !fs.existsSync(built)) return;
  // Commented-out entries are deliberately-parked URLs (e.g. programs.html), not
  // live ones - strip comments first or they read as present in the checklist.
  const locs = (file) =>
    new Set(
      [
        ...fs
          .readFileSync(file, "utf8")
          .replace(/<!--[\s\S]*?-->/g, "")
          .matchAll(/<loc>([^<]+)<\/loc>/g),
      ].map((m) => m[1].trim()),
    );
  const rootLocs = locs(root);
  const builtLocs = locs(built);
  const onlyBuilt = [...builtLocs].filter((u) => !rootLocs.has(u));
  const onlyRoot = [...rootLocs].filter((u) => !builtLocs.has(u));
  if (onlyBuilt.length || onlyRoot.length) {
    console.error("\nSITEMAP MISMATCH - sitemap.xml and out/sitemap.xml disagree:");
    onlyBuilt.forEach((u) => console.error("  shipped but not in the root checklist: " + u));
    onlyRoot.forEach((u) => console.error("  in the root checklist but not shipped: " + u));
    process.exitCode = 1;
  } else {
    console.log(`Sitemaps agree : ${rootLocs.size} URLs in both`);
  }
})();
