import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const [, , page, selAll, outfile] = process.argv;
if (!page || !selAll || !outfile) {
  console.error('usage: node tools/tw/snapx.mjs <page.html> "<selector>" <out.json>');
  process.exit(2);
}
const ROOT = 'out';
const EXE = execSync('ls -d /opt/pw-browsers/*/chrome-linux/headless_shell 2>/dev/null | head -1').toString().trim();
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};
function serve(root, port) {
  return new Promise((result) => {
    const httpServer = http.createServer((request, response) => {
      let pathname = decodeURIComponent(request.url.split('?')[0]);
      if (pathname.endsWith('/')) pathname += 'index.html';
      let filePath = path.join(root, pathname);
      if (!fs.existsSync(filePath) && !path.extname(filePath)) filePath = path.join(root, `${pathname}.html`);
      if (!fs.existsSync(filePath)) {
        response.writeHead(404);
        response.end();
        return;
      }
      response.writeHead(200, { 'content-type': MIME[path.extname(filePath)] || 'text/html' });
      response.end(fs.readFileSync(filePath));
    });
    httpServer.listen(port, () => result(httpServer));
  });
}
const PROPS = [
  'position',
  'top',
  'left',
  'bottom',
  'right',
  'transform',
  'display',
  'flexDirection',
  'alignItems',
  'justifyContent',
  'gap',
  'width',
  'height',
  'maxWidth',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'borderTopWidth',
  'borderBottomWidth',
  'borderRadius',
  'backgroundColor',
  'boxShadow',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'letterSpacing',
  'textTransform',
  'textAlign',
  'color',
  'lineHeight',
  'content',
  'overflowX',
];
const port = 8000 + Math.floor(Math.random() * 1500);
const server = await serve(ROOT, port);
const browser = await chromium.launch({ executablePath: EXE });
const all = {};
for (const vw of [1280, 560, 390]) {
  const pg = await browser.newPage({ viewport: { width: vw, height: 1400 } });
  await pg.goto(`http://localhost:${port}/${page}`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(500);
  all[vw] = await pg.evaluate(
    ({ selAll, PROPS }) => {
      const roots = [...document.querySelectorAll(selAll)];
      const elements = [];
      roots.forEach((rt) => {
        elements.push(rt);
        elements.push(...rt.querySelectorAll('*'));
      });
      function grab(event, pseudo) {
        const computedStyle = getComputedStyle(event, pseudo || undefined);
        const styleSnapshot = {};
        PROPS.forEach((propertyName) => {
          styleSnapshot[propertyName] = computedStyle[propertyName];
        });
        return styleSnapshot;
      }
      return elements.map((event) => ({
        _t: event.tagName,
        main: grab(event),
        before: grab(event, '::before'),
        after: grab(event, '::after'),
      }));
    },
    { selAll, PROPS },
  );
  await pg.close();
}
await browser.close();
server.close();
fs.writeFileSync(outfile, JSON.stringify(all));
console.log(`snapx "${selAll}" on ${page} -> ${outfile} (els: ${(all[1280] || []).length} @1280)`);
