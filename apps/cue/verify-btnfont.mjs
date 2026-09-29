import { chromium } from 'playwright-core';
const B = 'http://127.0.0.1:4000';
let pass = 0, fail = 0;
function ok(c, m) { c ? pass++ : fail++; console.log(`${c ? 'ok  ' : 'FAIL'} ${m}`); }
function near(a, b) { return Math.abs(a - b) < 0.5; }   // --btn-h resolves to 33.5938

const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

// Read the tokens the PAGE resolves, via a throwaway element - hard-coding the
// numbers here would only prove the harness agrees with itself.
function tokens(p) {
  return p.evaluate(() => {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;height:var(--btn-h);font-size:var(--fs-small);border-radius:var(--r-sm);color:var(--color-cta)';
    document.body.appendChild(d);
    const c = getComputedStyle(d);
    const t = { h: parseFloat(c.height), font: c.fontSize, radius: c.borderTopLeftRadius, cta: c.color };
    d.remove();
    return t;
  });
}

function shot(el) {
  return el.evaluate((n) => {
    const c = getComputedStyle(n), r = n.getBoundingClientRect();
    return {
      h: Math.round(r.height * 10) / 10, bg: c.backgroundColor, color: c.color,
      radius: c.borderTopLeftRadius, font: c.fontSize,
      family: c.fontFamily.split(',')[0].replace(/["']/g, ''), weight: c.fontWeight,
      display: c.display, align: c.alignItems, justify: c.justifyContent,
      textAlign: c.textAlign, padTop: c.paddingTop, padBottom: c.paddingBottom,
      oneLine: n.scrollWidth <= n.clientWidth + 1,
    };
  });
}

const acc = { name: 'Wayan', email: 'w@example.com', phone: '' };
function json(body) { return ({ status: 200, contentType: 'application/json', body: JSON.stringify(body) }); }
// ONE handler that branches, not several patterns: in Playwright the route
// registered LAST wins, so a catch-all added after the specific ones swallows
// them - which is how the first run of this harness measured a page that only
// said "Sign in" and blamed the app. The catch-all matters on its own too: a
// harness that reaches the real production API measures someone else's data.
function api(r) {
  const u = r.request().url();
  if (u.includes('/account/session')) return r.fulfill(json({ account: acc }));
  if (u.includes('/bookings/mine')) return r.fulfill(json({ bookings: [] }));
  return r.fulfill(json({}));
}

for (const w of [320, 390, 768, 1280]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 880 } });
  await ctx.addInitScript(() => localStorage.setItem('cue_token', 'stub-token'));
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.route('**/api/**', api);

  await page.goto(`${B}/settings.html`, { waitUntil: 'load' });
  await page.waitForSelector('[data-settings] button', { timeout: 15000 });
  const T = await tokens(page);

  // Pick by ROLE, not by index. [data-settings] also holds the Guests dropdown
  // trigger, and it is the FIRST button in the DOM - nth(0) measured that instead
  // and reported the CTA as white/left-aligned. Same lesson as the Done-button
  // harness in CLAUDE.md: the CTA is the button that is NOT [aria-haspopup].
  const acts = page.locator('[data-settings] button:not([aria-haspopup])');
  const n = await acts.count();
  // WO3 (Sep 2026): settings grew a third action, "Delete account" - was 2.
  ok(n === 3, `${w}: settings punya 3 tombol aksi (dapet ${n})`);

  const save = acts.filter({ hasText: 'Save changes' });
  const out = acts.filter({ hasText: 'Sign out' });
  const del = acts.filter({ hasText: 'Delete account' });
  ok(await save.count() === 1, `${w}: ketemu tepat 1 tombol Save changes`);
  ok(await out.count() === 1, `${w}: ketemu tepat 1 tombol Sign out`);
  ok(await del.count() === 1, `${w}: ketemu tepat 1 tombol Delete account`);

  const s = await shot(save), o = await shot(out);
  console.log(`     save=${JSON.stringify(s)}`);
  console.log(`     out =${JSON.stringify(o)}`);

  ok(near(s.h, T.h), `${w}: Save tingginya --btn-h (${T.h}, dapet ${s.h})`);
  ok(s.font === T.font, `${w}: Save font --fs-small (${T.font})`);
  ok(s.radius === T.radius, `${w}: Save radius --r-sm (${T.radius}, dapet ${s.radius})`);
  ok(s.bg === T.cta, `${w}: Save bg --color-cta (${T.cta}, dapet ${s.bg})`);
  ok(s.color === 'rgb(255, 255, 255)', `${w}: Save teksnya putih (dapet ${s.color})`);
  ok(s.weight === '600', `${w}: Save bobot 600 (dapet ${s.weight})`);
  ok(s.family === 'Inter', `${w}: Save font Inter, bukan font browser (dapet ${s.family})`);
  ok(s.align === 'center' && s.justify === 'center' && s.textAlign === 'center',
    `${w}: Save ke-center dua arah (${s.align}/${s.justify}/${s.textAlign})`);
  ok(s.padTop === '0px' && s.padBottom === '0px', `${w}: Save py-0`);
  ok(s.display.includes('flex'), `${w}: Save display flex (dapet ${s.display})`);
  ok(s.oneLine, `${w}: label Save 1 baris`);

  // The complaint was that it did not look like a button next to the other one.
  ok(near(s.h, o.h), `${w}: Save & Sign out tingginya SAMA (${s.h} vs ${o.h})`);
  ok(s.radius === o.radius, `${w}: radius sama (${s.radius})`);
  ok(s.font === o.font, `${w}: ukuran teks sama (${s.font})`);
  ok(s.family === o.family, `${w}: font family sama (${s.family} vs ${o.family})`);
  ok(s.weight === o.weight, `${w}: bobot sama (${s.weight})`);
  // ...but primary and secondary must still READ as different roles.
  ok(s.bg !== o.bg, `${w}: warna primary != secondary (${s.bg} vs ${o.bg})`);

  // Delete account: same geometry family (BTN_SM), own colour (danger, not
  // primary/secondary) - same checks the other two get, not a free pass.
  const d = await shot(del);
  console.log(`     del =${JSON.stringify(d)}`);
  ok(near(d.h, T.h), `${w}: Delete tingginya --btn-h (${T.h}, dapet ${d.h})`);
  ok(d.font === T.font, `${w}: Delete font --fs-small (${T.font})`);
  ok(d.family === 'Inter', `${w}: Delete font Inter, bukan font browser (dapet ${d.family})`);
  ok(d.weight === '600', `${w}: Delete bobot 600 (dapet ${d.weight})`);
  ok(d.align === 'center' && d.justify === 'center' && d.textAlign === 'center',
    `${w}: Delete ke-center dua arah (${d.align}/${d.justify}/${d.textAlign})`);
  ok(d.oneLine, `${w}: label Delete 1 baris`);
  // Delete is a ghost/outline button too, same white bg as Sign out (both are
  // secondary in SHAPE) - what has to differ is the TEXT colour, since that's
  // what actually reads as "this one is dangerous".
  ok(d.bg !== s.bg, `${w}: warna latar Delete != Save (${d.bg})`);
  ok(d.color !== o.color, `${w}: warna teks Delete != Sign out (${d.color})`);

  const bs = await save.boundingBox(), bo = await out.boundingBox();
  ok(bo.x >= bs.x + bs.width - 0.5 || bo.y >= bs.y + bs.height - 0.5,
    `${w}: dua tombol gak ketumpuk`);
  ok(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth) <= 0,
    `${w}: /settings gak melar`);
  ok(errs.length === 0, `${w}: /settings nol page error${errs[0] ? ` :: ${errs[0]}` : ''}`);
  await ctx.close();
}

