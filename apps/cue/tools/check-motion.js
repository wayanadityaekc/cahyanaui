#!/usr/bin/env node
// Catches transitions that quietly animate nothing.
//
// Tailwind v4 compiles translate-/rotate-/scale- utilities to the STANDALONE
// `translate:` / `rotate:` / `scale:` properties, not to `transform:`. The
// keyword utility knows this - `transition-transform` expands to
// "transform,translate,scale,rotate" - but a hand-written arbitrary value does
// not: `transition-[transform]` is literally just `transform`, so it matches
// nothing and the element teleports instead of animating. There is no error and
// the build passes; the navbar drawer shipped like that and nobody noticed until
// it was measured frame by frame.
//
// Rule 1: an element transitions `transform`, sets translate/rotate/scale, and
//         nothing on it sets `transform` -> dead transition.
// Rule 2: a clickable declares its own transition list without `scale` -> the
//         global press feedback in style.css snaps instead of easing.
//
// Runs over out/, like the other gates. No browser needed.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "out");
if (!fs.existsSync(OUT)) { console.error("out/ missing - run the build first"); process.exit(2); }

// --- helpers ---------------------------------------------------------------

// Splits a class attribute into tokens, keeping [...] arbitrary values intact.
const tokenize = (s) => s.split(/\s+/).filter(Boolean);

// Strips variant prefixes (hover:, group-hover:, max-[992px]: ...) without
// cutting into an arbitrary value, whose brackets may themselves contain ":".
function baseOf(token) {
  let depth = 0, last = -1;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === "[") depth++;
    else if (c === "]") depth--;
    else if (c === ":" && depth === 0) last = i;
  }
  return {
    base: last === -1 ? token : token.slice(last + 1),
    scope: last === -1 ? "" : token.slice(0, last),
  };
}

const inner = (t) => t.slice(t.indexOf("[") + 1, t.lastIndexOf("]"));

// Which CSS property does this utility actually set?
function setsProperty(base) {
  if (/^-?translate(-|$)/.test(base)) return "translate";
  if (/^-?rotate(-|$)/.test(base)) return "rotate";
  if (/^-?scale(-|$)/.test(base)) return "scale";
  if (/^\[transform:/.test(base)) return "transform";
  return null;
}

const KEYWORD_LISTS = {
  "transition": ["all"],
  "transition-all": ["all"],
  "transition-none": [],
  "transition-transform": ["transform", "translate", "scale", "rotate"],
  "transition-colors": ["color", "background-color", "border-color"],
  "transition-opacity": ["opacity"],
  "transition-shadow": ["box-shadow"],
};

// Which properties does this utility say it will transition?
function transitionList(base) {
  if (base in KEYWORD_LISTS) return KEYWORD_LISTS[base];
  if (/^transition-\[/.test(base)) {
    return inner(base).split(",").map((p) => p.trim().split(/[\s_]/)[0]).filter(Boolean);
  }
  if (/^\[transition:/.test(base)) {
    return inner(base).replace(/^transition:/, "").split(",").map((p) => p.trim().split(/[\s_]/)[0]).filter(Boolean);
  }
  return null;
}

// --- scan ------------------------------------------------------------------

const walk = (dir) => {
  const found = [];
  (function w(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === "_next") continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) w(p);
      else if (e.name.endsWith(".html")) found.push(p);
    }
  })(dir);
  return found;
};

const pages = walk(OUT);
const dead = new Map();   // rule 1
const snap = new Map();   // rule 2
let elements = 0;

for (const p of pages) {
  const html = fs.readFileSync(p, "utf8");
  const page = path.relative(OUT, p);
  // Element opening tags, so the tag name can be read alongside the classes.
  for (const m of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)\sclass="([^"]*)"/g)) {
    const [, tag, attrs, cls] = m;
    const tokens = tokenize(cls.replace(/&quot;/g, '"'));
    elements++;

    // Everything is grouped by its variant prefix, because a transition declared
    // under one (max-[992px]:[transition:...]) only governs that scope. An
    // earlier version looked at the unprefixed transition alone and so missed
    // the mobile hero sheet, whose whole animation lives under max-[992px]:.
    // "" is the unprefixed scope, and every scope also inherits from it.
    const setBy = new Map();     // scope -> Set(properties the classes set)
    const transBy = new Map();   // scope -> transition-property list
    for (const t of tokens) {
      const { base, scope } = baseOf(t);
      const prop = setsProperty(base);
      if (prop) {
        if (!setBy.has(scope)) setBy.set(scope, new Set());
        setBy.get(scope).add(prop);
      }
      const list = transitionList(base);
      if (list) transBy.set(scope, list);
    }

    const baseSet = setBy.get("") || new Set();
    const baseTrans = transBy.get("") || null;

    for (const [scope, list] of [["", baseTrans], ...transBy]) {
      if (!list || !list.length) continue;
      if (scope === "motion-reduce") continue;   // deliberately turns motion off
      const trans = list;
      const set = new Set([...baseSet, ...(setBy.get(scope) || [])]);
      const has = (p2) => trans.includes(p2) || trans.includes("all");
      const where = scope ? ` (under ${scope}:)` : "";

      // Rule 1
      const standalone = ["translate", "rotate", "scale"].filter((x) => set.has(x));
      if (trans.includes("transform") && !set.has("transform") && standalone.length) {
        const key = `transition names 'transform'${where} but the element sets ${standalone.join("/")} - name it ${standalone.join(",")} instead`;
        if (!dead.has(key)) dead.set(key, `${page}  <${tag} class="…${cls.slice(0, 90)}…">`);
      }

      // Rule 2 - only meaningful for the unprefixed scope; a responsive override
      // does not change whether the element is a clickable.
      const clickable = tag === "button" || /role="button"/.test(attrs) || (tag === "a" && tokens.includes("rounded-pill"));
      if (!scope && clickable && !has("scale")) {
        const key = `${tag} transitions [${trans.join(",")}] with no 'scale' - the press feedback will snap`;
        if (!snap.has(key)) snap.set(key, `${page}  <${tag} class="…${cls.slice(0, 90)}…">`);
      }
    }
  }
}

console.log(`Pages scanned        : ${pages.length}`);
console.log(`Elements with classes: ${elements}`);
console.log(`Dead transitions     : ${dead.size}`);
console.log(`Snapping clickables  : ${snap.size}`);

if (dead.size || snap.size) {
  for (const [why, where] of dead) console.log(`\n  DEAD  ${why}\n        first seen: ${where}`);
  for (const [why, where] of snap) console.log(`\n  SNAP  ${why}\n        first seen: ${where}`);
  console.log("\nMotion check FAILED.");
  process.exit(1);
}
console.log("\nMotion check passed - every declared transition animates something.");
