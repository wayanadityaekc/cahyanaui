#!/usr/bin/env node
// Pages that must still match the original exactly.
//
// The 71 bookable detail pages are excluded. Wayan asked for real changes on
// 3 Sep 2026 - the bottom "Tour Details" / "At a Glance" section removed, a hero
// photo slider, related cards and a review CTA added - so they are deliberately
// no longer identical. Comparing them would turn this gate into noise.
// south-bali-tour is a redirect stub, not a page.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const routes = fs.readFileSync(path.join(ROOT, 'lib/routes.js'), 'utf8');
const list = (name) => {
  const m = routes.match(new RegExp('export const ' + name + ' = \\[([\\s\\S]*?)\\];'));
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
};

const skip = new Set([
  ...list('TOURS').map((s) => `${s}.html`),
  ...list('ATTRACTIONS').map((s) => `attractions/${s}.html`),
  'south-bali-tour.html',
]);

const pages = [
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')),
  ...fs.readdirSync(path.join(ROOT, 'attractions')).map((f) => `attractions/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'guide')).filter((f) => f.endsWith('.html') && f !== '_template.html').map((f) => `guide/${f}`),
].filter((f) => !skip.has(f));

console.log(pages.join(' '));
