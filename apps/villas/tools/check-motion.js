#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'out');
if (!fs.existsSync(OUT)) {
  console.error('out/ missing - run the build first');
  process.exit(2);
}

function listTokenSources() {
  const vendored = path.join(ROOT, 'packages/ui/src/tokens/tokens.css');
  const monorepo = path.join(ROOT, '../../packages/ui/src/tokens/tokens.css');
  return [path.join(ROOT, 'app/globals.css'), fs.existsSync(vendored) ? vendored : monorepo].filter((file) =>
    fs.existsSync(file),
  );
}

const SENTINEL_TOKEN = '--color-cta';

function walk(dir, test, skipNext) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return skipNext && entry.name === '_next' ? [] : walk(full, test, skipNext);
    return test(entry.name) ? [full] : [];
  });
}

function splitClassTokens(classes) {
  return classes.split(/\s+/).filter(Boolean);
}

function extractBaseClass(token) {
  let depth = 0;
  let last = -1;
  token.split('').forEach((ch, index) => {
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    else if (ch === ':' && depth === 0) last = index;
  });
  return {
    base: last === -1 ? token : token.slice(last + 1),
    scope: last === -1 ? '' : token.slice(0, last),
  };
}

function extractBracketContent(token) {
  return token.slice(token.indexOf('[') + 1, token.lastIndexOf(']'));
}

function findSetProperty(base) {
  if (/^-?translate(-|$)/.test(base)) return 'translate';
  if (/^-?rotate(-|$)/.test(base)) return 'rotate';
  if (/^-?scale(-|$)/.test(base)) return 'scale';
  if (/^\[transform:/.test(base)) return 'transform';
  return null;
}

const KEYWORD_LISTS = {
  transition: ['all'],
  'transition-all': ['all'],
  'transition-none': [],
  'transition-transform': ['transform', 'translate', 'scale', 'rotate'],
  'transition-colors': ['color', 'background-color', 'border-color'],
  'transition-opacity': ['opacity'],
  'transition-shadow': ['box-shadow'],
};

function listTransitionProperties(base) {
  if (base in KEYWORD_LISTS) return KEYWORD_LISTS[base];
  if (/^transition-\[/.test(base)) {
    return extractBracketContent(base)
      .split(',')
      .map((prop) => prop.trim().split(/[\s_]/)[0])
      .filter(Boolean);
  }
  if (/^\[transition:/.test(base)) {
    return extractBracketContent(base)
      .replace(/^transition:/, '')
      .split(',')
      .map((prop) => prop.trim().split(/[\s_]/)[0])
      .filter(Boolean);
  }
  return null;
}

const pages = walk(OUT, (name) => name.endsWith('.html'), true);
const stylesheets = [...walk(OUT, (name) => name.endsWith('.css'), false), ...listTokenSources()];
const dead = new Map();
const snap = new Map();
const cycles = [];
let elements = 0;
let tokenDefinitions = 0;
let sentinelSeen = false;

stylesheets.forEach((css) => {
  const text = fs.readFileSync(css, 'utf8');
  const label = path.relative(ROOT, css);
  tokenDefinitions += [...text.matchAll(/(^|[;{\s])--[\w-]+\s*:/g)].length;
  if (new RegExp(`${SENTINEL_TOKEN}\\s*:`).test(text)) sentinelSeen = true;
  [...text.matchAll(/(--[\w-]+)\s*:\s*var\(\s*\1\s*[,)]/g)].forEach((match) => {
    cycles.push(`${label}: ${match[1]} is defined as var(${match[1]}) - it resolves to nothing`);
  });
});

pages.forEach((file) => {
  const html = fs.readFileSync(file, 'utf8');
  const page = path.relative(OUT, file);
  [...html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)\sclass="([^"]*)"/g)].forEach((match) => {
    const [, tag, attrs, cls] = match;
    const tokens = splitClassTokens(cls.replace(/&quot;/g, '"'));
    elements++;

    const setBy = new Map();
    const transBy = new Map();
    tokens.forEach((token) => {
      const { base, scope } = extractBaseClass(token);
      const prop = findSetProperty(base);
      if (prop) {
        if (!setBy.has(scope)) setBy.set(scope, new Set());
        setBy.get(scope).add(prop);
      }
      const list = listTransitionProperties(base);
      if (list) transBy.set(scope, list);
    });

    const baseSet = setBy.get('') || new Set();
    const baseTrans = transBy.get('') || null;

    [['', baseTrans], ...transBy].forEach(([scope, list]) => {
      if (!list || !list.length) return;
      if (scope === 'motion-reduce') return;
      const set = new Set([...baseSet, ...(setBy.get(scope) || [])]);
      function has(prop) {
        return list.includes(prop) || list.includes('all');
      }
      const where = scope ? ` (under ${scope}:)` : '';

      const standaloneTransforms = ['translate', 'rotate', 'scale'].filter((prop) => set.has(prop) && !has(prop));
      if (list.includes('transform') && !set.has('transform') && standaloneTransforms.length) {
        const key = `transition names 'transform'${where} but the element sets ${standaloneTransforms.join('/')} - name it ${standaloneTransforms.join(',')} instead`;
        if (!dead.has(key)) dead.set(key, `${page}  <${tag} class="…${cls.slice(0, 90)}…">`);
      }

      const isClickable =
        tag === 'button' || /role="button"/.test(attrs) || (tag === 'a' && tokens.includes('rounded-pill'));
      if (!scope && isClickable && !has('scale')) {
        const key = `${tag} transitions [${list.join(',')}] with no 'scale' - the press feedback will snap`;
        if (!snap.has(key)) snap.set(key, `${page}  <${tag} class="…${cls.slice(0, 90)}…">`);
      }
    });
  });
});

console.log(`Pages scanned        : ${pages.length}`);
console.log(`Elements with classes: ${elements}`);
console.log(`Stylesheets scanned  : ${stylesheets.length} (${tokenDefinitions} custom property definitions)`);
console.log(`Dead transitions     : ${dead.size}`);
console.log(`Snapping clickables  : ${snap.size}`);
console.log(`Self-referencing vars: ${cycles.length}`);

const blindSpots = [];
if (!pages.length || !elements) blindSpots.push('no pages or no classed elements found in out/');
if (!sentinelSeen)
  blindSpots.push(`no scanned stylesheet defines ${SENTINEL_TOKEN} - rule 3 is not reading the token files`);
if (blindSpots.length) {
  blindSpots.forEach((why) => {
    console.log(`\n  BLIND ${why}`);
  });
  console.log('\nMotion check FAILED - it scanned nothing.');
  process.exit(1);
}

if (dead.size || snap.size || cycles.length) {
  [...dead].forEach(([why, where]) => {
    console.log(`\n  DEAD  ${why}\n        first seen: ${where}`);
  });
  [...snap].forEach(([why, where]) => {
    console.log(`\n  SNAP  ${why}\n        first seen: ${where}`);
  });
  cycles.forEach((cycle) => {
    console.log(`\n  CYCLE ${cycle}`);
  });
  console.log('\nMotion check FAILED.');
  process.exit(1);
}
console.log('\nMotion check passed - every declared transition animates something.');
