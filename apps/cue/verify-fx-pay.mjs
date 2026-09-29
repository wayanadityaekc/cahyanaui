// The payment step prices with the server's live rate (29 Sep 2026).
//   API: node ../cahyana-api/tools/chat-dev-server.js (4599)
//   build with NEXT_PUBLIC_API_BASE=http://127.0.0.1:4599/api, serve on 4000.
// A cart of one Ubud Tour in AUD and in JPY: the deposit row must read the
// catalog's deposit (never a rate the site keeps), and pay-in-full must be the
// quote total the server would charge.
import { chromium } from 'playwright-core';

const API = 'http://127.0.0.1:4599/api';
const DAY = new Date(Date.now() + 40 * 86400000).toISOString().slice(0, 10);
let pass = 0, fail = 0;
const ok = (c, m) => (c ? pass++ : (fail++, console.log('  FAIL:', m)));
const digits = (t) => Number(String(t).replace(/[^0-9]/g, ''));

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
for (const [cur, w] of [['AUD', 390], ['JPY', 1280]]) {
  const cat = await (await fetch(`${API}/pricing/catalog?currency=${cur}&guests=2&stay=`)).json();
  const q = await (await fetch(`${API}/pricing/quote`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ currency: cur, lines: [{ service: 'Ubud Tour', guests: 2 }] }),
  })).json();
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  // Accounts are not what this is about - keep them out of the way.
  // Checkout sits behind sign-in (BookingGate), so the guest is signed in.
  await ctx.route('**/api/account/**', (r) =>
    r.request().url().includes('/account/session')
      ? r.fulfill({ json: { account: { id: 9, name: 'Test Guest', email: 'guest@example.com' } } })
      : r.fulfill({ json: {} }));
  await ctx.route('**/api/bookings/**', (r) => r.fulfill({ json: { upcoming: [], history: [] } }));
  await ctx.addInitScript(([day, c]) => {
    localStorage.setItem('cue_currency', c);
    localStorage.setItem('cue_token', 'tok-test');
    localStorage.setItem('cue_itinerary_v1', JSON.stringify({ days: [{ items: ['Ubud Tour'], itemModes: ['standard'], itemTimes: ['08:00'], date: day, guests: '2' }] }));
  }, [DAY, cur]);
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('http://127.0.0.1:4000/my-trips.html?pay=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.locator('button:visible', { hasText: /Pay now|Book now|Checkout/i }).first().click();
  await page.locator('input[type=text]:visible').first().fill('Test Guest');
  await page.locator('input[type=tel]:visible').first().fill('+61412345678');
  await page.locator('input[type=email]:visible').first().fill('guest@example.com');
  const pickup = page.locator('input[placeholder*="otel" i]:visible, input[placeholder*="ickup" i]:visible').first();
  if (await pickup.count()) await pickup.fill('Ubud');
  await page.locator('button:visible', { hasText: /^\s*Continue\s*$/ }).click();
  await page.waitForTimeout(400);
  const cont2 = page.locator('button:visible', { hasText: /^\s*Continue\s*$/ });
  if (await cont2.count()) await cont2.first().click();
  await page.waitForTimeout(700);
  const rowText = async (re) => {
    const row = page.locator('div:visible', { hasText: re }).filter({ has: page.locator('span') }).last();
    return row.innerText();
  };
  const body = await page.locator('body').innerText();
  const depRow = body.split('\n').find((l) => /deposit/i.test(l) && /\d/.test(l)) || '';
  const depLine = await rowText(/Pay a deposit/);
  const fullLine = await rowText(/Pay in full/);
  const depAmt = digits((depLine.match(/[^\s]*\d[\d,.]*\s*$/m) || [''])[0]);
  const fullAmt = digits((fullLine.match(/[^\s]*\d[\d,.]*\s*$/m) || [''])[0]);
  ok(depAmt === cat.deposit.display, `${cur}/${w}: deposit shown ${depAmt} = catalog ${cat.deposit.display}`);
  ok(fullAmt === q.total.display, `${cur}/${w}: pay in full shown ${fullAmt} = quote ${q.total.display}`);
  ok(new RegExp(cat.symbol.trim().replace('$', '\\$')).test(depLine), `${cur}/${w}: deposit in ${cat.symbol}`);
  await page.screenshot({ path: `/tmp/claude-0/-home-user/b39e23b2-cabe-5327-8412-a80a03834acc/scratchpad/pay-${cur}-${w}.png` });
  ok(errs.length === 0, `${cur}/${w}: no page errors (${errs.join(' | ')})`);
  await ctx.close();
}
await b.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
