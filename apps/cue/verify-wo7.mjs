// WO7 - the fixes from the component audit, measured in a real browser.
//
//   npm run build && cp -r out /tmp/out-after          (the build under test)
//   (a build of the previous main, copied to /tmp/out-before)
//   BEFORE=/tmp/out-before AFTER=/tmp/out-after node verify-wo7.mjs
//
// Two builds are served side by side (ports 4711 / 4712) so "what changed" is a
// measurement, not a claim. Sections:
//   1. borders   - histogram of every computed border colour, before vs after: the
//                  off-token hairline shades must be GONE and --line must gain exactly
//                  what they lost; page heights must not move.
//   2. cards     - hover a card: it must not move (and on the BEFORE build it DID -
//                  proves the check can fail).
//   3. menus     - disclosure, not role=menu; aria-expanded/controls; Escape returns focus.
//   4. tabs      - /programs has a real tab set (panel, roving tabindex, arrows);
//                  jump-nav and rail are navigation, not tabs.
//   5. dialogs   - role/label, focus lands inside, Tab trapped, Escape closes,
//                  focus returns to the opener. Modal (AuthModal) + ModalPresence (review).
//   6. live      - toast region always mounted; form errors are role=alert.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-core';

const BEFORE = process.env.BEFORE || '/tmp/claude-0/out-before';
const AFTER = process.env.AFTER || '/home/user/CUE/out';
const SHOT = process.env.SHOT || '/tmp/claude-0/-home-user/b39e23b2-cabe-5327-8412-a80a03834acc/scratchpad/wo7';
fs.mkdirSync(SHOT, { recursive: true });

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json',
  '.txt': 'text/plain', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const serve = (root, port) => new Promise((res) => {
  const s = http.createServer((req, rsp) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    let f = path.join(root, p);
    if (!fs.existsSync(f) && !path.extname(f)) f = path.join(root, p + '.html');
    if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); return rsp.end('nf'); }
    rsp.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
    rsp.end(fs.readFileSync(f));
  }).listen(port, () => res(s));
});
const sB = await serve(BEFORE, 4711);
const sA = await serve(AFTER, 4712);
const OLD = 'http://127.0.0.1:4711';
const NEW = 'http://127.0.0.1:4712';
// UNDER=before runs sections 3-6 against the OLD build: they must FAIL there, which is
// the proof the checks can see the bugs they were written for.
const UNDER = process.env.UNDER === 'before' ? OLD : NEW;

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  FAIL:', m)); };
const info = (m) => console.log('  ..', m);
const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

// ONE branching handler (a later route() would swallow an earlier one).
const MINE = { upcoming: [], history: [
  { ref: 'CUE-100', name: 'Ubud Tour', start_date: '2026-08-20', end_date: '2026-08-20', guests: '2', price_usd: 40, price_idr: 700000,
    status: 'new', upcoming: false, review_items: ['Ubud Tour'], lines: [{ type: 'tour', service: 'Ubud Tour', date: '2026-08-20', guests: '2' }] } ] };
const api = (loggedIn) => async (route) => {
  const u = route.request().url();
  const j = (b) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(b) });
  if (u.includes('/account/session') || u.includes('/account/me')) return j(loggedIn ? { status: 'ok', account: { id: 7, name: 'Wayan', email: 'w@e.com', phone: '' } } : { account: null });
  if (u.includes('/bookings/mine')) return j(MINE);
  return j({});
};
const open = async (base, url, w, { loggedIn = false, h = 900 } = {}) => {
  const ctx = await br.newContext({ viewport: { width: w, height: h } });
  if (loggedIn) await ctx.addInitScript(() => localStorage.setItem('cue_token', 'stub-token'));
  await ctx.route('**/api/**', api(loggedIn));
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  return { ctx, page, errs };
};

