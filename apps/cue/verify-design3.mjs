import { chromium } from 'playwright-core';
const B = 'http://127.0.0.1:4000';
let pass = 0,
  fail = 0;
function ok(c, m) {
  c ? pass++ : fail++;
  console.log(`${c ? 'ok  ' : 'FAIL'} ${m}`);
}
const br = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

function api(r) {
  const u = r.request().url();
  function j(b) {
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(b) });
  }
  if (u.includes('/account/session')) return j({ account: { name: 'Wayan', email: 'w@e.com', phone: '' } });
  if (u.includes('/bookings/mine')) return j({ bookings: [] });
  return j({});
}

const PAGES = [
  '/',
  '/tour.html',
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
  '/activities.html',
  '/destinations.html',
];

for (const w of [390, 1280]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('cue_token', 'stub-token'));
  const page = await ctx.newPage();
  await page.route('**/api/**', api);
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 110)));
  let seen = 0,
    token = '';
  const bad = [];
  const cards = {};
  for (const p of PAGES) {
    const r = await page.goto(B + p, { waitUntil: 'load' });
    ok(r.status() === 200, `${w} ${p}: HTTP 200`);
    await page.waitForTimeout(350);
    const result = await page.evaluate(() => {
      const tok = getComputedStyle(document.documentElement).getPropertyValue('--shadow-card').trim();
      const tokNums = tok
        .replace(/rgba?\([^)]*\)/g, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(parseFloat);
      const out = [];
      let n = 0,
        card = 0;
      document.querySelectorAll('*').forEach((element) => {
        const c = getComputedStyle(element);
        const sh = c.boxShadow;
        if (!sh || sh === 'none') return;
        n++;
        const layers = [];
        let depth = 0,
          cur = '';
        [...sh].forEach((ch) => {
          if (ch === '(') depth++;
          else if (ch === ')') depth--;
          if (ch === ',' && depth === 0) {
            layers.push(cur);
            cur = '';
          } else cur += ch;
        });
        layers.push(cur);
        let elevation = false;
        layers.forEach((L) => {
          const nums = (L.match(/-?[\d.]+px/g) || []).map(parseFloat);
          const [ox = 0, oy = 0, blur = 0] = nums;
          const m = L.match(/rgba?\([^)]*\)/);
          if (m && /,\s*0\s*\)$/.test(m[0])) return;
          const isCard =
            tokNums.length >= 3 &&
            nums.length >= 3 &&
            nums[0] === tokNums[0] &&
            nums[1] === tokNums[1] &&
            nums[2] === tokNums[2];
          if (isCard) {
            card++;
            return;
          }
          if (Math.abs(ox) > 0 || Math.abs(oy) > 0 || blur > 2) elevation = true;
        });
        if (elevation) {
          out.push(
            `<${element.tagName.toLowerCase()} class="${(element.className || '').toString().slice(0, 55)}"> ${sh.slice(0, 60)}`,
          );
        }
      });
      return { n, out, card, tok };
    });
    seen += result.n;
    cards[p] = result.card;
    token = result.tok;
    result.out.forEach((b) => {
      if (bad.length < 8) bad.push(`${p} ${b}`);
    });
  }
  ok(
    bad.length === 0,
    `${w}: nol shadow elevasi se-web${bad.length ? `\n        :: ${bad.join('\n        :: ')}` : ''}`,
  );
  ok(seen > 0, `${w}: ring/hairline yang disengaja masih ke-render (${seen} elemen)`);
  ok(/\d/.test(token), `${w}: --shadow-card kedefinisi (${token || 'KOSONG'})`);
  ['/', '/tour.html', '/activities.html', '/destinations.html', '/bali-guide.html'].forEach((p) => {
    ok(cards[p] > 0, `${w} ${p}: kartu masih bawa --shadow-card (${cards[p]} elemen)`);
  });
  ok(errs.length === 0, `${w}: nol page error${errs[0] ? ` :: ${errs[0]}` : ''}`);
  await ctx.close();
}