// Site-wide rule: nothing shaped like the one-size action button may fall back to
// the browser font. That is what made this bug invisible - nobody greps for a
// missing class, and 19px/Arial only shows up when you measure.
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.route('**/api/**', api);
  const pages = ['/', '/index.html', '/tour.html', '/ubud-tour.html', '/charter.html', '/transfer.html',
    '/airport-transfer.html', '/our-company.html', '/my-trips.html', '/bali-guide.html',
    '/itinerary.html', '/settings.html', '/activities.html', '/destinations.html'];
  let seen = 0;
  const odd = [];
  for (const p of pages) {
    const r = await page.goto(B + p, { waitUntil: 'load' });
    ok(r.status() === 200, `sweep ${p}: HTTP 200`);
    await page.waitForTimeout(500);
    const rows = await page.evaluate(() => {
      const out = [];
      for (const b of document.querySelectorAll('button, a')) {
        const bb = b.getBoundingClientRect();
        if (bb.width < 40 || bb.height < 20) continue;
        const c = getComputedStyle(b);
        if (c.visibility === 'hidden' || c.display === 'none') continue;
        if (Math.round(parseFloat(c.height)) !== 34 || c.fontWeight !== '600') continue;
        out.push({ fam: c.fontFamily.split(',')[0].replace(/["']/g, ''), t: (b.textContent || '').trim().slice(0, 24) });
      }
      return out;
    });
    seen += rows.length;
    for (const x of rows) if (x.fam !== 'Inter') odd.push(`${p} "${x.t}" -> ${x.fam}`);
  }
  ok(seen > 40, `sweep: ada tombol aksi yang ke-ukur (${seen})`);
  ok(odd.length === 0, `sweep: nol tombol aksi pakai font browser${odd.length ? ` :: ${odd.join(' | ')}` : ''}`);
  // No exceptions left. This used to carry a named #418 exception for /index.html;
  // the cause is fixed (lib/pathname.js), so a page error here is a real one again.
  ok(errs.length === 0, `sweep: nol page error${errs[0] ? ` :: ${errs[0]}` : ''}`);

  // Homepage CTA under the program grid.
  await page.goto(`${B}/index.html`, { waitUntil: 'load' });
  const cta = page.locator('#explore a').last();
  const href = await cta.getAttribute('href');
  const label = (await cta.textContent()).trim();
  console.log(`     CTA #explore: "${label}" -> ${href}`);
  ok(href === '/tour.html', `CTA #explore nunjuk /tour.html (dapet ${href})`);
  ok(label.split(/\s+/).length <= 2, `label CTA <=2 kata ("${label}")`);
  // Prove the target is a page guests can actually land on, not a parked one.
  const tr = await page.goto(`${B}/tour.html`, { waitUntil: 'load' });
  ok(tr.status() === 200, 'target CTA HTTP 200');
  const robots = await page.evaluate(() => {
    const m = document.querySelector('meta[name="robots"]');
    return m ? m.getAttribute('content') : '';
  });
  ok(!/noindex/.test(robots || ''), `target CTA indexable (robots="${robots}")`);
  await ctx.close();
}

await br.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
