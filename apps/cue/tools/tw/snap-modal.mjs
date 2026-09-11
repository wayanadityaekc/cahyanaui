// Interaction snapshot for the driver profile modal (portaled, opens on click).
// Usage: node tools/tw/snap-modal.mjs <page.html> <out.json>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const [, , page, outfile] = process.argv;
if (!page || !outfile) { console.error('usage: node tools/tw/snap-modal.mjs <page.html> <out.json>'); process.exit(2); }
const ROOT = 'out';
function findShell() {
  try { const hit = execSync('ls -d /opt/pw-browsers/*/chrome-linux/headless_shell 2>/dev/null | head -1').toString().trim(); if (hit) return hit; } catch {}
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
const PROPS = ['position', 'top', 'display', 'flexDirection', 'flexBasis', 'flexGrow', 'flexShrink', 'alignItems', 'justifyContent', 'gap', 'width', 'height', 'maxWidth', 'marginTop', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'borderBottomWidth', 'borderRadius', 'backgroundColor', 'boxShadow', 'fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'textTransform', 'textAlign', 'color', 'lineHeight', 'scrollMarginTop', 'listStyleType', 'overflowX', 'aspectRatio', 'gridTemplateColumns', 'gridTemplateAreas'];
const SEL = '[aria-modal="true"]';
const port = 8000 + Math.floor(Math.random() * 1500);
const s = await serve(ROOT, port);
const b = await chromium.launch({ executablePath: EXE });
const all = {};
for (const vw of [1280, 560, 390]) {
  const pg = await b.newPage({ viewport: { width: vw, height: 1400 } });
  await pg.goto(`http://localhost:${port}/${page}`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(400);
  await pg.click('button[data-name]', { force: true });
  await pg.waitForTimeout(500);
  all[vw] = await pg.evaluate(({ SEL, PROPS }) => {
    const roots = [...document.querySelectorAll(SEL)];
    const els = [];
    roots.forEach((rt) => { els.push(rt); els.push(...rt.querySelectorAll('*')); });
    return els.map((e) => { const c = getComputedStyle(e); const o = { _t: e.tagName }; for (const p of PROPS) o[p] = c[p]; return o; });
  }, { SEL, PROPS });
  await pg.close();
}
await b.close();
s.close();
fs.writeFileSync(outfile, JSON.stringify(all));
console.log(`snapped modal on ${page} -> ${outfile} (els: ${(all[1280] || []).length} @1280)`);
