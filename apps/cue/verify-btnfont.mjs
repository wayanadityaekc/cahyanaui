import { chromium } from 'playwright-core';
const baseUrl = 'http://127.0.0.1:4000';
let pass = 0,
  fail = 0;
function checkAssertion(isPassing, message) {
  isPassing ? pass++ : fail++;
  console.log(`${isPassing ? 'ok  ' : 'FAIL'} ${message}`);
}
function checkIsNear(firstValue, secondValue) {
  return Math.abs(firstValue - secondValue) < 0.5;
}

const br = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

function readTokens(targetPage) {
  return targetPage.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.cssText =
      'position:absolute;height:var(--btn-h);font-size:var(--fs-small);border-radius:var(--r-sm);color:var(--color-cta)';
    document.body.appendChild(probe);
    const computedStyle = getComputedStyle(probe);
    const tokenValues = {
      h: parseFloat(computedStyle.height),
      font: computedStyle.fontSize,
      radius: computedStyle.borderTopLeftRadius,
      cta: computedStyle.color,
    };
    probe.remove();
    return tokenValues;
  });
}

function measureElement(element) {
  return element.evaluate((node) => {
    const computedStyle = getComputedStyle(node),
      box = node.getBoundingClientRect();
    return {
      h: Math.round(box.height * 10) / 10,
      bg: computedStyle.backgroundColor,
      color: computedStyle.color,
      radius: computedStyle.borderTopLeftRadius,
      font: computedStyle.fontSize,
      family: computedStyle.fontFamily.split(',')[0].replace(/["']/g, ''),
      weight: computedStyle.fontWeight,
      display: computedStyle.display,
      align: computedStyle.alignItems,
      justify: computedStyle.justifyContent,
      textAlign: computedStyle.textAlign,
      padTop: computedStyle.paddingTop,
      padBottom: computedStyle.paddingBottom,
      oneLine: node.scrollWidth <= node.clientWidth + 1,
    };
  });
}

const account = { name: 'Wayan', email: 'w@example.com', phone: '' };
function buildJsonResponse(body) {
  return { status: 200, contentType: 'application/json', body: JSON.stringify(body) };
}
function handleApiRoute(route) {
  const requestUrl = route.request().url();
  if (requestUrl.includes('/account/session')) return route.fulfill(buildJsonResponse({ account: account }));
  if (requestUrl.includes('/bookings/mine')) return route.fulfill(buildJsonResponse({ bookings: [] }));
  return route.fulfill(buildJsonResponse({}));
}

for (const width of [320, 390, 768, 1280]) {
  const browserContext = await br.newContext({ viewport: { width: width, height: 880 } });
  await browserContext.addInitScript(() => localStorage.setItem('cue_token', 'stub-token'));
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  await page.route('**/api/**', handleApiRoute);

  await page.goto(`${baseUrl}/settings.html`, { waitUntil: 'load' });
  await page.waitForSelector('[data-settings] button', { timeout: 15000 });
  const pageTokens = await readTokens(page);

  const acts = page.locator('[data-settings] button:not([aria-haspopup])');
  const actionCount = await acts.count();
  checkAssertion(actionCount === 3, `${width}: settings punya 3 tombol aksi (dapet ${actionCount})`);

  const save = acts.filter({ hasText: 'Save changes' });
  const out = acts.filter({ hasText: 'Sign out' });
  const del = acts.filter({ hasText: 'Delete account' });
  checkAssertion((await save.count()) === 1, `${width}: ketemu tepat 1 tombol Save changes`);
  checkAssertion((await out.count()) === 1, `${width}: ketemu tepat 1 tombol Sign out`);
  checkAssertion((await del.count()) === 1, `${width}: ketemu tepat 1 tombol Delete account`);

  const saveShot = await measureElement(save),
    outShot = await measureElement(out);
  console.log(`     save=${JSON.stringify(saveShot)}`);
  console.log(`     out =${JSON.stringify(outShot)}`);

  checkAssertion(
    checkIsNear(saveShot.h, pageTokens.h),
    `${width}: Save tingginya --btn-h (${pageTokens.h}, dapet ${saveShot.h})`,
  );
  checkAssertion(saveShot.font === pageTokens.font, `${width}: Save font --fs-small (${pageTokens.font})`);
  checkAssertion(
    saveShot.radius === pageTokens.radius,
    `${width}: Save radius --r-sm (${pageTokens.radius}, dapet ${saveShot.radius})`,
  );
  checkAssertion(
    saveShot.bg === pageTokens.cta,
    `${width}: Save bg --color-cta (${pageTokens.cta}, dapet ${saveShot.bg})`,
  );
  checkAssertion(saveShot.color === 'rgb(255, 255, 255)', `${width}: Save teksnya putih (dapet ${saveShot.color})`);
  checkAssertion(saveShot.weight === '600', `${width}: Save bobot 600 (dapet ${saveShot.weight})`);
  checkAssertion(
    saveShot.family === 'Inter',
    `${width}: Save font Inter, bukan font browser (dapet ${saveShot.family})`,
  );
  checkAssertion(
    saveShot.align === 'center' && saveShot.justify === 'center' && saveShot.textAlign === 'center',
    `${width}: Save ke-center dua arah (${saveShot.align}/${saveShot.justify}/${saveShot.textAlign})`,
  );
  checkAssertion(saveShot.padTop === '0px' && saveShot.padBottom === '0px', `${width}: Save py-0`);
  checkAssertion(saveShot.display.includes('flex'), `${width}: Save display flex (dapet ${saveShot.display})`);
  checkAssertion(saveShot.oneLine, `${width}: label Save 1 baris`);

  checkAssertion(
    checkIsNear(saveShot.h, outShot.h),
    `${width}: Save & Sign out tingginya SAMA (${saveShot.h} vs ${outShot.h})`,
  );
  checkAssertion(saveShot.radius === outShot.radius, `${width}: radius sama (${saveShot.radius})`);
  checkAssertion(saveShot.font === outShot.font, `${width}: ukuran teks sama (${saveShot.font})`);
  checkAssertion(
    saveShot.family === outShot.family,
    `${width}: font family sama (${saveShot.family} vs ${outShot.family})`,
  );
  checkAssertion(saveShot.weight === outShot.weight, `${width}: bobot sama (${saveShot.weight})`);
  checkAssertion(saveShot.bg !== outShot.bg, `${width}: warna primary != secondary (${saveShot.bg} vs ${outShot.bg})`);

  const deleteShot = await measureElement(del);
  console.log(`     del =${JSON.stringify(deleteShot)}`);
  checkAssertion(
    checkIsNear(deleteShot.h, pageTokens.h),
    `${width}: Delete tingginya --btn-h (${pageTokens.h}, dapet ${deleteShot.h})`,
  );
  checkAssertion(deleteShot.font === pageTokens.font, `${width}: Delete font --fs-small (${pageTokens.font})`);
  checkAssertion(
    deleteShot.family === 'Inter',
    `${width}: Delete font Inter, bukan font browser (dapet ${deleteShot.family})`,
  );
  checkAssertion(deleteShot.weight === '600', `${width}: Delete bobot 600 (dapet ${deleteShot.weight})`);
  checkAssertion(
    deleteShot.align === 'center' && deleteShot.justify === 'center' && deleteShot.textAlign === 'center',
    `${width}: Delete ke-center dua arah (${deleteShot.align}/${deleteShot.justify}/${deleteShot.textAlign})`,
  );
  checkAssertion(deleteShot.oneLine, `${width}: label Delete 1 baris`);
  checkAssertion(deleteShot.bg !== saveShot.bg, `${width}: warna latar Delete != Save (${deleteShot.bg})`);
  checkAssertion(deleteShot.color !== outShot.color, `${width}: warna teks Delete != Sign out (${deleteShot.color})`);

  const bs = await save.boundingBox(),
    bo = await out.boundingBox();
  checkAssertion(bo.x >= bs.x + bs.width - 0.5 || bo.y >= bs.y + bs.height - 0.5, `${width}: dua tombol gak ketumpuk`);
  checkAssertion(
    (await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0,
    `${width}: /settings gak melar`,
  );
  checkAssertion(errs.length === 0, `${width}: /settings nol page error${errs[0] ? ` :: ${errs[0]}` : ''}`);
  await browserContext.close();
}

{
  const browserContext = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await browserContext.newPage();
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error)));
  await page.route('**/api/**', handleApiRoute);
  const pages = [
    '/',
    '/index.html',
    '/tour.html',
    '/ubud-tour.html',
    '/charter.html',
    '/transfer.html',
    '/airport-transfer.html',
    '/our-company.html',
    '/my-trips.html',
    '/bali-guide.html',
    '/settings.html',
    '/activities.html',
    '/destinations.html',
  ];
  let seen = 0;
  const odd = [];
  for (const pagePath of pages) {
    const response = await page.goto(baseUrl + pagePath, { waitUntil: 'load' });
    checkAssertion(response.status() === 200, `sweep ${pagePath}: HTTP 200`);
    await page.waitForTimeout(500);
    const rows = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('button, a').forEach((button) => {
        const bb = button.getBoundingClientRect();
        if (bb.width < 40 || bb.height < 20) return;
        const computedStyle = getComputedStyle(button);
        if (computedStyle.visibility === 'hidden' || computedStyle.display === 'none') return;
        if (Math.round(parseFloat(computedStyle.height)) !== 34 || computedStyle.fontWeight !== '600') return;
        out.push({
          fam: computedStyle.fontFamily.split(',')[0].replace(/["']/g, ''),
          t: (button.textContent || '').trim().slice(0, 24),
        });
      });
      return out;
    });
    seen += rows.length;
    rows.forEach((row) => {
      if (row.fam !== 'Inter') odd.push(`${pagePath} "${row.t}" -> ${row.fam}`);
    });
  }
  checkAssertion(seen > 40, `sweep: ada tombol aksi yang ke-ukur (${seen})`);
  checkAssertion(
    odd.length === 0,
    `sweep: nol tombol aksi pakai font browser${odd.length ? ` :: ${odd.join(' | ')}` : ''}`,
  );
  checkAssertion(errs.length === 0, `sweep: nol page error${errs[0] ? ` :: ${errs[0]}` : ''}`);

  await page.goto(`${baseUrl}/index.html`, { waitUntil: 'load' });
  const cta = page.locator('#explore a').last();
  const href = await cta.getAttribute('href');
  const label = (await cta.textContent()).trim();
  console.log(`     CTA #explore: "${label}" -> ${href}`);
  checkAssertion(href === '/tour.html', `CTA #explore nunjuk /tour.html (dapet ${href})`);
  checkAssertion(label.split(/\s+/).length <= 2, `label CTA <=2 kata ("${label}")`);
  const tr = await page.goto(`${baseUrl}/tour.html`, { waitUntil: 'load' });
  checkAssertion(tr.status() === 200, 'target CTA HTTP 200');
  const robots = await page.evaluate(() => {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    return robotsMeta ? robotsMeta.getAttribute('content') : '';
  });
  checkAssertion(!/noindex/.test(robots || ''), `target CTA indexable (robots="${robots}")`);
  await browserContext.close();
}

await br.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