// ---------------------------------------------------------------- 1. borders
console.log('1. border colours + layout, before vs after');
const HEX = /rgb\((\d+), (\d+), (\d+)\)/;
const hex = (c) => { const m = HEX.exec(c); return m ? '#' + [1, 2, 3].map((i) => (+m[i]).toString(16).padStart(2, '0')).join('') : c; };
const PAGES = ['/', '/tour.html', '/destinations.html', '/activities.html', '/ubud-tour.html', '/attractions/monkey-forest.html',
  '/charter.html', '/transfer.html', '/airport-transfer.html', '/programs.html', '/our-company.html', '/bali-guide.html',
  '/guide/ubud.html', '/my-trips.html', '/settings.html', '/itinerary.html'];
const measure = async (base, url, w) => {
  const { ctx, page } = await open(base, url, w, { loggedIn: true });
  const r = await page.evaluate(() => {
    const hist = {};
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
        if (parseFloat(cs['border' + s + 'Width']) > 0 && cs['border' + s + 'Style'] !== 'none') {
          const k = cs['border' + s + 'Color'] + '|' + cs['border' + s + 'Style'];
          hist[k] = (hist[k] || 0) + 1;
        }
      }
    }
    return { hist, h: document.documentElement.scrollHeight, over: document.documentElement.scrollWidth - innerWidth };
  });
  await ctx.close();
  return r;
};
const OFF = ['#f2efe7', '#eeeeee', '#ece6d8', '#e6dfce', '#e2ddd0', '#ececec', '#e6e6e6', '#e4dcc8', '#e0ddd4'];
const LINE = '#e7e4dd';
let gainedTotal = 0, lostTotal = 0;
const heightDiffs = [];
for (const w of [390, 1280]) {
  for (const url of PAGES) {
    const a = await measure(OLD, url, w);
    const b = await measure(NEW, url, w);
    const H = (h) => Object.fromEntries(Object.entries(h).map(([k, v]) => { const [c, st] = k.split('|'); return [hex(c) + '|' + st, v]; }));
    const ha = H(a.hist), hb = H(b.hist);
    let lost = 0, gained = 0;
    for (const o of OFF) for (const k of Object.keys(ha)) if (k.startsWith(o + '|')) lost += (ha[k] || 0) - (hb[k] || 0);
    const lineA = Object.entries(ha).filter(([k]) => k.startsWith(LINE)).reduce((s, [, v]) => s + v, 0);
    const lineB = Object.entries(hb).filter(([k]) => k.startsWith(LINE)).reduce((s, [, v]) => s + v, 0);
    gained = lineB - lineA;
    lostTotal += lost; gainedTotal += gained;
    // No off-token hairline may remain on any page.
    for (const o of OFF) ok(!Object.keys(hb).some((k) => k.startsWith(o + '|')), `${url}@${w}: no ${o} border left`);
    // /settings swaps two <hr> (which drew their line as a BORDER) for Separators (a
    // background): those two --line borders disappear by design.
    const expect = url === '/settings.html' ? lost - 2 : lost;
    ok(gained === expect, `${url}@${w}: --line gained ${gained} = off-token lost ${lost}${url === '/settings.html' ? ' - 2 hr' : ''}`);
    if (a.h !== b.h) heightDiffs.push(`${url}@${w}: ${a.h} -> ${b.h}`);
    ok(b.over <= 0, `${url}@${w}: no horizontal overflow (${b.over})`);
    // Everything else must be identical, count for count.
    const rest = (h) => Object.fromEntries(Object.entries(h).filter(([k]) => !OFF.some((o) => k.startsWith(o + '|')) && !k.startsWith(LINE)));
    ok(JSON.stringify(rest(ha)) === JSON.stringify(rest(hb)), `${url}@${w}: every other border unchanged`);
  }
}
info(`off-token borders moved onto --line: ${lostTotal} (line gained ${gainedTotal})`);
ok(heightDiffs.length === 0, `document heights unchanged (${heightDiffs.join('; ') || 'all equal'})`);

