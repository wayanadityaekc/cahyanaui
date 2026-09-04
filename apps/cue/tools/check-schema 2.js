#!/usr/bin/env node
// The class diff only looks at class attributes, so it cannot see JSON-LD.
// Structured data is invisible to the eye and to that diff, but it is what
// Google reads. This compares schema @type counts, original vs built.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function types(html) {
  const out = {};
  for (const m of html.matchAll(/"@type":\s*"([A-Za-z]+)"/g)) out[m[1]] = (out[m[1]] || 0) + 1;
  return out;
}

const pages = [
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')),
  ...fs.readdirSync(path.join(ROOT, 'attractions')).map((f) => 'attractions/' + f),
  ...fs.readdirSync(path.join(ROOT, 'guide')).filter((f) => f.endsWith('.html') && f !== '_template.html').map((f) => 'guide/' + f),
].filter((f) => f !== 'south-bali-tour.html');

const A = {};
const B = {};
for (const p of pages) {
  const orig = path.join(ROOT, p);
  const built = path.join(ROOT, 'out', p);
  if (!fs.existsSync(built)) continue;
  for (const [k, v] of Object.entries(types(fs.readFileSync(orig, 'utf8')))) A[k] = (A[k] || 0) + v;
  for (const [k, v] of Object.entries(types(fs.readFileSync(built, 'utf8')))) B[k] = (B[k] || 0) + v;
}

const keys = [...new Set([...Object.keys(A), ...Object.keys(B)])].sort();
const missing = keys.filter((k) => (B[k] || 0) < (A[k] || 0));

console.log('  schema type'.padEnd(26) + 'original  built');
for (const k of keys) {
  const a = A[k] || 0;
  const b = B[k] || 0;
  console.log('  ' + k.padEnd(24) + String(a).padEnd(10) + b + (b < a ? '   MISSING' : ''));
}

if (missing.length) {
  console.error(`\nSCHEMA CHECK FAILED - ${missing.length} type(s) lost: ${missing.join(', ')}`);
  console.error('Structured data is invisible in a visual review. Do not cut over until this passes.');
  process.exit(1);
}
console.log('\nSchema check passed.');
