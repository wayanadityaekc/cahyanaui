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