// ---------------------------------------------------------------- 2. cards
console.log('2. cards do not move on hover');
const hoverShift = async (base, url, w, sel) => {
  const { ctx, page } = await open(base, url, w);
  const els = page.locator(sel);
  const n = Math.min(await els.count(), 3);
  const out = [];
  for (let i = 0; i < n; i++) {
    const el = els.nth(i);
    await el.scrollIntoViewIfNeeded();
    await page.mouse.move(2, 2);
    await page.waitForTimeout(350);
    const r0 = await el.boundingBox();
    await el.hover();
    await page.waitForTimeout(450);
    const r1 = await el.boundingBox();
    out.push(Math.abs(r1.y - r0.y) + Math.abs(r1.x - r0.x));
  }
  await ctx.close();
  return out;
};
const CARD_SELS = [['/', '.hcard'], ['/bali-guide.html', '[class*="shadow-card"]'], ['/ubud-tour.html', '[class*="shadow-card"]']];
let movedBefore = 0;
for (const [url, sel] of CARD_SELS) {
  const before = await hoverShift(OLD, url, 1280, sel);
  const after = await hoverShift(NEW, url, 1280, sel);
  movedBefore += before.filter((d) => d > 0.5).length;
  ok(after.length > 0 && after.every((d) => d < 0.5), `${url} ${sel}: after = no movement (${after.map((d) => d.toFixed(1))}) [before ${before.map((d) => d.toFixed(1))}]`);
}
ok(movedBefore > 0, `the check can fail: ${movedBefore} card(s) lifted on the BEFORE build`);

