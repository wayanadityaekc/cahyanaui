import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-core';

const BEFORE = process.env.BEFORE || '/tmp/claude-0/out-before';
const AFTER = process.env.AFTER || '/home/user/CUE/out';
const SHOT = process.env.SHOT || '/tmp/claude-0/-home-user/b39e23b2-cabe-5327-8412-a80a03834acc/scratchpad/wo7';
fs.mkdirSync(SHOT, { recursive: true });

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};
function serve(root, port) {
  return new Promise((result) => {
    const server = http
      .createServer((request, rsp) => {
        let urlPath = decodeURIComponent(request.url.split('?')[0]);
        if (urlPath.endsWith('/')) urlPath += 'index.html';
        let filePath = path.join(root, urlPath);
        if (!fs.existsSync(filePath) && !path.extname(filePath)) filePath = path.join(root, `${urlPath}.html`);
        const isOutsideServedRoot =
          !filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory();
        if (isOutsideServedRoot) {
          rsp.writeHead(404);
          return rsp.end('nf');
        }
        rsp.writeHead(200, { 'content-type': MIME[path.extname(filePath)] || 'application/octet-stream' });
        rsp.end(fs.readFileSync(filePath));
      })
      .listen(port, () => result(server));
  });
}
const sB = await serve(BEFORE, 4711);
const sA = await serve(AFTER, 4712);
const OLD = 'http://127.0.0.1:4711';
const NEW = 'http://127.0.0.1:4712';
const UNDER = process.env.UNDER === 'before' ? OLD : NEW;

let pass = 0,
  fail = 0;
function recordCheck(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}
function logInfo(message) {
  return console.log('  ..', message);
}
const br = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

const MINE = {
  upcoming: [],
  history: [
    {
      ref: 'CUE-100',
      name: 'Ubud Tour',
      start_date: '2026-08-20',
      end_date: '2026-08-20',
      guests: '2',
      price_usd: 40,
      price_idr: 700000,
      status: 'new',
      upcoming: false,
      review_items: ['Ubud Tour'],
      lines: [{ type: 'tour', service: 'Ubud Tour', date: '2026-08-20', guests: '2' }],
    },
  ],
};
function buildApiRoute(loggedIn) {
  return async (route) => {
    const requestUrl = route.request().url();
    function respondJson(responseBody) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(responseBody) });
    }
    if (requestUrl.includes('/account/session') || requestUrl.includes('/account/me'))
      return respondJson(
        loggedIn ? { status: 'ok', account: { id: 7, name: 'Wayan', email: 'w@e.com', phone: '' } } : { account: null },
      );
    if (requestUrl.includes('/bookings/mine')) return respondJson(MINE);
    return respondJson({});
  };
}
async function open(base, url, viewportWidth, { loggedIn = false, h: viewportHeight = 900 } = {}) {
  const browserContext = await br.newContext({ viewport: { width: viewportWidth, height: viewportHeight } });
  if (loggedIn) await browserContext.addInitScript(() => localStorage.setItem('cue_token', 'stub-token'));
  await browserContext.route('**/api/**', buildApiRoute(loggedIn));
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error).slice(0, 120)));
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  return { ctx: browserContext, page, errs };
}

console.log('1. border colours + layout, before vs after');
const HEX = /rgb\((\d+), (\d+), (\d+)\)/;
function convertColorToHex(colorValue) {
  const hexMatch = HEX.exec(colorValue);
  return hexMatch
    ? `#${[1, 2, 3].map((channelIndex) => (+hexMatch[channelIndex]).toString(16).padStart(2, '0')).join('')}`
    : colorValue;
}
const PAGES = [
  '/',
  '/tour.html',
  '/destinations.html',
  '/activities.html',
  '/ubud-tour.html',
  '/attractions/monkey-forest.html',
  '/charter.html',
  '/transfer.html',
  '/airport-transfer.html',
  '/our-company.html',
  '/bali-guide.html',
  '/guide/ubud.html',
  '/my-trips.html',
  '/settings.html',
];
async function measure(base, url, viewportWidth) {
  const { ctx: browserContext, page } = await open(base, url, viewportWidth, { loggedIn: true });
  const measurement = await page.evaluate(() => {
    const hist = {};
    document.querySelectorAll('body *').forEach((element) => {
      const cs = getComputedStyle(element);
      ['Top', 'Right', 'Bottom', 'Left'].forEach((side) => {
        if (!(parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== 'none')) return;
        const borderKey = `${cs[`border${side}Color`]}|${cs[`border${side}Style`]}`;
        hist[borderKey] = (hist[borderKey] || 0) + 1;
      });
    });
    return { hist, h: document.documentElement.scrollHeight, over: document.documentElement.scrollWidth - innerWidth };
  });
  await browserContext.close();
  return measurement;
}
const OFF = ['#f2efe7', '#eeeeee', '#ece6d8', '#e6dfce', '#e2ddd0', '#ececec', '#e6e6e6', '#e4dcc8', '#e0ddd4'];
const LINE = '#e7e4dd';
let gainedTotal = 0,
  lostTotal = 0;
