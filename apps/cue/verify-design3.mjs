import { chromium } from 'playwright-core';
const B = 'http://127.0.0.1:4000';
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? 'ok  ' : 'FAIL'} ${m}`); };
const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });

const api = (r) => {
  const u = r.request().url();
  const j = (b) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(b) });
  if (u.includes('/account/session')) return j({ account: { name: 'Wayan', email: 'w@e.com', phone: '' } });
  if (u.includes('/bookings/mine')) return j({ bookings: [] });
  return j({});
};

const PAGES = ['/', '/tour.html', '/ubud-tour.html', '/attractions/monkey-forest.html', '/charter.html',
  '/transfer.html', '/airport-transfer.html', '/our-company.html', '/bali-guide.html',
  '/guide/ubud.html', '/my-trips.html', '/settings.html', '/activities.html', '/destinations.html'];

// ---------- 1. ZERO ELEVATION SHADOWS ----------
// The rule, not a list of selectors: a computed box-shadow may not have a real offset
// or blur. That still allows 0-offset/0-blur rings (focus, invalid field, flag
// hairlines, the charter inset border) and the 2px dot halo, all deliberate.
for (const w of [390, 1280]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('cue_token', 'stub-token'));
  const page = await ctx.newPage();
  await page.route('**/api/**', api);
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 110)));
  let seen = 0;
  const bad = [];
  for (const p of PAGES) {
    const r = await page.goto(B + p, { waitUntil: 'load' });
    ok(r.status() === 200, `${w} ${p}: HTTP 200`);
    await page.waitForTimeout(350);
    const res = await page.evaluate(() => {
      const out = [];
      let n = 0;
      for (const el of document.querySelectorAll('*')) {
        const c = getComputedStyle(el);
        const sh = c.boxShadow;
        if (!sh || sh === 'none') continue;
        n++;
        // Tailwind v4 composes box-shadow from FIVE layers (inset-shadow, inset-ring,
        // ring-offset, ring, shadow), so the computed value is a comma-separated list
        // whose first four layers are usually 'rgba(0,0,0,0) 0px 0px 0px 0px'. Reading
        // the first four px numbers of the WHOLE string therefore always found zeros:
        // the first version of this check passed with the navbar shadow put back.
        // Split per layer - on commas that are NOT inside rgb()/rgba().
        const layers = [];
        let depth = 0, cur = '';
        for (const ch of sh) {
          if (ch === '(') depth++;
          else if (ch === ')') depth--;
          if (ch === ',' && depth === 0) { layers.push(cur); cur = ''; } else cur += ch;
        }
        layers.push(cur);
        const elevation = layers.some((L) => {
          const nums = (L.match(/-?[\d.]+px/g) || []).map(parseFloat);
          const [ox = 0, oy = 0, blur = 0] = nums;
          // fully transparent layers paint nothing
          const m = L.match(/rgba?\([^)]*\)/);
          if (m && /,\s*0\s*\)$/.test(m[0])) return false;
          return Math.abs(ox) > 0 || Math.abs(oy) > 0 || blur > 2;
        });
        if (elevation) {
          out.push(`<${el.tagName.toLowerCase()} class="${(el.className || '').toString().slice(0, 55)}"> ${sh.slice(0, 60)}`);
        }
      }
      return { n, out };
    });
    seen += res.n;
    for (const b of res.out) if (bad.length < 8) bad.push(`${p} ${b}`);
  }
  ok(bad.length === 0, `${w}: nol shadow elevasi se-web${bad.length ? '\n        :: ' + bad.join('\n        :: ') : ''}`);
  ok(seen > 0, `${w}: ring/hairline yang disengaja masih ke-render (${seen} elemen)`);
  ok(errs.length === 0, `${w}: nol page error${errs[0] ? ' :: ' + errs[0] : ''}`);
  await ctx.close();
}

// ---------- 2. HEADER HIDES DOWN / SHOWS UP ----------
for (const w of [390, 1280]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**/api/**', api);
  await page.goto(`${B}/ubud-tour.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim() !== '');
  const box = () => page.evaluate(() => {
    const h = document.querySelector('header');
    const r = h.getBoundingClientRect();
    const cs = getComputedStyle(document.documentElement);
    return {
      top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height),
      navH: parseFloat(cs.getPropertyValue('--header-h')),
      barH: parseFloat(cs.getPropertyValue('--tripbar-h')),
    };
  });
  const scrollTo = async (y) => {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForFunction((v) => Math.abs(window.scrollY - v) < 2, y, { timeout: 5000 });
    await page.waitForTimeout(450); // then let the header's own transition land
  };
  const by = async (d) => { await page.evaluate((v) => window.scrollBy(0, v), d); await page.waitForTimeout(450); };

  const atTop = await box();
  ok(atTop.top === 0, `${w}: di puncak header rata atas (top ${atTop.top})`);
  ok(atTop.bottom > 0, `${w}: di puncak header keliatan`);

  // STICKY, and that is a reverted decision (27 Sep 2026) - the header used to hide on
  // the way down. If someone re-adds that, these four fail, which is the point.
  await scrollTo(40);                  // past 8, short of the 80 that tucks the bar
  ok((await box()).top === 0, `${w}: 40px = masih utuh, ambang tuck itu 80 (top ${(await box()).top})`);

  await scrollTo(600);                 // one long move down
  const down = await box();
  ok(down.bottom > 0, `${w}: scroll ke BAWAH header TETEP keliatan - sticky (bottom ${down.bottom})`);
  ok(Math.abs(down.top + down.barH) < 2, `${w}: yang ketuck cuma trip bar (top ${down.top} vs -${down.barH})`);

  await by(-200);                      // reverse: nothing may change
  const up = await box();
  ok(Math.abs(up.top - down.top) < 2, `${w}: scroll ke ATAS gak ngubah apa-apa lagi (top ${up.top})`);

  await by(300);
  ok((await box()).bottom > 0, `${w}: turun lagi tetep keliatan`);

  await scrollTo(40);                  // hysteresis: reopens at 8, not at 80
  ok((await box()).bottom > 0, `${w}: di 40 nav masih keliatan`);
  ok(Math.abs((await box()).top + up.barH) < 2, `${w}: turun-balik ke 40 bar TETEP ketuck (ambang buka 8)`);

  await scrollTo(0);
  const back = await box();
  ok(back.top === 0, `${w}: balik ke puncak = trip bar + nav utuh (top ${back.top})`);

  // jitter must not flip it
  await scrollTo(600);
  const before = (await box()).top;
  for (const d of [-3, 3, -2, 2, -3]) { await page.evaluate((v) => window.scrollBy(0, v), d); }
  await page.waitForTimeout(400);
  ok((await box()).top === before, `${w}: goyangan kecil gak bikin header kedip`);
  await ctx.close();
}

