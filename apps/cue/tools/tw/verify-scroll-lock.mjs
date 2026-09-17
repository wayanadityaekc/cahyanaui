// Verify the global scroll-lock (hs-locked on <html> AND <body>) actually applies
// across popups, and specifically on the Add Program popup that was reported broken
// (Wayan, Sep 2026 - background scroll wasn't locked on iPhone).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const ROOT = 'out';
function findShell() {
  try { return execSync('ls -d /opt/pw-browsers/*/chrome-linux/headless_shell 2>/dev/null | head -1').toString().trim(); } catch { return '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'; }
}
const EXE = findShell();
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };
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

const port = 8000 + Math.floor(Math.random() * 1500);
const s = await serve(ROOT, port);
const b = await chromium.launch({ executablePath: EXE });
let pass = 0, fail = 0;
const check = (label, cond) => { if (cond) { pass++; console.log(`OK   ${label}`); } else { fail++; console.log(`FAIL ${label}`); } };

const lockState = (pg) => pg.evaluate(() => ({
  html: document.documentElement.classList.contains('hs-locked'),
  body: document.body.classList.contains('hs-locked'),
  htmlOv: getComputedStyle(document.documentElement).overflowY,
  bodyOv: getComputedStyle(document.body).overflowY,
}));

// ---- 1) Add Program popup (My Trips) - the exact reported bug ----
{
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  await pg.goto(`http://localhost:${port}/my-trips.html`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(400);
  await pg.click('button:has-text("Add a program")');
  await pg.waitForTimeout(400);
  const st = await lockState(pg);
  check('Add Program popup: html+body both locked, overflow hidden on both', st.html && st.body && st.htmlOv === 'hidden' && st.bodyOv === 'hidden');
  // Close via THIS dialog's own close button - the page also mounts a hidden
  // "Sign in" Modal globally (present in the DOM but opacity:0), so a bare
  // [role="dialog"] selector matches that one first too.
  await pg.click('[aria-label="Add to your trip"] button[aria-label="Close"]');
  await pg.waitForTimeout(300);
  const st2 = await lockState(pg);
  check('Add Program popup: unlocked again after close', !st2.html && !st2.body);
  await pg.close();
}

// ---- 2) Regression check: other popups that used to hand-roll the same lock still work ----
{
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
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
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
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

await b.close();
s.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
