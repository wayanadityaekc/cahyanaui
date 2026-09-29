// WO3 (Sep 2026): settings page grows a large avatar, "My reviews", and
// "Delete account" (deletes the account, keeps bookings + reviews - the
// confirmation modal has to say so plainly, per the brief). Run against the
// built pages: npm run build && npm run serve (port 4000).
import { chromium } from '/home/user/CUE/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

const ACC = { id: 1, name: 'Wayan Aditya', email: 'wayan@example.com', phone: '+6281234' };
const MY_REVIEWS = [
  { id: 100, service: 'Ubud Tour', rating: 5, message: 'Fantastic trip, our driver was great.', country: 'AU', status: 'approved', created_at: '2026-09-05' },
  { id: 101, service: 'Charter', rating: 4, message: 'Solid day out, would book again.', country: 'AU', status: 'hidden', created_at: '2026-08-01' },
];

let pass = 0, fail = 0;
function ok(c, m) { c ? pass++ : (fail++, console.log('  FAIL:', m)); }

async function mkCtx(w, { loggedIn = true, deleteFails = false } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1100 } });
  let deleted = false;
  await ctx.route('**/api/**', (route) => {
    const url = route.request().url();
    const method = route.request().method();
    if (url.includes('/account/session')) return route.fulfill({ json: (loggedIn && !deleted) ? { status: 'ok', account: ACC } : { status: 'error' } });
    if (url.includes('/reviews/mine')) return route.fulfill({ json: MY_REVIEWS });
    if (url.includes('/bookings/mine')) return route.fulfill({ json: { upcoming: [], history: [] } });
    if (method === 'PATCH' && url.includes('/api/account')) {
      const body = route.request().postDataJSON() || {};
      return route.fulfill({ json: { status: 'ok', account: { ...ACC, ...body } } });
    }
    if (method === 'DELETE' && url.includes('/api/account')) {
      if (deleteFails) return route.fulfill({ json: { status: 'error', detail: 'Could not delete your account. Please try again.' } });
      deleted = true;
      return route.fulfill({ json: { status: 'ok' } });
    }
    if (url.includes('/pricing/catalog')) return route.fulfill({ json: { currency: 'USD', symbol: '$', catalog: {} } });
    return route.fulfill({ json: {} });
  });
  if (loggedIn) await ctx.addInitScript(() => localStorage.setItem('cue_token', 'tok-x'));
  return ctx;
}

for (const w of [390, 1280]) {
  // ---- logged out ----
  {
    const ctx = await mkCtx(w, { loggedIn: false });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    ok(/Sign in to manage/i.test(await page.locator('[data-settings]').innerText()), `${w}/loggedout: expected sign-in prompt`);
    await page.screenshot({ path: `shots/settings-loggedout-${w}.png` });
    ok(errs.length === 0, `${w}/loggedout: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }

  // ---- logged in ----
  {
    const ctx = await mkCtx(w, { loggedIn: true });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const root = page.locator('[data-settings]');
    ok((await root.innerText()).includes(ACC.name), `${w}/loggedin: name not shown`);
    ok((await root.innerText()).includes(ACC.email), `${w}/loggedin: email not shown`);
    // large avatar present with initials
    const avatarText = await page.locator('[data-settings] span.bg-gold').first().innerText();
    ok(avatarText.trim().length > 0, `${w}/loggedin: avatar initials empty`);
    // my reviews rendered
    await page.waitForTimeout(300);
    ok((await root.innerText()).includes('Fantastic trip'), `${w}/loggedin: my review text missing`);
    ok((await root.innerText()).includes('Not currently shown'), `${w}/loggedin: hidden-review note missing`);
    await page.screenshot({ path: `shots/settings-loggedin-${w}.png`, fullPage: true });

    // edit + save
    await page.fill('#st-name', 'Wayan Edited');
    await page.locator('button', { hasText: 'Save changes' }).click();
    await page.waitForTimeout(400);
    ok((await root.innerText()).includes('Saved.'), `${w}/loggedin: save did not confirm`);

    ok(errs.length === 0, `${w}/loggedin: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }

  // ---- delete account flow: open modal, cancel ----
  {
    const ctx = await mkCtx(w, { loggedIn: true });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.locator('button', { hasText: 'Delete account' }).click();
    await page.waitForTimeout(400);
    const dlg = page.locator('[role="dialog"][aria-label="Delete your account?"]');
    ok(await dlg.isVisible(), `${w}/delete-cancel: confirmation modal did not open`);
    const dlgText = await dlg.innerText();
    ok(/stay published/i.test(dlgText) || /stay on record/i.test(dlgText), `${w}/delete-cancel: modal doesn't explain what stays`);
    await page.screenshot({ path: `shots/settings-delete-modal-${w}.png` });
    await page.locator('button', { hasText: 'Keep my account' }).click();
    await page.waitForTimeout(400);
    ok(!(await dlg.isVisible()), `${w}/delete-cancel: modal did not close on cancel`);
    ok((await page.locator('[data-settings]').innerText()).includes(ACC.email), `${w}/delete-cancel: account got deleted on cancel`);
    ok(errs.length === 0, `${w}/delete-cancel: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }

  // ---- delete account flow: confirm, server fails ----
  {
    const ctx = await mkCtx(w, { loggedIn: true, deleteFails: true });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.locator('button', { hasText: 'Delete account' }).click();
    await page.waitForTimeout(300);
    await page.locator('button', { hasText: 'Delete my account' }).click();
    await page.waitForTimeout(500);
    const dlg = page.locator('[role="dialog"][aria-label="Delete your account?"]');
    ok(await dlg.isVisible(), `${w}/delete-fail: modal closed even though the server refused`);
    ok(/Could not delete/i.test(await dlg.innerText()), `${w}/delete-fail: no error message shown`);
    ok(errs.length === 0, `${w}/delete-fail: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }

  // ---- delete account flow: confirm, succeeds ----
  {
    const ctx = await mkCtx(w, { loggedIn: true, deleteFails: false });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto('http://127.0.0.1:4000/settings.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.locator('button', { hasText: 'Delete account' }).click();
    await page.waitForTimeout(300);
    await page.locator('button', { hasText: 'Delete my account' }).click();
    await page.waitForTimeout(700);
    const root = page.locator('[data-settings]');
    ok(/account has been deleted/i.test(await root.innerText()), `${w}/delete-ok: no deletion confirmation shown`);
    ok(!(/Sign in to manage/i.test(await root.innerText())), `${w}/delete-ok: fell through to the generic sign-in message instead of a real confirmation`);
    const tok = await page.evaluate(() => localStorage.getItem('cue_token'));
    ok(!tok, `${w}/delete-ok: token not cleared after delete (${tok})`);
    await page.screenshot({ path: `shots/settings-deleted-${w}.png` });
    ok(errs.length === 0, `${w}/delete-ok: page errors ${errs.join(' | ')}`);
    await ctx.close();
  }
}

await b.close();
console.log(`${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
