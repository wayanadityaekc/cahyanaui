#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const routes = fs.readFileSync(path.join(ROOT, 'lib/routes.js'), 'utf8');
function list(name) {
  const match = routes.match(new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\];`));
  return match ? [...match[1].matchAll(/'([^']+)'/g)].map((quotedMatch) => quotedMatch[1]) : [];
}

const pages = [
  ...list('TOURS').map((slug) => `${slug}.html`),
  ...list('ATTRACTIONS').map((slug) => `attractions/${slug}.html`),
];

const MUST_HAVE = [
  ['booksidebar', 'booking sidebar card'],
  ['bookcard__cta', 'Book Now CTA'],
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

pages.forEach((page) => {
  const filePath = path.join(ROOT, 'out', page);
  if (!fs.existsSync(filePath)) {
    console.error(`  MISSING BUILD  ${page}`);
    bad++;
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const problems = [];
  MUST_HAVE.forEach(([needle, label]) => {
    if (!html.includes(needle)) problems.push(`missing ${label}`);
  });
  MUST_NOT.forEach(([needle, label]) => {
    if (html.includes(needle)) problems.push(`still has ${label}`);
  });
  if (html.includes('hero-slider__dots')) sliders++;
  if (html.includes('related__title')) related++;
  if (problems.length) {
    console.error(`  ${page}: ${problems.join(', ')}`);
    bad++;
  }
});

console.log(`Detail pages checked : ${pages.length}`);
console.log(`With a hero slider   : ${sliders}`);
console.log(`With related cards   : ${related}`);
console.log(`Failing              : ${bad}`);

if (bad) {
  console.error('\nDETAIL CHECK FAILED');
  process.exit(1);
}
console.log('\nDetail check passed.');
