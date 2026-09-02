#!/usr/bin/env node
// The 71 bookable detail pages deliberately differ from the originals
// (Wayan, 3 Sep 2026), so the class diff cannot police them. This checks the
// shape they are meant to have instead, so a regression still fails the build.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const routes = fs.readFileSync(path.join(ROOT, 'lib/routes.js'), 'utf8');
const list = (name) => {
  const m = routes.match(new RegExp('export const ' + name + ' = \\[([\\s\\S]*?)\\];'));
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
};

const pages = [
  ...list('TOURS').map((s) => `${s}.html`),
  ...list('ATTRACTIONS').map((s) => `attractions/${s}.html`),
];

const MUST_HAVE = [
  ['booksidebar', 'booking sidebar card'],
  ['booking__btn--alt', 'Add to My Trip button'],
  ['booksidebar__specs', 'spec list'],
  ['tour-layout--book', 'two-column layout'],
  ['review-cta', 'Leave a review band'],
  ['tour-hook', 'facts under the title'],
];
const MUST_NOT = [
  ['section__title">Tour Details', 'the removed bottom Tour Details section'],
  ['section__title">At a Glance', 'the removed bottom At a Glance section'],
];

let bad = 0;
let sliders = 0;
let related = 0;

for (const p of pages) {
  const f = path.join(ROOT, 'out', p);
  if (!fs.existsSync(f)) {
    console.error(`  MISSING BUILD  ${p}`);
    bad++;
    continue;
  }
  const html = fs.readFileSync(f, 'utf8');
  const problems = [];
  for (const [needle, label] of MUST_HAVE) if (!html.includes(needle)) problems.push(`missing ${label}`);
  for (const [needle, label] of MUST_NOT) if (html.includes(needle)) problems.push(`still has ${label}`);
  if (html.includes('hero-slider__dots')) sliders++;
  if (html.includes('related__title')) related++;
  if (problems.length) {
    console.error(`  ${p}: ${problems.join(', ')}`);
    bad++;
  }
}

console.log(`Detail pages checked : ${pages.length}`);
console.log(`With a hero slider   : ${sliders}`);
console.log(`With related cards   : ${related}`);
console.log(`Failing              : ${bad}`);

if (bad) {
  console.error('\nDETAIL CHECK FAILED');
  process.exit(1);
}
console.log('\nDetail check passed.');
