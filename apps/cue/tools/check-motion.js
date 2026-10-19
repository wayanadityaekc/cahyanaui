#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "out");
if (!fs.existsSync(OUT)) { console.error("out/ missing - run the build first"); process.exit(2); }


function tokenize(s) { return s.split(/\s+/).filter(Boolean); }

function baseOf(token) {
  let depth = 0, last = -1;
  token.split("").forEach((c, i) => {
    if (c === "[") depth++;
    else if (c === "]") depth--;
    else if (c === ":" && depth === 0) last = i;
  });
  return {
    base: last === -1 ? token : token.slice(last + 1),
    scope: last === -1 ? "" : token.slice(0, last),
  };
}

function inner(t) { return t.slice(t.indexOf("[") + 1, t.lastIndexOf("]")); }

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


function walk(dir) {
  const found = [];
  (function w(d) {
    fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
      if (e.name === "_next") return;
      const p = path.join(d, e.name);
      if (e.isDirectory()) w(p);
      else if (e.name.endsWith(".html")) found.push(p);
    });
  })(dir);
  return found;
}

const pages = walk(OUT);
const dead = new Map();
const snap = new Map();
const cycles = [];
let elements = 0;

fs.readdirSync(OUT).filter((n) => n.endsWith(".css")).map((n) => path.join(OUT, n)).forEach((css) => {
  const text = fs.readFileSync(css, "utf8");
  [...text.matchAll(/(--[\w-]+)\s*:\s*var\(\s*\1\s*[,)]/g)].forEach((m) => {
    cycles.push(`${path.relative(OUT, css)}: ${m[1]} is defined as var(${m[1]}) - it resolves to nothing`);
  });
});

pages.forEach((p) => {
  const html = fs.readFileSync(p, "utf8");
  const page = path.relative(OUT, p);
  [...html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)\sclass="([^"]*)"/g)].forEach((m) => {
    const [, tag, attrs, cls] = m;
    const tokens = tokenize(cls.replace(/&quot;/g, '"'));
    elements++;

    const setBy = new Map();
    const transBy = new Map();
    tokens.forEach((t) => {
      const { base, scope } = baseOf(t);
      const prop = setsProperty(base);
      if (prop) {
        if (!setBy.has(scope)) setBy.set(scope, new Set());
        setBy.get(scope).add(prop);
      }
      const list = transitionList(base);
      if (list) transBy.set(scope, list);
    });

    const baseSet = setBy.get("") || new Set();
    const baseTrans = transBy.get("") || null;

    [["", baseTrans], ...transBy].forEach(([scope, list]) => {
      if (!list || !list.length) return;
      if (scope === "motion-reduce") return;
      const trans = list;
      const set = new Set([...baseSet, ...(setBy.get(scope) || [])]);
      function has(p2) { return trans.includes(p2) || trans.includes("all"); }
      const where = scope ? ` (under ${scope}:)` : "";

      const standalone = ["translate", "rotate", "scale"].filter((x) => set.has(x));
      if (trans.includes("transform") && !set.has("transform") && standalone.length) {
        const key = `transition names 'transform'${where} but the element sets ${standalone.join("/")} - name it ${standalone.join(",")} instead`;
        if (!dead.has(key)) dead.set(key, `${page}  <${tag} class="…${cls.slice(0, 90)}…">`);
      }

      const clickable = tag === "button" || /role="button"/.test(attrs) || (tag === "a" && tokens.includes("rounded-pill"));
      if (!scope && clickable && !has("scale")) {
        const key = `${tag} transitions [${trans.join(",")}] with no 'scale' - the press feedback will snap`;
        if (!snap.has(key)) snap.set(key, `${page}  <${tag} class="…${cls.slice(0, 90)}…">`);
      }
    });
  });
});

console.log(`Pages scanned        : ${pages.length}`);
console.log(`Elements with classes: ${elements}`);
console.log(`Dead transitions     : ${dead.size}`);
console.log(`Snapping clickables  : ${snap.size}`);
console.log(`Self-referencing vars: ${cycles.length}`);

if (dead.size || snap.size || cycles.length) {
  [...dead].forEach(([why, where]) => { console.log(`\n  DEAD  ${why}\n        first seen: ${where}`); });
  [...snap].forEach(([why, where]) => { console.log(`\n  SNAP  ${why}\n        first seen: ${where}`); });
  cycles.forEach((c) => { console.log(`\n  CYCLE ${c}`); });
  console.log("\nMotion check FAILED.");
  process.exit(1);
}
console.log("\nMotion check passed - every declared transition animates something.");
