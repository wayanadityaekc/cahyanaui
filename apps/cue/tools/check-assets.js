#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'out');
if (!fs.existsSync(OUT)) {
  console.error('out/ missing - run the build first');
  process.exit(2);
}

function walk(dir, test) {
  const found = [];
  (function walkDirectory(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((event) => {
      if (event.name === '_next') return;
      const entryPath = path.join(directory, event.name);
      if (event.isDirectory()) walkDirectory(entryPath);
      else if (test(event.name)) found.push(entryPath);
    });
  })(dir);
  return found;
}

const pages = walk(OUT, (fileName) => fileName.endsWith('.html'));
const referenced = new Set();
const RX = [/(?:src|href)="(\/assets\/[^"?#&]+)/g, /url\((?:&#x27;|')?(\/assets\/[^'")#?&]+)/g];
pages.forEach((page) => {
  const html = fs.readFileSync(page, 'utf8');
  RX.forEach((pattern) => {
    [...html.matchAll(pattern)].forEach((match) => {
      referenced.add(decodeURIComponent(match[1]));
    });
  });
});

const missing = [];
referenced.forEach((reference) => {
  if (!fs.existsSync(path.join(OUT, reference.replace(/^\//, '')))) missing.push(reference);
});

console.log(`Pages scanned        : ${pages.length}`);
console.log(`Assets referenced    : ${referenced.size}`);
console.log(`Referenced but absent: ${missing.length}`);
if (missing.length) {
  console.error('\nMISSING ASSETS:');
  missing.slice(0, 30).forEach((missingAsset) => console.error(`  ${missingAsset}`));
  if (missing.length > 30) console.error(`  ... and ${missing.length - 30} more`);
  process.exit(1);
}
const noIcon = pages.filter((page) => !/rel="icon"/.test(fs.readFileSync(page, 'utf8')));
console.log(`Pages without a favicon: ${noIcon.length}`);
if (noIcon.length) {
  console.error('\nPAGES MISSING THE FAVICON LINK:');
  noIcon.slice(0, 10).forEach((iconPath) => console.error(`  ${iconPath.replace(`${OUT}/`, '')}`));
  process.exit(1);
}

console.log('\nEvery referenced asset exists.');
