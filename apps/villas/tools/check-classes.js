#!/usr/bin/env node
// GATE (ported from CUE): malformed Tailwind utilities in SOURCE, the only place they exist.
// A dangling prefix (`hover:`) or a doubled one (`hover:hover:bg-cta`) generates no CSS at all, so out/ and every browser check are blind to it.
// In a concatenated class string a dangling `hover:` also glues onto the next segment and turns it into a hover-only rule.
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

const VARIANT = /^(hover|focus|focus-within|focus-visible|active|visited|target|disabled|checked|required|invalid|open|group-open|group-hover|group-focus|peer-[\w-]+|first|last|only|odd|even|first-of-type|last-of-type|empty|before|after|placeholder|file|marker|selection|backdrop|motion-reduce|motion-safe|standalone|dark|light|print|portrait|landscape|rtl|ltr|sm|md|lg|xl|2xl|min|max|aria-\[[^\]]*\]|data-\[[^\]]*\]|has-\[[^\]]*\]|not-has-\[[^\]]*\]|group-has-\[[^\]]*\]|peer-has-\[[^\]]*\]|max-\[[^\]]*\]|min-\[[^\]]*\]|supports-\[[^\]]*\]|\[@[^\]]*\]|\[&[^\]]*\])$/;

// The library is vendored at packages/ui in this repo and lives two levels up in the cahyanaui monorepo.
function libraryDir() {
  const vendored = path.join(ROOT, 'packages/ui/src');
  return fs.existsSync(vendored) ? vendored : path.join(ROOT, '../../packages/ui/src');
}

const SOURCE_DIRS = ['app', 'components', 'lib', 'content'].map((dir) => path.join(ROOT, dir)).concat(libraryDir());

function sourceFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : sourceFiles(full);
    return /\.(js|jsx|mjs)$/.test(entry.name) ? [full] : [];
  });
}

// Splits on colons that sit outside [] and ().
function segments(token) {
  const parts = [];
  let depth = 0;
  let current = '';
  [...token].forEach((ch) => {
    if (ch === '[' || ch === '(') depth++;
    else if (ch === ']' || ch === ')') depth--;
    if (ch === ':' && depth === 0) { parts.push(current); current = ''; } else current += ch;
  });
  parts.push(current);
  return parts;
}

// Returns the contents of every string literal as { text, start }: class names only ever live in strings, object keys like `sm:` never do.
function stringLiterals(src) {
  const found = [];
  const stack = [{ kind: 'code', depth: 0 }];
  let chunk = null;
  let i = 0;
  function open(kind) { stack.push({ kind }); chunk = { text: '', start: i + 1 }; }
  function close() { if (chunk) found.push(chunk); chunk = null; stack.pop(); }
  while (i < src.length) {
    const ch = src[i];
    const top = stack[stack.length - 1];
    if (top.kind === 'code') {
      if (ch === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i === -1) break; continue; }
      if (ch === '/' && src[i + 1] === '*') { const end = src.indexOf('*/', i + 2); i = end === -1 ? src.length : end + 2; continue; }
      if (ch === '"' || ch === "'" || ch === '`') open(ch);
      else if (ch === '{') top.depth++;
      else if (ch === '}' && top.inTemplate && top.depth === 0) { stack.pop(); chunk = { text: '', start: i + 1 }; }
      else if (ch === '}') top.depth--;
    } else if (ch === '\\') {
      if (chunk) chunk.text += src.slice(i, i + 2);
      i += 2;
      continue;
    } else if (ch === top.kind) {
      close();
    } else if (ch === '\n' && top.kind !== '`') {
      // A quote or apostrophe cannot span lines: this was JSX text (It's...), so drop it rather than scan prose.
      chunk = null;
      stack.pop();
    } else if (top.kind === '`' && ch === '$' && src[i + 1] === '{') {
      if (chunk) found.push(chunk);
      chunk = null;
      stack.push({ kind: 'code', depth: 0, inTemplate: true });
      i += 2;
      continue;
    } else if (chunk) {
      chunk.text += ch;
    }
    i++;
  }
  return found;
}

function lineAt(src, index) {
  return src.slice(0, index).split('\n').length;
}

const files = SOURCE_DIRS.flatMap(sourceFiles);
if (!files.length) {
  console.error('check-classes: scanned 0 source files - the gate is looking in the wrong place');
  process.exit(1);
}

const bad = [];
let tokensChecked = 0;
files.forEach((file) => {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, 'utf8');
  stringLiterals(src).forEach(({ text, start }) => {
    // Split on whitespace only: arbitrary values are full of brackets, parens and commas.
    let offset = 0;
    text.split(/(\s+)/).forEach((token) => {
      const at = start + offset;
      offset += token.length;
      if (!token.includes(':') || /\s/.test(token)) return;
      const parts = segments(token);
      const last = parts.pop();
      if (!parts.length || !parts.every((part) => VARIANT.test(part))) return;
      tokensChecked++;
      if (last === '') bad.push([rel, lineAt(src, at), token, 'variant prefix with no utility after it']);
      else if (new Set(parts).size !== parts.length) bad.push([rel, lineAt(src, at), token, 'the same variant prefix twice']);
    });
    const empty = text.indexOf('var(--)');
    if (empty !== -1) bad.push([rel, lineAt(src, start + empty), 'var(--)', 'empty custom property']);
  });
});

if (!tokensChecked) {
  console.error(`check-classes: ${files.length} files read but 0 variant utilities found - the tokenizer is broken`);
  process.exit(1);
}

if (!bad.length) {
  console.log(`check-classes: OK (${files.length} files, ${tokensChecked} variant utilities, no malformed utilities)`);
  process.exit(0);
}
console.error(`check-classes: ${bad.length} malformed utilit${bad.length > 1 ? 'ies' : 'y'}\n`);
bad.forEach(([file, line, token, why]) => { console.error(`  ${file}:${line}\n    ${token}\n    ${why} - it generates no CSS at all\n`); });
process.exit(1);
