// tools/tw/remove-fam.mjs — Tailwind migration helper (epic #321).
// Removes CSS rules for a "dead" class family from a stylesheet, comment/string-safe.
// A style rule is dropped when EVERY selector in its list references a class matching
// <deadRegex> (unless it also matches <keepRegex>). Grouped rules keep their live
// selectors. @media/@supports are recursed; emptied media blocks are dropped.
//
// Usage:
//   node tools/tw/remove-fam.mjs <file.css> "<deadRegex>" ["<keepRegex>"]
//
// REGEX GOTCHA: use a negative-lookahead boundary `(?![a-z0-9])`, NOT `\b`.
// `\b` does NOT sit between `q` and `_`, so `\.faq\b` misses `.faq__container`.
// `\.faq(?![a-z0-9])` matches `.faq`, `.faq__x`, `.faq-x` but not a different `.faqx`.
//
// Example (drop the whole .booking/.book-bar/.summary family; grid engine + tokens are
// left alone automatically because they don't match the regex):
//   node tools/tw/remove-fam.mjs style.css "\\.(booking|book-bar|booksidebar|bookcard|summary)(?![a-z0-9])"
//
// keepRegex protects a selector you must NOT drop yet — e.g. a grouped rule that also
// styles content HTML (`.faq__a p` alongside `.subhero__text`). If your component
// already restyles that part via `[&_p]:` utilities, you don't need keepRegex.
//   node tools/tw/remove-fam.mjs style.css "\\.faq(?![a-z0-9])" "\\.faq__a"
//
// ALWAYS: verify computed-style diff = 0 (tools/tw/snap.mjs + diff.mjs) BEFORE running
// this, and re-verify + check `{}` brace balance AFTER. Idempotent — safe to re-run
// after a rebase if a sibling PR already removed part of the family.
import fs from 'node:fs';

const [, , file, deadSrc, keepSrc] = process.argv;
if (!file || !deadSrc) {
  console.error('usage: node tools/tw/remove-fam.mjs <file.css> "<deadRegex>" ["<keepRegex>"]');
  process.exit(2);
}
const DEAD = new RegExp(deadSrc);
const KEEP = keepSrc ? new RegExp(keepSrc) : null;
let css = fs.readFileSync(file, 'utf8');

function selectorIsDead(sel) {
  if (KEEP && KEEP.test(sel)) return false;
  return DEAD.test(sel);
}
function findBrace(s, from) {
  let i = from; const n = s.length;
  while (i < n) { const c = s[i];
    if (c === '/' && s[i + 1] === '*') { const e = s.indexOf('*/', i + 2); i = e === -1 ? n : e + 2; continue; }
    if (c === '"' || c === "'") { let j = i + 1; while (j < n && s[j] !== c) { if (s[j] === '\\') j++; j++; } i = j + 1; continue; }
    if (c === '{') return i; i++;
  }
  return -1;
}
function matchClose(s, open) {
  let depth = 0, i = open; const n = s.length;
  while (i < n) { const c = s[i];
    if (c === '/' && s[i + 1] === '*') { const e = s.indexOf('*/', i + 2); i = e === -1 ? n : e + 2; continue; }
    if (c === '"' || c === "'") { let j = i + 1; while (j < n && s[j] !== c) { if (s[j] === '\\') j++; j++; } i = j + 1; continue; }
    if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) return i; } i++;
  }
  return n - 1;
}
function processBlock(s) {
  let out = ''; let i = 0; const n = s.length;
  while (i < n) {
    const brace = findBrace(s, i);
    if (brace === -1) { out += s.slice(i); break; }
    const prelude = s.slice(i, brace);
    const close = matchClose(s, brace);
    const body = s.slice(brace + 1, close);
    const t = prelude.trim();
    if (/^@media|^@supports/.test(t)) {
      const inner = processBlock(body);
      if (inner.replace(/\/\*[\s\S]*?\*\//g, '').trim() !== '') out += prelude + '{' + inner + '}';
    } else if (/^@/.test(t)) {
      out += prelude + '{' + body + '}';
    } else {
      const clean = prelude.replace(/\/\*[\s\S]*?\*\//g, '');
      const sels = clean.split(',').map((x) => x.replace(/\n/g, ' ').trim()).filter(Boolean);
      const keep = sels.filter((sx) => !selectorIsDead(sx));
      if (keep.length === 0) { /* whole rule dead -> drop */ }
      else if (keep.length === sels.length) out += prelude + '{' + body + '}';
      else {
        const lead = (prelude.match(/^(\s*(?:\/\*[\s\S]*?\*\/\s*)*)/) || [''])[0];
        out += lead + keep.join(',\n') + ' {' + body + '}';
      }
    }
    i = close + 1;
  }
  return out;
}

const before = css.length;
css = processBlock(css);
fs.writeFileSync(file, css);
const o = (css.match(/{/g) || []).length, c = (css.match(/}/g) || []).length;
console.log(`removed from ${file} | chars ${before} -> ${css.length} | braces ${o === c ? 'OK' : `MISMATCH ${o}/${c}`}`);
if (o !== c) process.exit(1);
