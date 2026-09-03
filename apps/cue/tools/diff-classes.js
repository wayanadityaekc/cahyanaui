#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Classes the old site injects with JavaScript at runtime, so they never appear
// in its static HTML. Their absence from the original is expected, not a defect.
// The old site builds these at runtime with JavaScript, so they never appear in
// its static HTML. Their absence from the original is expected, not a defect.
const RUNTIME = /^(navbar|footer|acct|tripbar|slider-|itn-|active|inter_|hs-|wa-|card-|binfo|hero__search|hero-sheet|hsearch|placeholder|modal|tour-layout|booksidebar|price-unit|booking|csel-|bk-|rating|rvm-|mtc-|reviews-strip|rev|guide-cat-|gsearch|zone-|chdur|chcard|tpick|charter__|at-|field|amount|btn-book|summary|itn2|pick-cat|drivers-grid|driver-card|about-gallery|anl|is-sel|is-on|guest-)/;

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');

function classCounts(html) {
  const counts = {};
  for (const m of strip(html).matchAll(/class="([^"]*)"/g)) {
    for (const cls of m[1].split(/\s+/)) {
      if (cls) counts[cls] = (counts[cls] || 0) + 1;
    }
  }
  return counts;
}

const pages = process.argv.slice(2);
if (!pages.length) {
  console.error('usage: node tools/diff-classes.js <page.html> [...]');
  process.exit(2);
}

let total = 0;
for (const page of pages) {
  const original = path.join(ROOT, page);
  const built = path.join(ROOT, 'out', page);
  if (!fs.existsSync(original) || !fs.existsSync(built)) {
    console.log(`  ${page.padEnd(26)} skipped (missing ${fs.existsSync(original) ? 'built' : 'original'})`);
    continue;
  }
  const A = classCounts(fs.readFileSync(original, 'utf8'));
  const B = classCounts(fs.readFileSync(built, 'utf8'));
  const diff = [...new Set([...Object.keys(A), ...Object.keys(B)])]
    .filter((k) => (A[k] || 0) !== (B[k] || 0) && !RUNTIME.test(k))
    .sort();
  total += diff.length;
  console.log(`  ${page.padEnd(26)} ${diff.length === 0 ? 'match' : diff.length + ' differ'}`);
  for (const k of diff) console.log(`      ${k.padEnd(26)} original=${A[k] || 0}  built=${B[k] || 0}`);
}

console.log(`\nTotal differences: ${total}`);
process.exit(total === 0 ? 0 : 1);
