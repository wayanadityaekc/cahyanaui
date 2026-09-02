#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SCAN = ['components', 'app', 'state'];
const STYLESHEET = path.join(ROOT, 'style.css');

const ALLOWED = {
  'binfo__note': 'present in partials/search.html, unstyled there too',
  'contact__info': 'present in contact.html, unstyled there too',
  'stop__body': 'present in the attraction pages, unstyled there too',
  'xplore__intro': 'present in index.html, unstyled there too',
  'hsearch__ref': 'present in partials/search.html, unstyled there too',
  'driver-detail__reviews': 'present in about-us.html, unstyled there too',
  'lhero--plain': 'present in about-us.html, unstyled there too',
  'guide-home__slider': 'present in bali-guide.html, unstyled there too',
  'tpick__return-label': 'present in transfer.html, unstyled there too',
  'hs-panel--popup': 'behaviour flag read by JS, never styled',
};

const BEM = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?$/;

const PREFIX = new RegExp(
  '^(rev|stop|hero|navbar|footer|acct|tripbar|modal|booking|contact|faq|guide|experience|price|chcard|chdur|whyus|airport|vpromo|habout|trust|xplore|xtab|xpanel|gsearch|zone|slider|hs|bk|csel|binfo|itn|card|btn|section|info|catsec|driver|tour|charter|map|home|rating|reviews|lhero|lhead|photo|glance|arow|closing|summary|pick|wa)',
);

function walk(dir) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full));
    else if (/\.jsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

function classTokens(source) {
  const found = [];
  for (const m of source.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
    // Drop ${...} interpolations first, or their JS identifiers get read as class names.
    const literal = (m[1] || m[2] || '').replace(/\$\{[^}]*\}/g, ' ');
    for (const raw of literal.split(/\s+/)) {
      const token = raw.replace(/[`'"?:]/g, '').trim();
      if (!token || !BEM.test(token)) continue;
      if (!/__|--/.test(token) && !PREFIX.test(token)) continue;
      found.push(token);
    }
  }
  return found;
}

const css = fs.readFileSync(STYLESHEET, 'utf8');
const styled = (cls) => new RegExp('\\.' + cls.replace(/-/g, '\\-') + '(?![a-zA-Z0-9_-])').test(css);

const used = new Map();
for (const dir of SCAN) {
  for (const file of walk(path.join(ROOT, dir))) {
    for (const cls of classTokens(fs.readFileSync(file, 'utf8'))) {
      if (!used.has(cls)) used.set(cls, new Set());
      used.get(cls).add(path.relative(ROOT, file));
    }
  }
}

const unstyled = [...used].filter(([cls]) => !styled(cls));
const failures = unstyled.filter(([cls]) => !ALLOWED[cls]);
const waived = unstyled.filter(([cls]) => ALLOWED[cls]);

console.log(`Classes used in components : ${used.size}`);
console.log(`Backed by a style.css rule  : ${used.size - unstyled.length}`);
console.log(`Unstyled, explicitly waived : ${waived.length}`);
console.log(`Unstyled, NOT waived        : ${failures.length}`);

if (waived.length) {
  console.log('\nWaived:');
  for (const [cls] of waived.sort()) console.log(`  ${cls.padEnd(22)} ${ALLOWED[cls]}`);
}

const stale = Object.keys(ALLOWED).filter((cls) => !used.has(cls));
if (stale.length) {
  console.log('\nWaivers no longer used (remove them):');
  for (const cls of stale) console.log(`  ${cls}`);
}

if (failures.length) {
  console.error('\nCLASS CHECK FAILED - these have no rule in style.css:');
  for (const [cls, files] of failures.sort()) {
    console.error(`  ${cls.padEnd(24)} ${[...files].join(', ')}`);
  }
  console.error('\nEither the class name is wrong, or it needs a waiver in tools/check-classes.js.');
  process.exit(1);
}

console.log('\nClass check passed.');
