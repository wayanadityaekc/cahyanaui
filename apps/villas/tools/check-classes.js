#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

const VARIANT =
  /^(hover|focus|focus-within|focus-visible|active|visited|target|disabled|checked|required|invalid|open|group-open|group-hover|group-focus|peer-[\w-]+|first|last|only|odd|even|first-of-type|last-of-type|empty|before|after|placeholder|file|marker|selection|backdrop|motion-reduce|motion-safe|standalone|dark|light|print|portrait|landscape|rtl|ltr|sm|md|lg|xl|2xl|min|max|aria-\[[^\]]*\]|data-\[[^\]]*\]|has-\[[^\]]*\]|not-has-\[[^\]]*\]|group-has-\[[^\]]*\]|peer-has-\[[^\]]*\]|max-\[[^\]]*\]|min-\[[^\]]*\]|supports-\[[^\]]*\]|\[@[^\]]*\]|\[&[^\]]*\])$/;

function findLibraryDirectory() {
  const vendored = path.join(ROOT, 'packages/ui/src');
  return fs.existsSync(vendored) ? vendored : path.join(ROOT, '../../packages/ui/src');
}

const SOURCE_DIRS = ['app', 'components', 'lib', 'content']
  .map((dir) => path.join(ROOT, dir))
  .concat(findLibraryDirectory());

function listSourceFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : listSourceFiles(full);
    return /\.(js|jsx|mjs)$/.test(entry.name) ? [full] : [];
  });
}

function splitSegments(token) {
  const parts = [];
  let depth = 0;
  let current = '';
  [...token].forEach((ch) => {
    if (ch === '[' || ch === '(') depth++;
    else if (ch === ']' || ch === ')') depth--;
    if (ch === ':' && depth === 0) {
      parts.push(current);
      current = '';
    } else current += ch;
  });
  parts.push(current);
  return parts;
}

function extractStringLiterals(src) {
  const foundClasses = [];
  const scopeStack = [{ kind: 'code', depth: 0 }];
  let chunk = null;
  let charIndex = 0;
  function open(kind) {
    scopeStack.push({ kind });
    chunk = { text: '', start: charIndex + 1 };
  }
  function close() {
    if (chunk) foundClasses.push(chunk);
    chunk = null;
    scopeStack.pop();
  }
  while (charIndex < src.length) {
    const ch = src[charIndex];
    const top = scopeStack[scopeStack.length - 1];
    if (top.kind === 'code') {
      if (ch === '/' && src[charIndex + 1] === '/') {
        charIndex = src.indexOf('\n', charIndex);
        if (charIndex === -1) break;
        continue;
      }
      if (ch === '/' && src[charIndex + 1] === '*') {
        const end = src.indexOf('*/', charIndex + 2);
        charIndex = end === -1 ? src.length : end + 2;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') open(ch);
      else if (ch === '{') top.depth++;
      else if (ch === '}' && top.inTemplate && top.depth === 0) {
        scopeStack.pop();
        chunk = { text: '', start: charIndex + 1 };
      } else if (ch === '}') top.depth--;
    } else if (ch === '\\') {
      if (chunk) chunk.text += src.slice(charIndex, charIndex + 2);
      charIndex += 2;
      continue;
    } else if (ch === top.kind) {
      close();
    } else if (ch === '\n' && top.kind !== '`') {
      chunk = null;
      scopeStack.pop();
    } else if (top.kind === '`' && ch === '$' && src[charIndex + 1] === '{') {
      if (chunk) foundClasses.push(chunk);
      chunk = null;
      scopeStack.push({ kind: 'code', depth: 0, inTemplate: true });
      charIndex += 2;
      continue;
    } else if (chunk) {
      chunk.text += ch;
    }
    charIndex++;
  }
  return foundClasses;
}

function findLineNumber(src, index) {
  return src.slice(0, index).split('\n').length;
}

const files = SOURCE_DIRS.flatMap(listSourceFiles);
if (!files.length) {
  console.error('check-classes: scanned 0 source files - the gate is looking in the wrong place');
  process.exit(1);
}

const badClasses = [];
let tokensChecked = 0;
files.forEach((file) => {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, 'utf8');
  extractStringLiterals(src).forEach(({ text, start }) => {
    let offset = 0;
    text.split(/(\s+)/).forEach((token) => {
      const at = start + offset;
      offset += token.length;
      if (!token.includes(':') || /\s/.test(token)) return;
      const parts = splitSegments(token);
      const last = parts.pop();
      if (!parts.length || !parts.every((part) => VARIANT.test(part))) return;
      tokensChecked++;
      if (last === '')
        badClasses.push([rel, findLineNumber(src, at), token, 'variant prefix with no utility after it']);
      else if (new Set(parts).size !== parts.length)
        badClasses.push([rel, findLineNumber(src, at), token, 'the same variant prefix twice']);
    });
    const empty = text.indexOf('var(--)');
    if (empty !== -1) badClasses.push([rel, findLineNumber(src, start + empty), 'var(--)', 'empty custom property']);
  });
});

if (!tokensChecked) {
  console.error(`check-classes: ${files.length} files read but 0 variant utilities found - the tokenizer is broken`);
  process.exit(1);
}

if (!badClasses.length) {
  console.log(`check-classes: OK (${files.length} files, ${tokensChecked} variant utilities, no malformed utilities)`);
  process.exit(0);
}
console.error(`check-classes: ${badClasses.length} malformed utilit${badClasses.length > 1 ? 'ies' : 'y'}\n`);
badClasses.forEach(([file, line, token, why]) => {
  console.error(`  ${file}:${line}\n    ${token}\n    ${why} - it generates no CSS at all\n`);
});
process.exit(1);
