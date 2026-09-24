// tools/tw/snapx.mjs — like snap.mjs but ALSO captures ::before/::after pseudo-element
// computed styles for every matched element. Needed to verify pseudo-driven UI
// (section-title underline `::after`, section dividers `::before`) that snap.mjs misses.
// Usage: node tools/tw/snapx.mjs <page.html> "<selector>" <out.json>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const [, , page, selAll, outfile] = process.argv;
if (!page || !selAll || !outfile) { console.error('usage: node tools/tw/snapx.mjs <page.html> "<selector>" <out.json>'); process.exit(2); }
const ROOT = 'out';
const EXE = execSync('ls -d /opt/pw-browsers/*/chrome-linux/headless_shell 2>/dev/null | head -1').toString().trim();
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon' };
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
const PROPS = ['position', 'top', 'left', 'bottom', 'right', 'transform', 'display', 'flexDirection', 'alignItems', 'justifyContent', 'gap', 'width', 'height', 'maxWidth', 'marginTop', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'borderTopWidth', 'borderBottomWidth', 'borderRadius', 'backgroundColor', 'boxShadow', 'fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'textTransform', 'textAlign', 'color', 'lineHeight', 'content', 'overflowX'];
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
    const grab = (e, pseudo) => { const c = getComputedStyle(e, pseudo || undefined); const o = {}; for (const p of PROPS) o[p] = c[p]; return o; };
    return els.map((e) => ({ _t: e.tagName, main: grab(e), before: grab(e, '::before'), after: grab(e, '::after') }));
  }, { selAll, PROPS });
  await pg.close();
}
await b.close();
s.close();
fs.writeFileSync(outfile, JSON.stringify(all));
console.log(`snapx "${selAll}" on ${page} -> ${outfile} (els: ${(all[1280] || []).length} @1280)`);
