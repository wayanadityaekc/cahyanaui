import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const ROOT = 'out';
function findShell() {
  try {
    return execSync('ls -d /opt/pw-browsers/*/chrome-linux/headless_shell 2>/dev/null | head -1').toString().trim();
  } catch (e) {
    return '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
  }
}
const EXE = findShell();
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
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

const port = 8000 + Math.floor(Math.random() * 1500);
const server = await serve(ROOT, port);
const browser = await chromium.launch({ executablePath: EXE });
let pass = 0,
  fail = 0;
function check(label, cond) {
  if (cond) {
    pass++;
    console.log(`OK   ${label}`);
  } else {
    fail++;
    console.log(`FAIL ${label}`);
  }
}

function lockState(pg) {
  return pg.evaluate(() => ({
    html: document.documentElement.classList.contains('hs-locked'),
    body: document.body.classList.contains('hs-locked'),
    htmlOv: getComputedStyle(document.documentElement).overflowY,
    bodyOv: getComputedStyle(document.body).overflowY,
  }));
}

{
  const pg = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(400);
  await pg.click('button:has-text("Add a program")');
  await pg.waitForTimeout(400);
  const st = await lockState(pg);
  check(
    'Add Program popup: html+body both locked, overflow hidden on both',
    st.html && st.body && st.htmlOv === 'hidden' && st.bodyOv === 'hidden',
  );
  await pg.click('[aria-label="Add to your trip"] button[aria-label="Close"]');
  await pg.waitForTimeout(300);
  const st2 = await lockState(pg);
  check('Add Program popup: unlocked again after close', !st2.html && !st2.body);
  await pg.close();
}

{
  const pg = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pg.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(500);
  const planBtn = await pg.$('button:has-text("Plan your trip")');
  if (planBtn) {
    await planBtn.click();
    await pg.waitForTimeout(400);
    const st = await lockState(pg);
    check('Hero mobile "Plan your trip" sheet: html+body both locked', st.html && st.body);
  } else {
    console.log('SKIP hero sheet test - [data-plan-open] not present at this viewport');
  }
  await pg.close();
}
{
  const pg = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pg.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(400);
  const hb = await pg.$('button[aria-label="Open menu"]');
  if (hb) {
    await hb.click();
    await pg.waitForTimeout(300);
    const st = await lockState(pg);
    check('Navbar mobile drawer: html+body both locked', st.html && st.body);
  } else {
    console.log('SKIP navbar drawer test - hamburger button selector did not match');
  }
  await pg.close();
}

await browser.close();
server.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
