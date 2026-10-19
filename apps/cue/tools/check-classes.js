#!/usr/bin/env node
const { execSync } = require('node:child_process');
const { readFileSync } = require('node:fs');

const VARIANT =
  /^(hover|focus|focus-within|focus-visible|active|visited|target|disabled|checked|required|invalid|open|group-open|group-hover|group-focus|peer-[\w-]+|first|last|only|odd|even|first-of-type|last-of-type|empty|before|after|placeholder|file|marker|selection|backdrop|motion-reduce|motion-safe|standalone|dark|light|print|portrait|landscape|rtl|ltr|sm|md|lg|xl|2xl|min|max|aria-\[[^\]]*\]|data-\[[^\]]*\]|has-\[[^\]]*\]|not-has-\[[^\]]*\]|group-has-\[[^\]]*\]|peer-has-\[[^\]]*\]|max-\[[^\]]*\]|min-\[[^\]]*\]|supports-\[[^\]]*\]|\[@[^\]]*\]|\[&[^\]]*\])$/;

function splitSegments(tok) {
  const segmentParts = [];
  let depth = 0,
    current = '';
  [...tok].forEach((ch) => {
    if (ch === '[' || ch === '(') depth++;
    else if (ch === ']' || ch === ')') depth--;
    if (ch === ':' && depth === 0) {
      segmentParts.push(current);
      current = '';
    } else current += ch;
  });
  segmentParts.push(current);
  return segmentParts;
}

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((line) => (/^\s*(\/\/|\*)/.test(line) ? '' : line.replace(/\s\/\/.*$/, '')))
    .join('\n');
}

const files = execSync(
  "git ls-files 'components/**/*.js' 'components/**/*.jsx' 'app/**/*.js' 'app/**/*.jsx' 'lib/**/*.js'",
  { encoding: 'utf8' },
)
  .trim()
  .split('\n')
  .filter(Boolean);

const badFiles = [];
files.forEach((file) => {
  const lines = stripComments(readFileSync(file, 'utf8')).split('\n');
  lines.forEach((line, index) => {
    line
      .split(/[\s'"`{};,]+/)
      .filter(Boolean)
      .forEach((tok) => {
        if (!tok.includes(':')) return;
        const parts = splitSegments(tok);
        const last = parts.pop();
        if (!parts.length || !parts.every((part) => VARIANT.test(part))) return;
        if (last === '') badFiles.push([file, index + 1, tok, 'variant prefix with no utility after it']);
        else if (new Set(parts).size !== parts.length)
          badFiles.push([file, index + 1, tok, 'the same variant prefix twice']);
      });
    if (/var\(--\)/.test(line)) badFiles.push([file, index + 1, 'var(--)', 'empty custom property']);
  });
});

if (!badFiles.length) {
  console.log(`check-classes: OK (${files.length} files, no malformed utilities)`);
  process.exit(0);
}
console.error(`check-classes: ${badFiles.length} malformed utilit${badFiles.length > 1 ? 'ies' : 'y'}\n`);
badFiles.forEach(([file, lineNumber, tok, why]) => {
  console.error(`  ${file}:${lineNumber}\n    ${tok}\n    ${why} - it generates no CSS at all\n`);
});
process.exit(1);
