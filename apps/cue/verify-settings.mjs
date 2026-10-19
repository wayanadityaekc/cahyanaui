import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

const ACC = { id: 1, name: 'Wayan Aditya', email: 'wayan@example.com', phone: '+6281234' };
const MY_REVIEWS = [
  {
    id: 100,
    service: 'Ubud Tour',
    rating: 5,
    message: 'Fantastic trip, our driver was great.',
    country: 'AU',
    status: 'approved',
    created_at: '2026-09-05',
  },
  {
    id: 101,
    service: 'Charter',
    rating: 4,
    message: 'Solid day out, would book again.',
    country: 'AU',
    status: 'hidden',
    created_at: '2026-08-01',
  },
];

let pass = 0,
  fail = 0;
function ok(isPassing, message) {
  isPassing ? pass++ : (fail++, console.log('  FAIL:', message));
}

async function mkCtx(viewportWidth, { loggedIn = true, deleteFails = false } = {}) {
  const browserContext = await browser.newContext({ viewport: { width: viewportWidth, height: 1100 } });
  let deleted = false;
  await browserContext.route('**/api/**', (route) => {
    const url = route.request().url();
    const method = route.request().method();
    if (url.includes('/account/session'))
      return route.fulfill({ json: loggedIn && !deleted ? { status: 'ok', account: ACC } : { status: 'error' } });
    if (url.includes('/reviews/mine')) return route.fulfill({ json: MY_REVIEWS });
    if (url.includes('/bookings/mine')) return route.fulfill({ json: { upcoming: [], history: [] } });
    if (method === 'PATCH' && url.includes('/api/account')) {
      const body = route.request().postDataJSON() || {};
      return route.fulfill({ json: { status: 'ok', account: { ...ACC, ...body } } });
    }
    if (method === 'DELETE' && url.includes('/api/account')) {
      if (deleteFails)
        return route.fulfill({ json: { status: 'error', detail: 'Could not delete your account. Please try again.' } });
      deleted = true;
      return route.fulfill({ json: { status: 'ok' } });
    }
    if (url.includes('/pricing/catalog')) return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
    return route.fulfill({ json: {} });
  });
  if (loggedIn) await browserContext.addInitScript(() => localStorage.setItem('cue_token', 'tok-x'));
  return browserContext;
}

for (const width of [390, 1280]) {
  {
    const browserContext = await mkCtx(width, { loggedIn: false });
    const page = await browserContext.newPage();
    const errs = [];
    page.on('pageerror', (error) => errs.push(String(error)));
    await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    ok(
      /Sign in to manage/i.test(await page.locator('[data-settings]').innerText()),
      `${width}/loggedout: expected sign-in prompt`,
    );
    await page.screenshot({ path: `shots/settings-loggedout-${width}.png` });
    ok(errs.length === 0, `${width}/loggedout: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }

  {
    const browserContext = await mkCtx(width, { loggedIn: true });
    const page = await browserContext.newPage();
    const errs = [];
    page.on('pageerror', (error) => errs.push(String(error)));
    await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const root = page.locator('[data-settings]');
    ok((await root.innerText()).includes(ACC.name), `${width}/loggedin: name not shown`);
    ok((await root.innerText()).includes(ACC.email), `${width}/loggedin: email not shown`);
    const avatarText = await page.locator('[data-settings] span.bg-gold').first().innerText();
    ok(avatarText.trim().length > 0, `${width}/loggedin: avatar initials empty`);
    await page.waitForTimeout(300);
    ok((await root.innerText()).includes('Fantastic trip'), `${width}/loggedin: my review text missing`);
    ok((await root.innerText()).includes('Not currently shown'), `${width}/loggedin: hidden-review note missing`);
    await page.screenshot({ path: `shots/settings-loggedin-${width}.png`, fullPage: true });

    await page.fill('#st-name', 'Wayan Edited');
    await page.locator('button', { hasText: 'Save changes' }).click();
    await page.waitForTimeout(400);
    ok((await root.innerText()).includes('Saved.'), `${width}/loggedin: save did not confirm`);

    ok(errs.length === 0, `${width}/loggedin: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }

  {
    const browserContext = await mkCtx(width, { loggedIn: true });
    const page = await browserContext.newPage();
    const errs = [];
    page.on('pageerror', (error) => errs.push(String(error)));
    await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.locator('button', { hasText: 'Delete account' }).click();
    await page.waitForTimeout(400);
    const dlg = page.locator('[role="dialog"][aria-label="Delete your account?"]');
    ok(await dlg.isVisible(), `${width}/delete-cancel: confirmation modal did not open`);
    const dlgText = await dlg.innerText();
    ok(
      /stay published/i.test(dlgText) || /stay on record/i.test(dlgText),
      `${width}/delete-cancel: modal doesn't explain what stays`,
    );
    await page.screenshot({ path: `shots/settings-delete-modal-${width}.png` });
    await page.locator('button', { hasText: 'Keep my account' }).click();
    await page.waitForTimeout(400);
    ok(!(await dlg.isVisible()), `${width}/delete-cancel: modal did not close on cancel`);
    ok(
      (await page.locator('[data-settings]').innerText()).includes(ACC.email),
      `${width}/delete-cancel: account got deleted on cancel`,
    );
    ok(errs.length === 0, `${width}/delete-cancel: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }

  {
    const browserContext = await mkCtx(width, { loggedIn: true, deleteFails: true });
    const page = await browserContext.newPage();
    const errs = [];
    page.on('pageerror', (error) => errs.push(String(error)));
    await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.locator('button', { hasText: 'Delete account' }).click();
    await page.waitForTimeout(300);
    await page.locator('button', { hasText: 'Delete my account' }).click();
    await page.waitForTimeout(500);
    const dlg = page.locator('[role="dialog"][aria-label="Delete your account?"]');
    ok(await dlg.isVisible(), `${width}/delete-fail: modal closed even though the server refused`);
    ok(/Could not delete/i.test(await dlg.innerText()), `${width}/delete-fail: no error message shown`);
    ok(errs.length === 0, `${width}/delete-fail: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }

  {
    const browserContext = await mkCtx(width, { loggedIn: true, deleteFails: false });
    const page = await browserContext.newPage();
    const errs = [];
    page.on('pageerror', (error) => errs.push(String(error)));
    await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.locator('button', { hasText: 'Delete account' }).click();
    await page.waitForTimeout(300);
    await page.locator('button', { hasText: 'Delete my account' }).click();
    await page.waitForTimeout(700);
    const root = page.locator('[data-settings]');
    ok(/account has been deleted/i.test(await root.innerText()), `${width}/delete-ok: no deletion confirmation shown`);
    ok(
      !/Sign in to manage/i.test(await root.innerText()),
      `${width}/delete-ok: fell through to the generic sign-in message instead of a real confirmation`,
    );
    const tok = await page.evaluate(() => localStorage.getItem('cue_token'));
    ok(!tok, `${width}/delete-ok: token not cleared after delete (${tok})`);
    await page.screenshot({ path: `shots/settings-deleted-${width}.png` });
    ok(errs.length === 0, `${width}/delete-ok: page errors ${errs.join(' | ')}`);
    await browserContext.close();
  }
}

await browser.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
