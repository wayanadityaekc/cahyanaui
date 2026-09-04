#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Classes the old site injects with JavaScript at runtime, so they never appear
// in its static HTML. Their absence from the original is expected, not a defect.
const RUNTIME = /^(navbar|footer|acct|tripbar|slider-|itn-|active|inter_|hs-|wa-|card-|binfo|hero__search|hero-sheet|hsearch|placeholder|modal|tour-layout|booksidebar|price-unit|booking|csel-|bk-|rating|rvm-|mtc-|reviews-strip|rev|guide-cat-|gsearch|zone-|chdur|chcard|tpick|charter__|at-|dtf|field|amount|btn-book|summary|itn2|pick-cat|drivers-grid|driver-card|driver-modal|about-gallery|anl|is-sel|is-on|guest-|loadscreen|experience__arrow|experience__footer)/;

// The old site fetches partials into <div id="X-placeholder"> at runtime, so
// their markup is missing from the static HTML while the export renders it
// inline. Expand them first, the way loadPartials() does, or every page that
// injects reviews reads as a diff. book-modal.html itself contains
// #booking-placeholder, so this repeats until nothing is left to expand.
function expandPartials(html) {
  for (let pass = 0; pass < 5; pass++) {
    let changed = false;
    html = html.replace(/<div id="([a-z-]+)-placeholder"[^>]*>\s*<\/div>/g, (m, id) => {
      const p = path.join(ROOT, "partials", id + ".html");
      if (!fs.existsSync(p)) return m;
      changed = true;
      return fs.readFileSync(p, "utf8");
    });
    if (!changed) break;
  }
  return html;
}

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
  const A = classCounts(expandPartials(fs.readFileSync(original, 'utf8')));
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