for (const w of [390, 1280]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**/api/**', api);
  await page.goto(`${B}/ubud-tour.html`, { waitUntil: 'load' });
  await page.waitForFunction(
    () => getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim() !== '',
  );
  function box() {
    return page.evaluate(() => {
      const h = document.querySelector('header');
      const r = h.getBoundingClientRect();
      const cs = getComputedStyle(document.documentElement);
      return {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        h: Math.round(r.height),
        navH: parseFloat(cs.getPropertyValue('--header-h')),
        barH: parseFloat(cs.getPropertyValue('--tripbar-h')),
      };
    });
  }
  async function scrollTo(y) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForFunction((v) => Math.abs(window.scrollY - v) < 2, y, { timeout: 5000 });
    await page.waitForTimeout(450);
  }
  async function by(d) {
    await page.evaluate((v) => window.scrollBy(0, v), d);
    await page.waitForTimeout(450);
  }

  const atTop = await box();
  ok(atTop.top === 0, `${w}: di puncak header rata atas (top ${atTop.top})`);
  ok(atTop.bottom > 0, `${w}: di puncak header keliatan`);

  await scrollTo(40);
  ok((await box()).top === 0, `${w}: 40px = masih utuh, ambang tuck itu 80 (top ${(await box()).top})`);

  await scrollTo(600);
  const down = await box();
  ok(down.bottom > 0, `${w}: scroll ke BAWAH header TETEP keliatan - sticky (bottom ${down.bottom})`);
  ok(Math.abs(down.top + down.barH) < 2, `${w}: yang ketuck cuma trip bar (top ${down.top} vs -${down.barH})`);

  await by(-200);
  const up = await box();
  ok(Math.abs(up.top - down.top) < 2, `${w}: scroll ke ATAS gak ngubah apa-apa lagi (top ${up.top})`);

  await by(300);
  ok((await box()).bottom > 0, `${w}: turun lagi tetep keliatan`);

  await scrollTo(40);
  ok((await box()).bottom > 0, `${w}: di 40 nav masih keliatan`);
  ok(Math.abs((await box()).top + up.barH) < 2, `${w}: turun-balik ke 40 bar TETEP ketuck (ambang buka 8)`);

  await scrollTo(0);
  const back = await box();
  ok(back.top === 0, `${w}: balik ke puncak = trip bar + nav utuh (top ${back.top})`);

  await scrollTo(600);
  const before = (await box()).top;
  for (const d of [-3, 3, -2, 2, -3]) {
    await page.evaluate((v) => window.scrollBy(0, v), d);
  }
  await page.waitForTimeout(400);
  ok((await box()).top === before, `${w}: goyangan kecil gak bikin header kedip`);
  await ctx.close();
}

for (const w of [390, 1280]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**/api/**', api);
  await page.goto(`${B}/ubud-tour.html`, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const g = await page.evaluate(() => {
    const b = document.getElementById('hamburger').getBoundingClientRect();
    const l = document.querySelector('header a[href="/"] img').getBoundingClientRect();
    const row = document.getElementById('hamburger').parentElement.getBoundingClientRect();
    const cs = getComputedStyle(document.getElementById('hamburger').parentElement);
    const slot = document.querySelector('[data-account-slot]').getBoundingClientRect();
    const icons = [...document.getElementById('hamburger').parentElement.querySelectorAll('svg')]
      .filter((e) => !e.closest('#nav-menu') && e.getBoundingClientRect().width > 0)
      .map((e) => e.getBoundingClientRect())
      .filter((r) => r.left >= 0)
      .sort((a, c) => a.left - c.left);
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;width:var(--container-x)';
    document.body.appendChild(probe);
    const gutter = probe.getBoundingClientRect().width;
    probe.remove();
    const crumb = document.querySelector('nav[aria-label="Breadcrumb"] li');
    return {
      bl: Math.round(b.left),
      br: Math.round(b.right),
      ll: Math.round(l.left),
      lr: Math.round(l.right),
      rowL: Math.round(row.left),
      padL: parseFloat(cs.paddingLeft),
      rowR: Math.round(row.right),
      padR: parseFloat(cs.paddingRight),
      gutter,
      sl: Math.round(slot.left),
      sr: Math.round(slot.right),
      bw: Math.round(b.width),
      deskNav: !!document.querySelector('[data-desktop-nav]')?.getBoundingClientRect().width,
      crumbL: crumb ? Math.round(crumb.getBoundingClientRect().left) : null,
      icons: icons.map((icon) => ({
        w: +icon.width.toFixed(1),
        h: +icon.height.toFixed(1),
        l: +icon.left.toFixed(1),
        r: +icon.right.toFixed(1),
      })),
    };
  });
  console.log(
    `     burger ${g.bl}-${g.br} · logo ${g.ll}-${g.lr} · akun ${g.sl}-${g.sr} · baris ${g.rowL}+${g.padL} .. ${g.rowR}-${g.padR}`,
  );
  if (w <= 992) {
    ok(g.bw > 0, `${w}: burger keliatan di HP (lebar ${g.bw})`);
    ok(g.br <= g.ll, `${w}: burger di KIRI logo (burger kanan ${g.br} <= logo kiri ${g.ll})`);
    ok(
      Math.abs(g.bl - (g.rowL + g.padL)) < 3,
      `${w}: burger nempel di gutter KIRI baris (${g.bl} vs ${g.rowL + g.padL})`,
    );
    if (g.crumbL != null)
      ok(Math.abs(g.bl - g.crumbL) < 2, `${w}: burger satu tepi sama crumb (${g.bl} vs ${g.crumbL})`);
  } else {
    ok(g.bw === 0, `${w}: desktop gak punya burger (lebar ${g.bw})`);
    ok(g.deskNav, `${w}: link halaman keliatan di bar desktop`);
  }
  ok(
    g.rowR - g.padR - g.sr < 3,
    `${w}: slot akun nempel di gutter KANAN baris (${Math.round(g.rowR - g.padR - g.sr)}px)`,
  );
  ok(
    g.icons.every((icon) => icon.r <= g.sr + 1),
    `${w}: slot akun paling kanan di klusternya`,
  );

  console.log(`     gutter baris nav: kiri ${g.padL} · kanan ${g.padR} · token ${g.gutter}`);
  ok(Math.abs(g.padL - g.padR) < 0.5, `${w}: gutter kiri == kanan (${g.padL} vs ${g.padR})`);
  ok(g.padL < 24, `${w}: gutter udah dikecilin dari 24 (${g.padL})`);
  ok(g.padL >= 14, `${w}: tapi gak kekecilan (${g.padL})`);
  if (w <= 992)
    ok(Math.abs(g.padL - g.gutter) < 0.5, `${w}: di HP gutter nav == --container-x (${g.padL} vs ${g.gutter})`);
  if (w <= 992)
    ok(
      Math.abs(w - g.sr - g.gutter) < 2,
      `${w}: slot akun berhenti satu gutter dari tepi kanan (${Math.round(w - g.sr)} vs ${g.gutter})`,
    );

  const gaps = await page.evaluate(() => {
    const row = document.getElementById('hamburger').parentElement;
    function ink(element) {
      const svg = element.querySelector('svg');
      if (svg) return svg.getBoundingClientRect();
      const bars = [...element.querySelectorAll('span')]
        .filter((s) => getComputedStyle(s).position === 'static')
        .map((s) => s.getBoundingClientRect());
      if (!bars.length) return null;
      return { left: Math.min(...bars.map((b) => b.left)), right: Math.max(...bars.map((b) => b.right)) };
    }
    const out = [];
    [...row.children].forEach((element) => {
      if (element.getBoundingClientRect().width === 0) return;
      if (element.querySelector('img')) return;
      if (element.id === 'hamburger') return;
      if (element.matches('[data-desktop-nav], nav')) return;
      const visSvg = [...element.querySelectorAll('svg')].some((v) => v.getBoundingClientRect().width > 0);
      const i =
        element.matches('[data-account-slot]') && !visSvg
          ? element.querySelector('button').getBoundingClientRect()
          : ink(element);
      if (i)
        out.push({ tag: element.id || element.getAttribute('aria-label') || element.tagName, l: i.left, r: i.right });
    });
    out.sort((a, b) => a.l - b.l);
    return out.slice(1).map((c, n) => ({ from: out[n].tag, to: c.tag, gap: +(c.l - out[n].r).toFixed(1) }));
  });
  console.log(`     celah tinta ikon: ${gaps.map((x) => `${x.from}->${x.to} ${x.gap}`).join(' · ')}`);
  ok(gaps.length >= 2, `${w}: minimal 2 celah ke-ukur (${gaps.length}) - kurang = harness rusak, bukan lolos`);
  const spread = Math.max(...gaps.map((x) => x.gap)) - Math.min(...gaps.map((x) => x.gap));
  ok(
    spread < 0.6,
    `${w}: celah antar ikon SAMA semua (spread ${spread.toFixed(1)}px :: ${gaps.map((x) => x.gap).join(', ')})`,
  );

  if (w > 992) {
    await ctx.close();
    continue;
  }
  await page.click('#hamburger');
  await page.waitForTimeout(400);
  const d = await page.evaluate(() => {
    const b = document.getElementById('hamburger').getBoundingClientRect();
    const panel = document.querySelector('header nav > ul');
    const pr = panel.getBoundingClientRect();
    const element = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    return {
      overlaps: b.right > pr.left && b.left < pr.right,
      panel: `${Math.round(pr.left)}-${Math.round(pr.right)}`,
      burger: `${Math.round(b.left)}-${Math.round(b.right)}`,
      w: Math.round(pr.width),
      panelR: Math.round(pr.right),
      panelL: Math.round(pr.left),
      closeVisible: !!document.querySelector('#nav-menu button[aria-label="Close menu"]')?.getBoundingClientRect()
        .width,
      hit: element ? element.id || element.tagName : 'none',
      hitCls: element ? (element.className || '').toString().slice(0, 40) : '',
    };
  });
  console.log(`     drawer ${d.panel} · burger ${d.burger} · hit-test ${d.hit} "${d.hitCls}"`);
  ok(d.w > 100, `${w}: panel drawer beneran ke-ukur (lebar ${d.w}) - rect kosong = harness rusak, bukan lolos`);
  ok(d.panelL > -1 && d.panelL < 1, `${w}: panel drawer nempel tepi KIRI (kiri ${d.panelL})`);
  ok(d.overlaps, `${w}: panel nutupin burger - itu konsekuensi drawer sesisi, bukan bug (${d.burger} vs ${d.panel})`);
  ok(d.hit !== 'hamburger', `${w}: yang ke-tap di posisi burger itu panel, bukan burger (hit: ${d.hit})`);
  ok(d.closeVisible, `${w}: tombol x keliatan di dalam drawer`);
  await page.click('#nav-menu button[aria-label="Close menu"]');
  await page.waitForTimeout(400);
  const shut = await page.evaluate(() => document.querySelector('header nav > ul').getBoundingClientRect().right);
  ok(shut <= 1, `${w}: x beneran nutup - panel balik ke luar layar KIRI (kanan ${Math.round(shut)})`);
  await ctx.close();
}

for (const w of [390]) {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => ok(false, `${w}: page error ${e.message}`));
  await page.route('**/api/**', api);
  await page.goto(`${B}/ubud-tour.html`, { waitUntil: 'load' });

  function read() {
    return page.evaluate(() => {
      const b = document.getElementById('hamburger');
      const bars = [...b.querySelectorAll(':scope > span')].filter((s) => getComputedStyle(s).position === 'static');
      const br = b.getBoundingClientRect();
      return {
        btnW: +br.width.toFixed(1),
        btnH: +br.height.toFixed(1),
        gap: parseFloat(getComputedStyle(b).rowGap) || 0,
        bars: bars.map((s) => {
          const r = s.getBoundingClientRect();
          return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), mid: +(r.top + r.height / 2).toFixed(1) };
        }),
      };
    });
  }

  const shut = await read();
  console.log(
    `  ${w}px  tombol ${shut.btnW}x${shut.btnH} · gap ${shut.gap} · bar ${shut.bars.map((x) => `${x.w}x${x.h}`).join(' ')}`,
  );
  ok(shut.bars.length === 3, `${w}: tepat 3 bar ke-ukur (${shut.bars.length}) - kurang/lebih = harness rusak`);
  ok(shut.btnW <= 24.5 && shut.btnW >= 18, `${w}: tombol udah dikecilin & gak kekecilan (${shut.btnW})`);
  ok(
    shut.bars.every((x) => x.w <= shut.btnW + 0.5 && x.w >= 16),
    `${w}: bar muat di tombol & masih kebaca`,
  );
  if (w <= 992) ok(shut.btnH >= 32, `${w}: target jempol SENGAJA gak ikut dikecilin, >=32px (${shut.btnH})`);

  const step = +(shut.bars[1].mid - shut.bars[0].mid).toFixed(1);
  ok(
    Math.abs(step - (shut.bars[0].h + shut.gap)) < 0.6,
    `${w}: jarak bar == tinggi bar + gap (${step} vs ${shut.bars[0].h + shut.gap})`,
  );

  await page.click('#hamburger');
  await page.waitForTimeout(420);
  const open = await read();
  ok(
    open.bars.length === 3,
    `${w}: 3 bar masih ke-ukur pas kebuka (${open.bars.length}) - kalau kurang, spread-nya bohong`,
  );
  const mids = open.bars.map((x) => x.mid);
  const spread = Math.max(...mids) - Math.min(...mids);
  console.log(`         X: titik tengah ${mids.join(' / ')} · spread ${spread.toFixed(1)}`);
  ok(spread < 1.2, `${w}: X beneran nutup - 3 bar satu titik tengah (spread ${spread.toFixed(1)}px)`);
  await ctx.close();
}

for (const [label, url] of [
  ['tour', '/ubud-tour.html'],
  ['destination', '/attractions/monkey-forest.html'],
  ['experience', '/attractions/atv-ride.html'],
]) {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**/api/**', api);
  const r = await page.goto(B + url, { waitUntil: 'load' });
  ok(r.status() === 200, `hero ${label}: HTTP 200`);
  await page.waitForTimeout(500);
  function shot() {
    return page.evaluate(() => {
      const img = document.querySelector('header ~ * img, main img') || document.querySelector('img');
      if (!img) return null;
      const b = img.getBoundingClientRect();
      return { w: +b.width.toFixed(1), h: +b.height.toFixed(1), tr: getComputedStyle(img).transform };
    });
  }
  const before = await shot();
  ok(
    before && before.w > 200,
    `hero ${label}: foto hero ke-ukur (${before ? before.w : 'NULL'}) - rect kosong = harness rusak, bukan lolos`,
  );
  const box = await page.locator('img').first().boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(650);
  const after = await shot();
  ok(
    before.w === after.w && before.h === after.h,
    `hero ${label}: foto NOL berubah pas di-hover (${before.w}x${before.h} -> ${after.w}x${after.h})`,
  );
  ok(after.tr === 'none' || after.tr === before.tr, `hero ${label}: nol transform nyangkut pas hover (${after.tr})`);
  await ctx.close();
}

await br.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