const heightDiffs = [];
for (const width of [390, 1280]) {
  for (const url of PAGES) {
    const oldMeasurement = await measure(OLD, url, width);
    const newMeasurement = await measure(NEW, url, width);
    function normalizeHistogram(histogram) {
      return Object.fromEntries(
        Object.entries(histogram).map(([key, value]) => {
          const [color, st] = key.split('|');
          return [`${convertColorToHex(color)}|${st}`, value];
        }),
      );
    }
    const ha = normalizeHistogram(oldMeasurement.hist),
      hb = normalizeHistogram(newMeasurement.hist);
    let lost = 0,
      gained = 0;
    OFF.forEach((offBorder) => {
      Object.keys(ha).forEach((key) => {
        if (key.startsWith(`${offBorder}|`)) lost += (ha[key] || 0) - (hb[key] || 0);
      });
    });
    const lineA = Object.entries(ha)
      .filter(([key]) => key.startsWith(LINE))
      .reduce((runningTotal, [, count]) => runningTotal + count, 0);
    const lineB = Object.entries(hb)
      .filter(([key]) => key.startsWith(LINE))
      .reduce((runningTotal, [, count]) => runningTotal + count, 0);
    gained = lineB - lineA;
    lostTotal += lost;
    gainedTotal += gained;
    OFF.forEach((offBorder) => {
      recordCheck(
        !Object.keys(hb).some((key) => key.startsWith(`${offBorder}|`)),
        `${url}@${width}: no ${offBorder} border left`,
      );
    });
    const expect = url === '/settings.html' ? lost - 2 : lost;
    recordCheck(
      gained === expect,
      `${url}@${width}: --line gained ${gained} = off-token lost ${lost}${url === '/settings.html' ? ' - 2 hr' : ''}`,
    );
    if (oldMeasurement.h !== newMeasurement.h)
      heightDiffs.push(`${url}@${width}: ${oldMeasurement.h} -> ${newMeasurement.h}`);
    recordCheck(newMeasurement.over <= 0, `${url}@${width}: no horizontal overflow (${newMeasurement.over})`);
    function filterRemainingBorders(histogram) {
      return Object.fromEntries(
        Object.entries(histogram).filter(
          ([key]) => !OFF.some((offBorder) => key.startsWith(`${offBorder}|`)) && !key.startsWith(LINE),
        ),
      );
    }
    recordCheck(
      JSON.stringify(filterRemainingBorders(ha)) === JSON.stringify(filterRemainingBorders(hb)),
      `${url}@${width}: every other border unchanged`,
    );
  }
}
logInfo(`off-token borders moved onto --line: ${lostTotal} (line gained ${gainedTotal})`);
recordCheck(heightDiffs.length === 0, `document heights unchanged (${heightDiffs.join('; ') || 'all equal'})`);

console.log('2. cards do not move on hover');
async function measureHoverShift(base, url, viewportWidth, selector) {
  const { ctx: browserContext, page } = await open(base, url, viewportWidth);
  const elements = page.locator(selector);
  const elementCount = Math.min(await elements.count(), 3);
  const sampledElements = [];
  for (let elementIndex = 0; elementIndex < elementCount; elementIndex++) {
    const element = elements.nth(elementIndex);
    await element.scrollIntoViewIfNeeded();
    await page.mouse.move(2, 2);
    await page.waitForTimeout(350);
    const r0 = await element.boundingBox();
    await element.hover();
    await page.waitForTimeout(450);
    const r1 = await element.boundingBox();
    sampledElements.push(Math.abs(r1.y - r0.y) + Math.abs(r1.x - r0.x));
  }
  await browserContext.close();
  return sampledElements;
}
const CARD_SELS = [
  ['/', '.hcard'],
  ['/bali-guide.html', '[class*="shadow-card"]'],
  ['/ubud-tour.html', '[class*="shadow-card"]'],
];
let movedBefore = 0;
for (const [url, selector] of CARD_SELS) {
  const before = await measureHoverShift(OLD, url, 1280, selector);
  const after = await measureHoverShift(NEW, url, 1280, selector);
  movedBefore += before.filter((offset) => offset > 0.5).length;
  recordCheck(
    after.length > 0 && after.every((offset) => offset < 0.5),
    `${url} ${selector}: after = no movement (${after.map((offset) => offset.toFixed(1))}) [before ${before.map((offset) => offset.toFixed(1))}]`,
  );
}
recordCheck(movedBefore > 0, `the check can fail: ${movedBefore} card(s) lifted on the BEFORE build`);