// ---------------------------------------------------------------- 3. menus
console.log('3. menus are disclosures');
for (const loggedIn of [false, true]) {
  const { ctx, page, errs } = await open(UNDER, '/tour.html', 1280, { loggedIn });
  const slot = page.locator(`[data-account-slot="${loggedIn ? 'in' : 'out'}"] > button`);
  await slot.click();
  await page.waitForTimeout(450);
  const s = await page.evaluate(() => ({
    menus: document.querySelectorAll('[role="menu"], [role="menuitem"]').length,
    haspopup: document.querySelectorAll('[aria-haspopup="menu"]').length,
  }));
  const ctl = await slot.getAttribute('aria-controls');
  ok(s.menus === 0 && s.haspopup === 0, `account (${loggedIn ? 'in' : 'out'}): no role=menu/menuitem/haspopup`);
  ok((await slot.getAttribute('aria-expanded')) === 'true' && !!ctl && (await page.locator('[id="' + ctl + '"]').count()) === 1, `account (${loggedIn ? 'in' : 'out'}): aria-expanded + aria-controls -> real panel`);
  await page.screenshot({ path: `${SHOT}/menu-${loggedIn ? 'in' : 'out'}-1280.png`, clip: { x: 780, y: 0, width: 500, height: 520 } });
  if (loggedIn) {
    const seps = await page.locator(`[id="${ctl}"] [role="none"]`).count();
    ok(seps >= 2, `account (in): group lines are Separator elements (${seps})`);
    ok((await page.locator(`[id="${ctl}"] a[href="/settings.html"]`).count()) === 1, 'account (in): Settings is a plain link');
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  ok((await slot.getAttribute('aria-expanded')) === 'false', `account (${loggedIn ? 'in' : 'out'}): Escape closes`);
  ok(await page.evaluate(() => document.activeElement === document.querySelector('[data-account-slot] > button')), `account (${loggedIn ? 'in' : 'out'}): Escape returns focus to the trigger`);
  ok(errs.length === 0, `account menu: no page errors ${errs}`);
  await ctx.close();
}
{
  const { ctx, page } = await open(UNDER, '/tour.html', 1280);
  const prog = page.locator('[data-desktop-nav] button[aria-controls]');
  // Keyboard, not click: the list also opens on hover, so a mouse click on an
  // already-hovered trigger toggles it shut again (existing behaviour, noted).
  await prog.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const pid = await prog.getAttribute('aria-controls');
  ok((await page.locator('[id="' + pid + '"] a').count()) >= 4, 'Program list: links in the aria-controls panel');
  ok((await page.locator('[data-desktop-nav] [role]').count()) === 0, 'Program list: no ARIA roles on the desktop nav');
  await page.screenshot({ path: `${SHOT}/program-1280.png`, clip: { x: 0, y: 0, width: 700, height: 340 } });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  ok(await page.evaluate(() => document.activeElement?.textContent?.trim().startsWith('Program')), 'Program list: Escape returns focus to the trigger');
  await ctx.close();
}

// ---------------------------------------------------------------- 4. tabs
console.log('4. tabs only where they are tabs');
{
  const { ctx, page } = await open(UNDER, '/programs.html', 1280);
  const tabs = page.locator('[role="tablist"] [role="tab"]');
  const n = await tabs.count();
  ok(n >= 3, `programs: ${n} real tabs`);
  const tabIdx = await tabs.evaluateAll((els) => els.map((e) => e.tabIndex));
  ok(tabIdx.filter((t) => t === 0).length === 1 && tabIdx.filter((t) => t === -1).length === n - 1, `programs: roving tabindex (${tabIdx})`);
  const panel = page.locator('[role="tabpanel"]');
  ok((await panel.count()) === 1, 'programs: exactly one tabpanel');
  const sel = async () => page.evaluate(() => document.querySelector('[role="tab"][aria-selected="true"]').id);
  const lab = async () => panel.getAttribute('aria-labelledby');
  ok((await lab()) === (await sel()), 'programs: panel labelled by the selected tab');
  ok((await tabs.first().getAttribute('aria-controls')) === (await panel.getAttribute('id')), 'programs: tab aria-controls -> panel id');
  await tabs.first().focus();
  const start = await sel();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  const second = await sel();
  ok(second !== start && (await lab()) === second, `programs: ArrowRight selects the next tab and relabels the panel (${start} -> ${second})`);
  await page.keyboard.press('End');
  await page.waitForTimeout(200);
  ok((await sel()) === (await tabs.last().getAttribute('id')), 'programs: End selects the last tab');
  await page.keyboard.press('Home');
  await page.waitForTimeout(200);
  ok((await sel()) === (await tabs.first().getAttribute('id')), 'programs: Home selects the first tab');
  await page.screenshot({ path: `${SHOT}/programs-tabs-1280.png`, clip: { x: 0, y: 60, width: 1280, height: 420 } });
  await ctx.close();
}
{
  const { ctx, page } = await open(UNDER, '/ubud-tour.html', 1280);
  ok((await page.locator('[role="tablist"], [role="tab"]').count()) === 0, 'tour page: no fake tablist');
  ok((await page.locator('nav[aria-label="Jump to section"]').count()) === 1, 'tour page: "Jump to section" is a nav');
  ok((await page.locator('nav[aria-label="Jump to section"] [aria-current="true"]').count()) <= 1, 'tour page: at most one current');
  await ctx.close();
}
{
  const { ctx, page } = await open(UNDER, '/our-company.html', 1280);
  ok((await page.locator('[role="tablist"], [role="tab"]').count()) === 0, 'our company: rail is not a fake tablist');
  ok((await page.locator('aside nav [aria-current="true"]').count()) === 1, 'our company: exactly one current section');
  await ctx.close();
}

// ---------------------------------------------------------------- 5. dialogs
console.log('5. dialogs');
{ // Modal.jsx via the Log in button on a phone (AuthModal)
  const { ctx, page } = await open(UNDER, '/tour.html', 390);
  const opener = page.locator('[data-account-slot="out"] > button');
  await opener.focus();
  await opener.click();
  await page.waitForTimeout(600);
  const dlg = page.locator('[role="dialog"][aria-modal="true"]').filter({ has: page.locator('#modal-form, form, input') }).first();
  ok((await dlg.count()) === 1 && !!(await dlg.getAttribute('aria-label')), `AuthModal: role=dialog + aria-modal + name ("${await dlg.getAttribute('aria-label')}")`);
  ok(await dlg.evaluate((n) => n === document.activeElement), 'AuthModal: focus lands on the dialog box (not a field)');
  let inside = true;
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    inside = inside && (await dlg.evaluate((n) => n.contains(document.activeElement)));
  }
  ok(inside, 'AuthModal: 14 x Tab never leaves the dialog');
  inside = true;
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Shift+Tab');
    inside = inside && (await dlg.evaluate((n) => n.contains(document.activeElement)));
  }
  ok(inside, 'AuthModal: 14 x Shift+Tab never leaves the dialog');
  await page.screenshot({ path: `${SHOT}/dialog-auth-390.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  ok((await page.locator('[role="dialog"][aria-modal="true"]:visible').count()) === 0, 'AuthModal: Escape closes it');
  ok(await opener.evaluate((n) => n === document.activeElement), 'AuthModal: focus returns to the Log in button');
  await ctx.close();
}
{ // ModalPresence via the review popup (?review=1 lands on it)
  const { ctx, page } = await open(UNDER, '/my-trips.html?review=1', 390, { loggedIn: true });
  await page.waitForTimeout(800);
  const dlg = page.locator('[role="dialog"][aria-label="Leave a review"]');
  ok((await dlg.count()) === 1, 'ReviewModal (ModalPresence): role=dialog named "Leave a review"');
  if (await dlg.count()) {
    ok(await dlg.evaluate((n) => n.getAttribute('aria-modal') === 'true'), 'ReviewModal: aria-modal');
    ok(await dlg.evaluate((n) => n === document.activeElement), 'ReviewModal: focus lands on the dialog box');
    let inside = true;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      inside = inside && (await dlg.evaluate((n) => n.contains(document.activeElement)));
    }
    ok(inside, 'ReviewModal: 20 x Tab never leaves the dialog');
    await page.screenshot({ path: `${SHOT}/dialog-review-390.png` });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    ok((await page.locator('[role="dialog"][aria-label="Leave a review"]').count()) === 0, 'ReviewModal: Escape closes it (it had no Escape before)');
  }
  await ctx.close();
}

// ---------------------------------------------------------------- 6. live regions
console.log('6. announcements');
{
  const { ctx, page } = await open(UNDER, '/ubud-tour.html', 390);
  const st = page.locator('[role="status"][aria-live="polite"]');
  ok((await st.count()) >= 1, 'tour page: toast live region is mounted before any toast');
  ok(((await st.first().textContent()) || '').trim() === '', 'tour page: it starts empty');
  await ctx.close();
}
{
  const { ctx, page } = await open(UNDER, '/our-company.html#contact', 1280);
  const btn = page.locator('#c-send');
  await btn.click();
  await page.waitForTimeout(400);
  const alerts = await page.locator('#contact-form small[role="alert"]').count();
  ok(alerts >= 3, `contact form: empty submit -> ${alerts} role=alert errors`);
  await page.screenshot({ path: `${SHOT}/contact-errors-1280.png` });
  await ctx.close();
}
{
  const { ctx, page } = await open(UNDER, '/settings.html', 1280, { loggedIn: true });
  ok((await page.locator('[role="none"].bg-line, div[role="none"]').count()) >= 1, 'settings: dividers are Separator elements');
  ok((await page.locator('hr').count()) === 0, 'settings: no raw <hr> left');
  await page.screenshot({ path: `${SHOT}/settings-1280.png` });
  await ctx.close();
}

console.log(`\n${pass}/${pass + fail}`);
sB.close(); sA.close(); await br.close();
process.exit(fail ? 1 : 0);
