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
    const t = prelude.replace(/^\s*(?:\/\*[\s\S]*?\*\/\s*)*/, '').trim();
    if (/^@media|^@supports/.test(t)) {
      const inner = processBlock(body);
      if (inner.replace(/\/\*[\s\S]*?\*\//g, '').trim() !== '') out += `${prelude}{${inner}}`;
    } else if (/^@/.test(t)) {
      out += `${prelude}{${body}}`;
    } else {
      const clean = prelude.replace(/\/\*[\s\S]*?\*\//g, '');
      const sels = clean.split(',').map((x) => x.replace(/\n/g, ' ').trim()).filter(Boolean);
      const keep = sels.filter((sx) => !selectorIsDead(sx));
      if (keep.length === 0) {   }
      else if (keep.length === sels.length) out += `${prelude}{${body}}`;
      else {
        const lead = (prelude.match(/^(\s*(?:\/\*[\s\S]*?\*\/\s*)*)/) || [''])[0];
        out += `${lead}${keep.join(',\n')} {${body}}`;
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
