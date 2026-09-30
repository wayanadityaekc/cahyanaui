#!/usr/bin/env node
// GATE (ported from CUE): every local file the built pages reference exists in out/, and every page carries a favicon link.
// A missing image is invisible to the build and only shows up as a broken picture in a browser.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const SITE = 'https://ubudprivatevillas.com';
if (!fs.existsSync(OUT)) { console.error('out/ missing - run the build first'); process.exit(2); }

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '_next' ? [] : walk(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

function decode(value) {
  return value.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
}

// Turns a reference into an out/ path, or null when it is not a local file (a page, an external URL, a data: URI).
function localFile(raw) {
  let ref = decode(raw).trim().replace(/^['"]|['"]$/g, '');
  if (ref.startsWith(SITE)) ref = ref.slice(SITE.length);
  if (!ref.startsWith('/') || ref.startsWith('//')) return null;
  const clean = ref.split(/[?#]/)[0];
  // No extension (or .html) is a page link: check-urls owns those.
  if (!/\.[a-z0-9]+$/i.test(clean) || clean.endsWith('.html')) return null;
  try {
    return decodeURIComponent(clean);
  } catch (e) {
    return clean;
  }
}

const pages = walk(OUT);
const referenced = new Map();
function note(raw, page) {
  const file = localFile(raw);
  if (file && !referenced.has(file)) referenced.set(file, path.relative(OUT, page));
}

pages.forEach((page) => {
  const html = fs.readFileSync(page, 'utf8');
  [...html.matchAll(/\s(?:src|href|poster)="([^"]+)"/g)].forEach((match) => { note(match[1], page); });
  // srcset lists "url width, url width".
  [...html.matchAll(/\s(?:srcset|srcSet|imagesrcset)="([^"]+)"/gi)].forEach((match) => {
    match[1].split(',').forEach((candidate) => { note(candidate.trim().split(/\s+/)[0], page); });
  });
  // Inline styles write url(&#x27;/images/...&#x27;), so entity quotes are stripped by decode().
  [...html.matchAll(/url\(([^)]+)\)/g)].forEach((match) => { note(match[1], page); });
  // og:image and twitter:image are absolute URLs on our own domain.
  [...html.matchAll(/<meta[^>]*\scontent="(https:\/\/ubudprivatevillas\.com\/[^"]+)"/g)].forEach((match) => { note(match[1], page); });
});

// Built stylesheets load the fonts; their url() is relative to the stylesheet itself.
function stylesheets(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return stylesheets(full);
    return entry.name.endsWith('.css') ? [full] : [];
  });
}
const cssFiles = stylesheets(OUT);
cssFiles.forEach((css) => {
  const text = fs.readFileSync(css, 'utf8');
  [...text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].forEach((match) => {
    const ref = match[1];
    if (/^(data:|https?:|#)/.test(ref)) return;
    const absolute = ref.startsWith('/') ? ref : `/${path.relative(OUT, path.resolve(path.dirname(css), ref.split(/[?#]/)[0])).split(path.sep).join('/')}`;
    note(absolute, css);
  });
});

const missing = [...referenced].filter(([file]) => !fs.existsSync(path.join(OUT, file.replace(/^\//, ''))));

console.log(`Pages scanned        : ${pages.length} (+ ${cssFiles.length} stylesheets)`);
console.log(`Assets referenced    : ${referenced.size}`);
console.log(`Referenced but absent: ${missing.length}`);
if (!pages.length || !referenced.size) {
  console.error('\nASSET CHECK FAILED - it found nothing to check, so it proved nothing.');
  process.exit(1);
}
if (missing.length) {
  console.error('\nMISSING ASSETS:');
  missing.slice(0, 30).forEach(([file, page]) => { console.error(`  ${file}   (first seen on ${page})`); });
  if (missing.length > 30) console.error(`  ... and ${missing.length - 30} more`);
  process.exit(1);
}

// Without the icon link browsers request /favicon.ico and 404, which only shows as a blank tab icon.
const noIcon = pages.filter((page) => !/rel="icon"/.test(fs.readFileSync(page, 'utf8')));
console.log(`Pages without a favicon: ${noIcon.length}`);
if (noIcon.length) {
  console.error('\nPAGES MISSING THE FAVICON LINK:');
  noIcon.slice(0, 10).forEach((page) => { console.error(`  ${path.relative(OUT, page)}`); });
  process.exit(1);
}

console.log('\nEvery referenced asset exists.');
