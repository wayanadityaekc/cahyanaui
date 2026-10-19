#!/usr/bin/env node
const { execSync } = require('node:child_process');
const { readFileSync } = require('node:fs');

const VARIANT = /^(hover|focus|focus-within|focus-visible|active|visited|target|disabled|checked|required|invalid|open|group-open|group-hover|group-focus|peer-[\w-]+|first|last|only|odd|even|first-of-type|last-of-type|empty|before|after|placeholder|file|marker|selection|backdrop|motion-reduce|motion-safe|standalone|dark|light|print|portrait|landscape|rtl|ltr|sm|md|lg|xl|2xl|min|max|aria-\[[^\]]*\]|data-\[[^\]]*\]|has-\[[^\]]*\]|not-has-\[[^\]]*\]|group-has-\[[^\]]*\]|peer-has-\[[^\]]*\]|max-\[[^\]]*\]|min-\[[^\]]*\]|supports-\[[^\]]*\]|\[@[^\]]*\]|\[&[^\]]*\])$/;


function segments(tok) {
  const out = [];
  let depth = 0, cur = '';
  [...tok].forEach((ch) => {
    if (ch === '[' || ch === '(') depth++;
    else if (ch === ']' || ch === ')') depth--;
    if (ch === ':' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  });
  out.push(cur);
  return out;
}

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((l) => (/^\s*(\/\/|\*)/.test(l) ? '' : l.replace(/\s\/\/.*$/, '')))
    .join('\n');
}

const files = execSync(
  "git ls-files 'components/**/*.js' 'components/**/*.jsx' 'app/**/*.js' 'app/**/*.jsx' 'lib/**/*.js'",
  { encoding: 'utf8' },
).trim().split('\n').filter(Boolean);

const bad = [];
files.forEach((f) => {
  const lines = stripComments(readFileSync(f, 'utf8')).split('\n');
  lines.forEach((line, i) => {
    line.split(/[\s'"`{};,]+/).filter(Boolean).forEach((tok) => {
      if (!tok.includes(':')) return;
      const parts = segments(tok);
      const last = parts.pop();
      if (!parts.length || !parts.every((p) => VARIANT.test(p))) return;
      if (last === '') bad.push([f, i + 1, tok, 'variant prefix with no utility after it']);
      else if (new Set(parts).size !== parts.length) bad.push([f, i + 1, tok, 'the same variant prefix twice']);
    });
    if (/var\(--\)/.test(line)) bad.push([f, i + 1, 'var(--)', 'empty custom property']);
  });
});

if (!bad.length) {
  console.log(`check-classes: OK (${files.length} files, no malformed utilities)`);
  process.exit(0);
}
console.error(`check-classes: ${bad.length} malformed utilit${bad.length > 1 ? 'ies' : 'y'}\n`);
bad.forEach(([f, l, tok, why]) => { console.error(`  ${f}:${l}\n    ${tok}\n    ${why} - it generates no CSS at all\n`); });
process.exit(1);