// ---------- 3. HAMBURGER LEFT OF THE LOGO ----------
for (const w of [390, 1280]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**/api/**', api);
  // NOT the homepage: it deliberately has no breadcrumb, so the "same edge as the
  // page body" assertion below silently skipped and tested nothing (caught by a
  // sabotage that only fired once instead of twice).
  await page.goto(`${B}/ubud-tour.html`, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const g = await page.evaluate(() => {
    const b = document.getElementById('hamburger').getBoundingClientRect();
    const l = document.querySelector('header a[href="/"] img').getBoundingClientRect();
    const row = document.getElementById('hamburger').parentElement.getBoundingClientRect();
    const cs = getComputedStyle(document.getElementById('hamburger').parentElement);
    // the right cluster: every icon in the row that is NOT inside the drawer panel
    const icons = [...document.getElementById('hamburger').parentElement.querySelectorAll('svg')]
      .filter((e) => !e.closest('#nav-menu') && e.getBoundingClientRect().width > 0)
      .map((e) => e.getBoundingClientRect())
      .filter((r) => r.left >= 0)
      .sort((a, c) => a.left - c.left);
    // the page's own gutter, resolved by the page rather than typed in here
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;width:var(--container-x)';
    document.body.appendChild(probe);
    const gutter = probe.getBoundingClientRect().width;
    probe.remove();
    const crumb = document.querySelector('nav[aria-label="Breadcrumb"] li');
    return {
      bl: Math.round(b.left), br: Math.round(b.right), ll: Math.round(l.left), lr: Math.round(l.right),
      rowL: Math.round(row.left), padL: parseFloat(cs.paddingLeft),
      rowR: Math.round(row.right), padR: parseFloat(cs.paddingRight),
      gutter,
      crumbL: crumb ? Math.round(crumb.getBoundingClientRect().left) : null,
      icons: icons.map((r) => ({ w: +r.width.toFixed(1), h: +r.height.toFixed(1), l: +r.left.toFixed(1), r: +r.right.toFixed(1) })),
    };
  });
  console.log(`     burger ${g.bl}-${g.br} · logo ${g.ll}-${g.lr} · baris mulai ${g.rowL}+${g.padL}`);
  ok(g.br <= g.ll, `${w}: burger di KIRI logo (burger kanan ${g.br} <= logo kiri ${g.ll})`);
  ok(g.bl - (g.rowL + g.padL) < 3, `${w}: burger nempel di gutter baris (${g.bl - (g.rowL + g.padL)}px)`);
  ok(g.ll - g.br >= 6, `${w}: ada jarak burger-logo (${g.ll - g.br}px)`);

  // GUTTER LUAR TURUN SENOTCH (27 Sep 2026, Wayan: "padding di luar kiri kanan kecilin
  // dikit"). Dulu `px-6` hardcoded = 24 rata di semua lebar. Sekarang 16 di HP (token
  // --container-x, jadi burger lurus sama isi halaman) dan 20 di desktop.
  // Dua utility padding itu specificity-nya SAMA, jadi yang menang urutan compile - itu
  // sebabnya angkanya dibaca dari halaman, bukan dipercaya dari class-nya.
  console.log(`     gutter baris nav: kiri ${g.padL} · kanan ${g.padR} · token ${g.gutter}`);
  ok(Math.abs(g.padL - g.padR) < 0.5, `${w}: gutter kiri == kanan (${g.padL} vs ${g.padR})`);
  ok(g.padL < 24, `${w}: gutter udah dikecilin dari 24 (${g.padL})`);
  ok(g.padL >= 14, `${w}: tapi gak kekecilan (${g.padL})`);
  // emitted only on phones: a `w > 992 ||` short-circuit passes at desktop while
  // PRINTING a phone-only claim next to desktop numbers, which reads like a real check.
  if (w <= 992) ok(Math.abs(g.padL - g.gutter) < 0.5, `${w}: di HP gutter nav == --container-x (${g.padL} vs ${g.gutter})`);
  if (w <= 992 && g.crumbL !== null) ok(Math.abs(g.bl - g.crumbL) < 2, `${w}: burger satu tepi sama isi halaman (${g.bl} vs crumb ${g.crumbL})`);

  // THE DRAWER OPENS FROM THE LEFT (27 Sep 2026). That is the opposite of what this
  // block asserted before, and deliberately so: the panel now grows out of the button
  // that opened it, which means it COVERS that button. The x is the close affordance.
  await page.click('#hamburger');
  await page.waitForTimeout(400);
  const d = await page.evaluate(() => {
    const b = document.getElementById('hamburger').getBoundingClientRect();
    // Two wrong selectors before this one, both of which PASSED by measuring a 0x0
    // box: nav[aria-label] matches AppBottomNav ('App', display:none outside app mode),
    // and 'header nav' is only a wrapper whose single child is position:fixed, so the
    // nav itself collapses to 0x0. The drawer panel is that child <ul>.
    const panel = document.querySelector('header nav > ul');
    const pr = panel.getBoundingClientRect();
    const el = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    return {
      overlaps: b.right > pr.left && b.left < pr.right,
      panel: `${Math.round(pr.left)}-${Math.round(pr.right)}`,
      burger: `${Math.round(b.left)}-${Math.round(b.right)}`,
      w: Math.round(pr.width),
      panelL: Math.round(pr.left),
      closeVisible: !!document.querySelector('#nav-menu button[aria-label="Close menu"]')?.getBoundingClientRect().width,
      hit: el ? (el.id || el.tagName) : 'none',
      hitCls: el ? (el.className || '').toString().slice(0, 40) : '',
    };
  });
  console.log(`     drawer ${d.panel} · burger ${d.burger} · hit-test ${d.hit} "${d.hitCls}"`);
  ok(d.w > 100, `${w}: panel drawer beneran ke-ukur (lebar ${d.w}) - rect kosong = harness rusak, bukan lolos`);
  ok(d.panelL < 1, `${w}: panel drawer nempel tepi KIRI (kiri ${d.panelL})`);
  ok(d.overlaps, `${w}: panel nutupin burger - itu konsekuensi drawer sesisi, bukan bug (${d.burger} vs ${d.panel})`);
  ok(d.hit !== 'hamburger', `${w}: yang ke-tap di posisi burger itu panel, bukan burger (hit: ${d.hit})`);
  // so the x is load-bearing: it is the only close affordance the guest can see
  ok(d.closeVisible, `${w}: tombol x keliatan di dalam drawer`);
  await page.click('#nav-menu button[aria-label="Close menu"]');
  await page.waitForTimeout(400);
  const shut = await page.evaluate(() => document.querySelector('header nav > ul').getBoundingClientRect().right);
  ok(shut <= 1, `${w}: x beneran nutup - panel balik ke luar layar KIRI (kanan ${Math.round(shut)})`);
  await ctx.close();
}

// ---------- 4. HAMBURGER SIZE, AND THE X THAT HAS TO CLOSE ----------
// Sizes are read off the page, never typed in here: what is asserted is the RULE -
// the outer bars travel exactly far enough to meet the middle one. An offset that no
// longer matches the gap leaves a visibly broken X, and nothing else would catch it.
for (const w of [390, 1280]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => ok(false, `${w}: page error ${e.message}`));
  await page.route('**/api/**', api);
  await page.goto(`${B}/ubud-tour.html`, { waitUntil: 'load' });

  const read = () => page.evaluate(() => {
    const b = document.getElementById('hamburger');
    // The bars are the STATIC spans; the badge dot is the absolute one. Do NOT filter by
    // height: an open bar is rotated 45deg, so its rect is ~18px tall, and a height filter
    // silently drops two of the three and leaves spread measuring ONE element against
    // itself - which is how a stale offset passed this gate the first time.
    const bars = [...b.querySelectorAll(':scope > span')]
      .filter((s) => getComputedStyle(s).position === 'static');
    const br = b.getBoundingClientRect();
    return {
      btnW: +br.width.toFixed(1), btnH: +br.height.toFixed(1),
      gap: parseFloat(getComputedStyle(b).rowGap) || 0,
      bars: bars.map((s) => {
        const r = s.getBoundingClientRect();
        return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), mid: +(r.top + r.height / 2).toFixed(1) };
      }),
    };
  });

  const shut = await read();
  console.log(`  ${w}px  tombol ${shut.btnW}x${shut.btnH} · gap ${shut.gap} · bar ${shut.bars.map((x) => x.w + 'x' + x.h).join(' ')}`);
  ok(shut.bars.length === 3, `${w}: tepat 3 bar ke-ukur (${shut.bars.length}) - kurang/lebih = harness rusak`);
  ok(shut.btnW <= 24.5 && shut.btnW >= 18, `${w}: tombol udah dikecilin & gak kekecilan (${shut.btnW})`);
  ok(shut.bars.every((x) => x.w <= shut.btnW + 0.5 && x.w >= 16), `${w}: bar muat di tombol & masih kebaca`);
  if (w <= 992) ok(shut.btnH >= 32, `${w}: target jempol SENGAJA gak ikut dikecilin, >=32px (${shut.btnH})`);

  const step = +(shut.bars[1].mid - shut.bars[0].mid).toFixed(1);
  ok(Math.abs(step - (shut.bars[0].h + shut.gap)) < 0.6,
    `${w}: jarak bar == tinggi bar + gap (${step} vs ${shut.bars[0].h + shut.gap})`);

  await page.click('#hamburger');
  await page.waitForTimeout(420);
  const open = await read();
  ok(open.bars.length === 3, `${w}: 3 bar masih ke-ukur pas kebuka (${open.bars.length}) - kalau kurang, spread-nya bohong`);
  const mids = open.bars.map((x) => x.mid);
  const spread = Math.max(...mids) - Math.min(...mids);
  console.log(`         X: titik tengah ${mids.join(' / ')} · spread ${spread.toFixed(1)}`);
  ok(spread < 1.2, `${w}: X beneran nutup - 3 bar satu titik tengah (spread ${spread.toFixed(1)}px)`);
  await ctx.close();
}

await br.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
