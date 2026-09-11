// tools/tw/snap.mjs — Tailwind migration verifier (epic #321).
// Snapshots computed styles of every element under a selector, across 3 viewports
// (1280 desktop / 560 tablet / 390 mobile), from the built static export in `out/`.
// Serves `out/` over a local http server + drives headless Chromium (headless_shell)
// via playwright-core. Writes a JSON snapshot to compare with tools/tw/diff.mjs.
//
// Usage:
//   node tools/tw/snap.mjs <page.html> "<cssSelector>" <out.json>
// Example:
//   node tools/tw/snap.mjs faq.html ".faq" /tmp/before.json
//   node tools/tw/snap.mjs guide/ubud.html ".guide-more" /tmp/after.json
//
// Client-rendered UI (itinerary/cart/modal) won't be in static HTML — for those,
// write a small custom script that seeds localStorage / clicks to open, then reuses
// the same PROPS/serve logic. See tools/tw/README.md.
//
// Requires: playwright-core (devDependency) + headless_shell under /opt/pw-browsers.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const [, , page, selAll, outfile] = process.argv;
if (!page || !selAll || !outfile) {
  console.error('usage: node tools/tw/snap.mjs <page.html> "<selector>" <out.json>');
  process.exit(2);
}
const ROOT = 'out';
if (!fs.existsSync(ROOT)) { console.error('no out/ — run `npm run build` first'); process.exit(2); }

// Locate headless_shell (version dir may differ across environments).
function findShell() {
  try {
    const hit = execSync('ls -d /opt/pw-browsers/*/chrome-linux/headless_shell 2>/dev/null | head -1').toString().trim();
    if (hit) return hit;
  } catch { /* ignore */ }
  return '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
}
const EXE = findShell();

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml' };
function serve(root, port) {
  return new Promise((res) => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      let f = path.join(root, p);
      if (!fs.existsSync(f) && !path.extname(f)) f = path.join(root, p + '.html');
      if (!fs.existsSync(f)) { r.writeHead(404); r.end(); return; }
      r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'text/html' });
      r.end(fs.readFileSync(f));
    });
    s.listen(port, () => res(s));
  });
}

// Computed-style props that catch layout + type + color regressions.
const PROPS = ['position', 'top', 'display', 'flexDirection', 'flexBasis', 'flexGrow', 'flexShrink', 'alignItems', 'justifyContent', 'gap', 'width', 'height', 'maxWidth', 'marginTop', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'borderBottomWidth', 'borderRadius', 'backgroundColor', 'boxShadow', 'fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'textTransform', 'textAlign', 'color', 'lineHeight', 'scrollMarginTop', 'listStyleType', 'overflowX', 'aspectRatio', 'gridTemplateColumns', 'gridTemplateAreas'];

const port = 8000 + Math.floor(Math.random() * 1500);
const s = await serve(ROOT, port);
const b = await chromium.launch({ executablePath: EXE });
const all = {};
for (const vw of [1280, 560, 390]) {
  const pg = await b.newPage({ viewport: { width: vw, height: 1400 } });
  await pg.goto(`http://localhost:${port}/${page}`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(500);
  all[vw] = await pg.evaluate(({ selAll, PROPS }) => {
    const roots = [...document.querySelectorAll(selAll)];
    const els = [];
    roots.forEach((rt) => { els.push(rt); els.push(...rt.querySelectorAll('*')); });
    return els.map((e) => { const c = getComputedStyle(e); const o = { _t: e.tagName }; for (const p of PROPS) o[p] = c[p]; return o; });
  }, { selAll, PROPS });
  await pg.close();
}
await b.close();
s.close();
fs.writeFileSync(outfile, JSON.stringify(all));
console.log(`snapped "${selAll}" on ${page} -> ${outfile} (els: ${(all[1280] || []).length} @1280)`);
