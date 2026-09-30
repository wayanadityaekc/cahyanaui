#!/usr/bin/env node
// GATE (ported from CUE): transitions that quietly animate nothing. Runs over out/, no browser.
// Tailwind v4 compiles translate-/rotate-/scale- to the standalone `translate:`/`rotate:`/`scale:` properties, so `transition-[transform]` matches nothing and the element jumps.
// Rule 1 DEAD : an element transitions `transform`, sets translate/rotate/scale, and nothing on it sets `transform`.
// Rule 2 SNAP : a clickable declares its own transition list without `scale`, so the global press feedback in app/globals.css snaps.
// Rule 3 CYCLE: a custom property defined as itself (--x: var(--x)) resolves to nothing and every shorthand using it collapses to `all 0s`.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'out');
if (!fs.existsSync(OUT)) { console.error('out/ missing - run the build first'); process.exit(2); }

// Token source files: the build inlines them, but reading them too means a cycle the minifier happened to drop still fails.
function tokenSources() {
  const vendored = path.join(ROOT, 'packages/ui/src/tokens/tokens.css');
  const monorepo = path.join(ROOT, '../../packages/ui/src/tokens/tokens.css');
  return [path.join(ROOT, 'app/globals.css'), fs.existsSync(vendored) ? vendored : monorepo].filter((file) => fs.existsSync(file));
}

// A token every page depends on: if no scanned stylesheet defines it, rule 3 is reading the wrong files.
const SENTINEL_TOKEN = '--color-cta';

function walk(dir, test, skipNext) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return skipNext && entry.name === '_next' ? [] : walk(full, test, skipNext);
    return test(entry.name) ? [full] : [];
  });
}

function tokenize(classes) { return classes.split(/\s+/).filter(Boolean); }

// Strips variant prefixes without cutting into an arbitrary value, whose brackets may contain ":".
function baseOf(token) {
  let depth = 0;
  let last = -1;
  token.split('').forEach((ch, i) => {
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    else if (ch === ':' && depth === 0) last = i;
  });
  return {
    base: last === -1 ? token : token.slice(last + 1),
    scope: last === -1 ? '' : token.slice(0, last),
  };
}

function inner(token) { return token.slice(token.indexOf('[') + 1, token.lastIndexOf(']')); }

// Which CSS property does this utility actually set?
function setsProperty(base) {
  if (/^-?translate(-|$)/.test(base)) return 'translate';
  if (/^-?rotate(-|$)/.test(base)) return 'rotate';
  if (/^-?scale(-|$)/.test(base)) return 'scale';
  if (/^\[transform:/.test(base)) return 'transform';
  return null;
}

const KEYWORD_LISTS = {
  'transition': ['all'],
  'transition-all': ['all'],
  'transition-none': [],
  'transition-transform': ['transform', 'translate', 'scale', 'rotate'],
  'transition-colors': ['color', 'background-color', 'border-color'],
  'transition-opacity': ['opacity'],
  'transition-shadow': ['box-shadow'],
};

// Which properties does this utility say it will transition?
function transitionList(base) {
  if (base in KEYWORD_LISTS) return KEYWORD_LISTS[base];
  if (/^transition-\[/.test(base)) {
    return inner(base).split(',').map((prop) => prop.trim().split(/[\s_]/)[0]).filter(Boolean);
  }
  if (/^\[transition:/.test(base)) {
    return inner(base).replace(/^transition:/, '').split(',').map((prop) => prop.trim().split(/[\s_]/)[0]).filter(Boolean);
  }
  return null;
}

const pages = walk(OUT, (name) => name.endsWith('.html'), true);
const stylesheets = [...walk(OUT, (name) => name.endsWith('.css'), false), ...tokenSources()];
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
    const tokens = tokenize(cls.replace(/&quot;/g, '"'));
    elements++;

    // Grouped by variant prefix: a transition under max-[992px]: only governs that scope; "" is unprefixed and every scope inherits it.
    const setBy = new Map();
    const transBy = new Map();
    tokens.forEach((token) => {
      const { base, scope } = baseOf(token);
      const prop = setsProperty(base);
      if (prop) {
        if (!setBy.has(scope)) setBy.set(scope, new Set());
        setBy.get(scope).add(prop);
      }
      const list = transitionList(base);
      if (list) transBy.set(scope, list);
    });

    const baseSet = setBy.get('') || new Set();
    const baseTrans = transBy.get('') || null;

    [['', baseTrans], ...transBy].forEach(([scope, list]) => {
      if (!list || !list.length) return;
      if (scope === 'motion-reduce') return;
      const set = new Set([...baseSet, ...(setBy.get(scope) || [])]);
      function has(prop) { return list.includes(prop) || list.includes('all'); }
      const where = scope ? ` (under ${scope}:)` : '';

      // Only the standalone properties the list does NOT name: the keyword transition-transform already names all three.
      const standalone = ['translate', 'rotate', 'scale'].filter((prop) => set.has(prop) && !has(prop));
      if (list.includes('transform') && !set.has('transform') && standalone.length) {
        const key = `transition names 'transform'${where} but the element sets ${standalone.join('/')} - name it ${standalone.join(',')} instead`;
        if (!dead.has(key)) dead.set(key, `${page}  <${tag} class="…${cls.slice(0, 90)}…">`);
      }

      // Rule 2 only for the unprefixed scope: a responsive override does not change whether the element is a clickable.
      const clickable = tag === 'button' || /role="button"/.test(attrs) || (tag === 'a' && tokens.includes('rounded-pill'));
      if (!scope && clickable && !has('scale')) {
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

const blind = [];
if (!pages.length || !elements) blind.push('no pages or no classed elements found in out/');
if (!sentinelSeen) blind.push(`no scanned stylesheet defines ${SENTINEL_TOKEN} - rule 3 is not reading the token files`);
if (blind.length) {
  blind.forEach((why) => { console.log(`\n  BLIND ${why}`); });
  console.log('\nMotion check FAILED - it scanned nothing.');
  process.exit(1);
}

if (dead.size || snap.size || cycles.length) {
  [...dead].forEach(([why, where]) => { console.log(`\n  DEAD  ${why}\n        first seen: ${where}`); });
  [...snap].forEach(([why, where]) => { console.log(`\n  SNAP  ${why}\n        first seen: ${where}`); });
  cycles.forEach((cycle) => { console.log(`\n  CYCLE ${cycle}`); });
  console.log('\nMotion check FAILED.');
  process.exit(1);
}
console.log('\nMotion check passed - every declared transition animates something.');
