#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
const SITEMAP = path.join(__dirname, '..', 'sitemap.xml');

function walk(dir, base = '') {
  let found = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.name === '_next') return;
    const full = path.join(dir, entry.name);
    const url = `${base}/${entry.name}`;
    if (entry.isDirectory()) found = found.concat(walk(full, url));
    else if (entry.name.endsWith('.html')) found.push(url);
  });
  return found;
}

if (!fs.existsSync(OUT)) {
  console.error('out/ not found - run the build first.');
  process.exit(1);
}

const built = new Set(walk(OUT).map((builtPath) => (builtPath === '/index.html' ? '/' : builtPath)));
const expected = [...fs.readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((locMatch) =>
  locMatch[1].replace('https://cahyanaubudexperience.com', ''),
);

const missing = expected.filter((expectedPath) => !built.has(expectedPath));

if (missing.length) {
  console.error(`URL CHECK FAILED - ${missing.length} live URL(s) missing from the build:`);
  missing.forEach((missingPath) => console.error(`  ${missingPath}`));
  process.exit(1);
}

console.log(`URL check passed - all ${expected.length} live URLs present in out/.`);

(function checkRelativeUrls() {
  const path = require('path');
  const files = [];
  (function walkDirectory(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((event) => {
      const entryPath = path.join(directory, event.name);
      if (event.isDirectory()) walkDirectory(entryPath);
      else if (/\.jsx?$/.test(event.name)) files.push(entryPath);
    });
  })('content');
  const bad = [];
  files.forEach((file) => {
    const src = fs.readFileSync(file, 'utf8');
    [...src.matchAll(/(src|href)=(\\?")([^"\\]+)/g)].forEach((attributeMatch) => {
      const reference = attributeMatch[3];
      if (/^(https?:|\/|#|mailto:|tel:|data:|\{)/.test(reference)) return;
      bad.push(`${file}  ${attributeMatch[1]}="${reference}"`);
    });
    [...src.matchAll(/url\(\s*(\\?['"]?)([^'")\\]+)/g)].forEach((urlMatch) => {
      const reference = urlMatch[2];
      if (/^(https?:|\/|#|data:)/.test(reference)) return;
      bad.push(`${file}  url(${reference})`);
    });
  });
  if (bad.length) {
    console.error('\nRELATIVE URLS IN EXTRACTED HTML (must be root-absolute):');
    bad.slice(0, 20).forEach((badReference) => console.error(`  ${badReference}`));
    if (bad.length > 20) console.error(`  ... and ${bad.length - 20} more`);
    process.exitCode = 1;
  } else {
    console.log('Relative URLs in extracted HTML : none');
  }
})();

(function checkSitemap() {
  const path = require('path');
  const OUT = path.join(__dirname, '..', 'out');
  const SITEMAP = path.join(__dirname, '..', 'sitemap.xml');
  if (!fs.existsSync(OUT) || !fs.existsSync(SITEMAP)) return;
  const sitemap = fs.readFileSync(SITEMAP, 'utf8');
  const pages = [];
  (function walkDirectory(directory, rel) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((event) => {
      if (event.name === '_next' || event.name === 'assets') return;
      const entryPath = path.join(directory, event.name);
      if (event.isDirectory()) walkDirectory(entryPath, `${rel}${event.name}/`);
      else if (event.name.endsWith('.html')) pages.push(rel + event.name);
    });
  })(OUT, '');
  const missing = [];
  pages.forEach((page) => {
    if (/^(404|_not-found)\.html$/.test(page)) return;
    const html = fs.readFileSync(path.join(OUT, page), 'utf8');
    if (/name="robots"[^>]*noindex/.test(html)) return;
    if (page === 'index.html') {
      if (!/<loc>https:\/\/cahyanaubudexperience\.com\/<\/loc>/.test(sitemap)) missing.push(`${page} (homepage)`);
      return;
    }
    if (!sitemap.includes(`/${page}<`)) missing.push(page);
  });
  if (missing.length) {
    console.error('\nINDEXABLE PAGES MISSING FROM sitemap.xml:');
    missing.forEach((missingPath) => console.error(`  ${missingPath}`));
    process.exitCode = 1;
  } else {
    console.log('Indexable pages missing from sitemap : none');
  }
})();

(function checkSitemapsAgree() {
  const path = require('path');
  const root = path.join(__dirname, '..', 'sitemap.xml');
  const built = path.join(__dirname, '..', 'out', 'sitemap.xml');
  if (!fs.existsSync(root) || !fs.existsSync(built)) return;
  function locs(file) {
    return new Set(
      [
        ...fs
          .readFileSync(file, 'utf8')
          .replace(/<!--[\s\S]*?-->/g, '')
          .matchAll(/<loc>([^<]+)<\/loc>/g),
      ].map((locMatch) => locMatch[1].trim()),
    );
  }
  const rootLocs = locs(root);
  const builtLocs = locs(built);
  const onlyBuilt = [...builtLocs].filter((builtLoc) => !rootLocs.has(builtLoc));
  const onlyRoot = [...rootLocs].filter((rootLoc) => !builtLocs.has(rootLoc));
  if (onlyBuilt.length || onlyRoot.length) {
    console.error('\nSITEMAP MISMATCH - sitemap.xml and out/sitemap.xml disagree:');
    onlyBuilt.forEach((loc) => console.error(`  shipped but not in the root checklist: ${loc}`));
    onlyRoot.forEach((loc) => console.error(`  in the root checklist but not shipped: ${loc}`));
    process.exitCode = 1;
  } else {
    console.log(`Sitemaps agree : ${rootLocs.size} URLs in both`);
  }
})();