console.log('3. menus are disclosures');
for (const loggedIn of [false, true]) {
  const { ctx: browserContext, page, errs } = await open(UNDER, '/tour.html', 1280, { loggedIn });
  const slot = page.locator(`[data-account-slot="${loggedIn ? 'in' : 'out'}"] > button`);
  await slot.click();
  await page.waitForTimeout(450);
  const runningTotal = await page.evaluate(() => ({
    menus: document.querySelectorAll('[role="menu"], [role="menuitem"]').length,
    haspopup: document.querySelectorAll('[aria-haspopup="menu"]').length,
  }));
  const ctl = await slot.getAttribute('aria-controls');
  recordCheck(
    runningTotal.menus === 0 && runningTotal.haspopup === 0,
    `account (${loggedIn ? 'in' : 'out'}): no role=menu/menuitem/haspopup`,
  );
  recordCheck(
    (await slot.getAttribute('aria-expanded')) === 'true' &&
      !!ctl &&
      (await page.locator(`[id="${ctl}"]`).count()) === 1,
    `account (${loggedIn ? 'in' : 'out'}): aria-expanded + aria-controls -> real panel`,
  );
  await page.screenshot({
    path: `${SHOT}/menu-${loggedIn ? 'in' : 'out'}-1280.png`,
    clip: { x: 780, y: 0, width: 500, height: 520 },
  });
  if (loggedIn) {
    const seps = await page.locator(`[id="${ctl}"] [role="none"]`).count();
    recordCheck(seps >= 2, `account (in): group lines are Separator elements (${seps})`);
    recordCheck(
      (await page.locator(`[id="${ctl}"] a[href="/settings.html"]`).count()) === 1,
      'account (in): Settings is a plain link',
    );
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  recordCheck(
    (await slot.getAttribute('aria-expanded')) === 'false',
    `account (${loggedIn ? 'in' : 'out'}): Escape closes`,
  );
  recordCheck(
    await page.evaluate(() => document.activeElement === document.querySelector('[data-account-slot] > button')),
    `account (${loggedIn ? 'in' : 'out'}): Escape returns focus to the trigger`,
  );
  recordCheck(errs.length === 0, `account menu: no page errors ${errs}`);
  await browserContext.close();
}
{
  const { ctx: browserContext, page } = await open(UNDER, '/tour.html', 1280);
  const prog = page.locator('[data-desktop-nav] button[aria-controls]');
  await prog.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const pid = await prog.getAttribute('aria-controls');
  recordCheck((await page.locator(`[id="${pid}"] a`).count()) >= 4, 'Program list: links in the aria-controls panel');
  recordCheck(
    (await page.locator('[data-desktop-nav] [role]').count()) === 0,
    'Program list: no ARIA roles on the desktop nav',
  );
  await page.screenshot({ path: `${SHOT}/program-1280.png`, clip: { x: 0, y: 0, width: 700, height: 340 } });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  recordCheck(
    await page.evaluate(() => document.activeElement?.textContent?.trim().startsWith('Program')),
    'Program list: Escape returns focus to the trigger',
  );
  await browserContext.close();
}

console.log('4. tabs only where they are tabs');
{
  const { ctx: browserContext, page } = await open(UNDER, '/ubud-tour.html', 1280);
  recordCheck((await page.locator('[role="tablist"], [role="tab"]').count()) === 0, 'tour page: no fake tablist');
  recordCheck(
    (await page.locator('nav[aria-label="Jump to section"]').count()) === 1,
    'tour page: "Jump to section" is a nav',
  );
  recordCheck(
    (await page.locator('nav[aria-label="Jump to section"] [aria-current="true"]').count()) <= 1,
    'tour page: at most one current',
  );
  await browserContext.close();
}
{
  const { ctx: browserContext, page } = await open(UNDER, '/our-company.html', 1280);
  recordCheck(
    (await page.locator('[role="tablist"], [role="tab"]').count()) === 0,
    'our company: rail is not a fake tablist',
  );
  recordCheck(
    (await page.locator('aside nav [aria-current="true"]').count()) === 1,
    'our company: exactly one current section',
  );
  await browserContext.close();
}

console.log('5. dialogs');
{
  const { ctx: browserContext, page } = await open(UNDER, '/tour.html', 390);
  const opener = page.locator('[data-account-slot="out"] > button');
  await opener.focus();
  await opener.click();
  await page.waitForTimeout(600);
  const dlg = page
    .locator('[role="dialog"][aria-modal="true"]')
    .filter({ has: page.locator('#modal-form, form, input') })
    .first();
  recordCheck(
    (await dlg.count()) === 1 && !!(await dlg.getAttribute('aria-label')),
    `AuthModal: role=dialog + aria-modal + name ("${await dlg.getAttribute('aria-label')}")`,
  );
  recordCheck(
    await dlg.evaluate((dialogNode) => dialogNode === document.activeElement),
    'AuthModal: focus lands on the dialog box (not a field)',
  );
  let inside = true;
  for (let tabPressCount = 0; tabPressCount < 14; tabPressCount++) {
    await page.keyboard.press('Tab');
    inside = inside && (await dlg.evaluate((dialogNode) => dialogNode.contains(document.activeElement)));
  }
  recordCheck(inside, 'AuthModal: 14 x Tab never leaves the dialog');
  inside = true;
  for (let tabPressCount = 0; tabPressCount < 14; tabPressCount++) {
    await page.keyboard.press('Shift+Tab');
    inside = inside && (await dlg.evaluate((dialogNode) => dialogNode.contains(document.activeElement)));
  }
  recordCheck(inside, 'AuthModal: 14 x Shift+Tab never leaves the dialog');
  await page.screenshot({ path: `${SHOT}/dialog-auth-390.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  recordCheck(
    (await page.locator('[role="dialog"][aria-modal="true"]:visible').count()) === 0,
    'AuthModal: Escape closes it',
  );
  recordCheck(
    await opener.evaluate((dialogNode) => dialogNode === document.activeElement),
    'AuthModal: focus returns to the Log in button',
  );
  await browserContext.close();
}
{
  const { ctx: browserContext, page } = await open(UNDER, '/my-trips.html?review=1', 390, { loggedIn: true });
  await page.waitForTimeout(800);
  const dlg = page.locator('[role="dialog"][aria-label="Leave a review"]');
  recordCheck((await dlg.count()) === 1, 'ReviewModal (ModalPresence): role=dialog named "Leave a review"');
  if (await dlg.count()) {
    recordCheck(
      await dlg.evaluate((dialogNode) => dialogNode.getAttribute('aria-modal') === 'true'),
      'ReviewModal: aria-modal',
    );
    recordCheck(
      await dlg.evaluate((dialogNode) => dialogNode === document.activeElement),
      'ReviewModal: focus lands on the dialog box',
    );
    let inside = true;
    for (let tabPressCount = 0; tabPressCount < 20; tabPressCount++) {
      await page.keyboard.press('Tab');
      inside = inside && (await dlg.evaluate((dialogNode) => dialogNode.contains(document.activeElement)));
    }
    recordCheck(inside, 'ReviewModal: 20 x Tab never leaves the dialog');
    await page.screenshot({ path: `${SHOT}/dialog-review-390.png` });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    recordCheck(
      (await page.locator('[role="dialog"][aria-label="Leave a review"]').count()) === 0,
      'ReviewModal: Escape closes it (it had no Escape before)',
    );
  }
  await browserContext.close();
}

console.log('6. announcements');
{
  const { ctx: browserContext, page } = await open(UNDER, '/ubud-tour.html', 390);
  const st = page.locator('[role="status"][aria-live="polite"]');
  recordCheck((await st.count()) >= 1, 'tour page: toast live region is mounted before any toast');
  recordCheck(((await st.first().textContent()) || '').trim() === '', 'tour page: it starts empty');
  await browserContext.close();
}
{
  const { ctx: browserContext, page } = await open(UNDER, '/our-company.html#contact', 1280);
  const button = page.locator('#c-send');
  await button.click();
  await page.waitForTimeout(400);
  const alerts = await page.locator('#contact-form small[role="alert"]').count();
  recordCheck(alerts >= 3, `contact form: empty submit -> ${alerts} role=alert errors`);
  await page.screenshot({ path: `${SHOT}/contact-errors-1280.png` });
  await browserContext.close();
}
{
  const { ctx: browserContext, page } = await open(UNDER, '/settings.html', 1280, { loggedIn: true });
  recordCheck(
    (await page.locator('[role="none"].bg-line, div[role="none"]').count()) >= 1,
    'settings: dividers are Separator elements',
  );
  recordCheck((await page.locator('hr').count()) === 0, 'settings: no raw <hr> left');
  await page.screenshot({ path: `${SHOT}/settings-1280.png` });
  await browserContext.close();
}

console.log(`\n${pass}/${pass + fail}`);
sB.close();
sA.close();
await br.close();
process.exit(fail ? 1 : 0);
