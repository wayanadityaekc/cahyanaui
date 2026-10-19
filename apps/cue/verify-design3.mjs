import { chromium } from 'playwright-core';
const baseUrl = 'http://127.0.0.1:4000';
let pass = 0,
  fail = 0;
function ok(isPassing, message) {
  isPassing ? pass++ : fail++;
  console.log(`${isPassing ? 'ok  ' : 'FAIL'} ${message}`);
}
const br = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

function api(route) {
  const requestUrl = route.request().url();
  function fulfillJson(body) {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  }
  if (requestUrl.includes('/account/session'))
    return fulfillJson({ account: { name: 'Wayan', email: 'w@e.com', phone: '' } });
  if (requestUrl.includes('/bookings/mine')) return fulfillJson({ bookings: [] });
  return fulfillJson({});
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

for (const width of [390, 1280]) {
  const browserContext = await br.newContext({ viewport: { width: width, height: 900 } });
  await browserContext.addInitScript(() => localStorage.setItem('cue_token', 'stub-token'));
  const page = await browserContext.newPage();
  await page.route('**/api/**', api);
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error).slice(0, 110)));
  let seen = 0,
    token = '';
  const bad = [];
  const cards = {};
  for (const pagePath of PAGES) {
    const response = await page.goto(baseUrl + pagePath, { waitUntil: 'load' });
    ok(response.status() === 200, `${width} ${pagePath}: HTTP 200`);
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
      let shadowCount = 0,
        card = 0;
      document.querySelectorAll('*').forEach((element) => {
        const computedStyle = getComputedStyle(element);
        const sh = computedStyle.boxShadow;
        if (!sh || sh === 'none') return;
        shadowCount++;
        const layers = [];
        let depth = 0,
          current = '';
        [...sh].forEach((ch) => {
          if (ch === '(') depth++;
          else if (ch === ')') depth--;
          if (ch === ',' && depth === 0) {
            layers.push(current);
            current = '';
          } else current += ch;
        });
        layers.push(current);
        let elevation = false;
        layers.forEach((layer) => {
          const nums = (layer.match(/-?[\d.]+px/g) || []).map(parseFloat);
          const [ox = 0, oy = 0, blur = 0] = nums;
          const rgbMatch = layer.match(/rgba?\([^)]*\)/);
          if (rgbMatch && /,\s*0\s*\)$/.test(rgbMatch[0])) return;
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
      return { n: shadowCount, out, card, tok };
    });
    seen += result.n;
    cards[pagePath] = result.card;
    token = result.tok;
    result.out.forEach((offender) => {
      if (bad.length < 8) bad.push(`${pagePath} ${offender}`);
    });
  }
  ok(
    bad.length === 0,
    `${width}: nol shadow elevasi se-web${bad.length ? `\n        :: ${bad.join('\n        :: ')}` : ''}`,
  );
  ok(seen > 0, `${width}: ring/hairline yang disengaja masih ke-render (${seen} elemen)`);
  ok(/\d/.test(token), `${width}: --shadow-card kedefinisi (${token || 'KOSONG'})`);
  ['/', '/tour.html', '/activities.html', '/destinations.html', '/bali-guide.html'].forEach((pagePath) => {
    ok(cards[pagePath] > 0, `${width} ${pagePath}: kartu masih bawa --shadow-card (${cards[pagePath]} elemen)`);
  });
  ok(errs.length === 0, `${width}: nol page error${errs[0] ? ` :: ${errs[0]}` : ''}`);
  await browserContext.close();
}

for (const width of [390, 1280]) {
  const browserContext = await br.newContext({ viewport: { width: width, height: 900 } });
  const page = await browserContext.newPage();
  await page.route('**/api/**', api);
  await page.goto(`${baseUrl}/ubud-tour.html`, { waitUntil: 'load' });
  await page.waitForFunction(
    () => getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim() !== '',
  );
  function box() {
    return page.evaluate(() => {
      const header = document.querySelector('header');
      const boxItem = header.getBoundingClientRect();
      const cs = getComputedStyle(document.documentElement);
      return {
        top: Math.round(boxItem.top),
        bottom: Math.round(boxItem.bottom),
        h: Math.round(boxItem.height),
        navH: parseFloat(cs.getPropertyValue('--header-h')),
        barH: parseFloat(cs.getPropertyValue('--tripbar-h')),
      };
    });
  }
  async function scrollTo(scrollPosition) {
    await page.evaluate((targetPosition) => window.scrollTo(0, targetPosition), scrollPosition);
    await page.waitForFunction((targetPosition) => Math.abs(window.scrollY - targetPosition) < 2, scrollPosition, {
      timeout: 5000,
    });
    await page.waitForTimeout(450);
  }
  async function by(distance) {
    await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), distance);
    await page.waitForTimeout(450);
  }

  const atTop = await box();
  ok(atTop.top === 0, `${width}: di puncak header rata atas (top ${atTop.top})`);
  ok(atTop.bottom > 0, `${width}: di puncak header keliatan`);

  await scrollTo(40);
  ok((await box()).top === 0, `${width}: 40px = masih utuh, ambang tuck itu 80 (top ${(await box()).top})`);

  await scrollTo(600);
  const down = await box();
  ok(down.bottom > 0, `${width}: scroll ke BAWAH header TETEP keliatan - sticky (bottom ${down.bottom})`);
  ok(Math.abs(down.top + down.barH) < 2, `${width}: yang ketuck cuma trip bar (top ${down.top} vs -${down.barH})`);

  await by(-200);
  const up = await box();
  ok(Math.abs(up.top - down.top) < 2, `${width}: scroll ke ATAS gak ngubah apa-apa lagi (top ${up.top})`);

  await by(300);
  ok((await box()).bottom > 0, `${width}: turun lagi tetep keliatan`);

  await scrollTo(40);
  ok((await box()).bottom > 0, `${width}: di 40 nav masih keliatan`);
  ok(Math.abs((await box()).top + up.barH) < 2, `${width}: turun-balik ke 40 bar TETEP ketuck (ambang buka 8)`);

  await scrollTo(0);
  const back = await box();
  ok(back.top === 0, `${width}: balik ke puncak = trip bar + nav utuh (top ${back.top})`);

  await scrollTo(600);
  const before = (await box()).top;
  for (const distance of [-3, 3, -2, 2, -3]) {
    await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), distance);
  }
  await page.waitForTimeout(400);
  ok((await box()).top === before, `${width}: goyangan kecil gak bikin header kedip`);
  await browserContext.close();
}

for (const width of [390, 1280]) {
  const browserContext = await br.newContext({ viewport: { width: width, height: 900 } });
  const page = await browserContext.newPage();
  await page.route('**/api/**', api);
  await page.goto(`${baseUrl}/ubud-tour.html`, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const hamburgerLayout = await page.evaluate(() => {
    const hamburgerBox = document.getElementById('hamburger').getBoundingClientRect();
    const logoBox = document.querySelector('header a[href="/"] img').getBoundingClientRect();
    const row = document.getElementById('hamburger').parentElement.getBoundingClientRect();
    const cs = getComputedStyle(document.getElementById('hamburger').parentElement);
    const slot = document.querySelector('[data-account-slot]').getBoundingClientRect();
    const icons = [...document.getElementById('hamburger').parentElement.querySelectorAll('svg')]
      .filter((event) => !event.closest('#nav-menu') && event.getBoundingClientRect().width > 0)
      .map((event) => event.getBoundingClientRect())
      .filter((box) => box.left >= 0)
      .sort((a, bItem) => a.left - bItem.left);
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;width:var(--container-x)';
    document.body.appendChild(probe);
    const gutter = probe.getBoundingClientRect().width;
    probe.remove();
    const crumb = document.querySelector('nav[aria-label="Breadcrumb"] li');
    return {
      bl: Math.round(hamburgerBox.left),
      br: Math.round(hamburgerBox.right),
      ll: Math.round(logoBox.left),
      lr: Math.round(logoBox.right),
      rowL: Math.round(row.left),
      padL: parseFloat(cs.paddingLeft),
      rowR: Math.round(row.right),
      padR: parseFloat(cs.paddingRight),
      gutter,
      sl: Math.round(slot.left),
      sr: Math.round(slot.right),
      bw: Math.round(hamburgerBox.width),
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
    `     burger ${hamburgerLayout.bl}-${hamburgerLayout.br} · logo ${hamburgerLayout.ll}-${hamburgerLayout.lr} · akun ${hamburgerLayout.sl}-${hamburgerLayout.sr} · baris ${hamburgerLayout.rowL}+${hamburgerLayout.padL} .. ${hamburgerLayout.rowR}-${hamburgerLayout.padR}`,
  );
  if (width <= 992) {
    ok(hamburgerLayout.bw > 0, `${width}: burger keliatan di HP (lebar ${hamburgerLayout.bw})`);
    ok(
      hamburgerLayout.br <= hamburgerLayout.ll,
      `${width}: burger di KIRI logo (burger kanan ${hamburgerLayout.br} <= logo kiri ${hamburgerLayout.ll})`,
    );
    ok(
      Math.abs(hamburgerLayout.bl - (hamburgerLayout.rowL + hamburgerLayout.padL)) < 3,
      `${width}: burger nempel di gutter KIRI baris (${hamburgerLayout.bl} vs ${hamburgerLayout.rowL + hamburgerLayout.padL})`,
    );
    if (hamburgerLayout.crumbL != null)
      ok(
        Math.abs(hamburgerLayout.bl - hamburgerLayout.crumbL) < 2,
        `${width}: burger satu tepi sama crumb (${hamburgerLayout.bl} vs ${hamburgerLayout.crumbL})`,
      );
  } else {
    ok(hamburgerLayout.bw === 0, `${width}: desktop gak punya burger (lebar ${hamburgerLayout.bw})`);
    ok(hamburgerLayout.deskNav, `${width}: link halaman keliatan di bar desktop`);
  }
  ok(
    hamburgerLayout.rowR - hamburgerLayout.padR - hamburgerLayout.sr < 3,
    `${width}: slot akun nempel di gutter KANAN baris (${Math.round(hamburgerLayout.rowR - hamburgerLayout.padR - hamburgerLayout.sr)}px)`,
  );
  ok(
    hamburgerLayout.icons.every((icon) => icon.r <= hamburgerLayout.sr + 1),
    `${width}: slot akun paling kanan di klusternya`,
  );

  console.log(
    `     gutter baris nav: kiri ${hamburgerLayout.padL} · kanan ${hamburgerLayout.padR} · token ${hamburgerLayout.gutter}`,
  );
  ok(
    Math.abs(hamburgerLayout.padL - hamburgerLayout.padR) < 0.5,
    `${width}: gutter kiri == kanan (${hamburgerLayout.padL} vs ${hamburgerLayout.padR})`,
  );
  ok(hamburgerLayout.padL < 24, `${width}: gutter udah dikecilin dari 24 (${hamburgerLayout.padL})`);
  ok(hamburgerLayout.padL >= 14, `${width}: tapi gak kekecilan (${hamburgerLayout.padL})`);
  if (width <= 992)
    ok(
      Math.abs(hamburgerLayout.padL - hamburgerLayout.gutter) < 0.5,
      `${width}: di HP gutter nav == --container-x (${hamburgerLayout.padL} vs ${hamburgerLayout.gutter})`,
    );
  if (width <= 992)
    ok(
      Math.abs(width - hamburgerLayout.sr - hamburgerLayout.gutter) < 2,
      `${width}: slot akun berhenti satu gutter dari tepi kanan (${Math.round(width - hamburgerLayout.sr)} vs ${hamburgerLayout.gutter})`,
    );

  const gaps = await page.evaluate(() => {
    const row = document.getElementById('hamburger').parentElement;
    function ink(element) {
      const svg = element.querySelector('svg');
      if (svg) return svg.getBoundingClientRect();
      const bars = [...element.querySelectorAll('span')]
        .filter((candidate) => getComputedStyle(candidate).position === 'static')
        .map((staticElement) => staticElement.getBoundingClientRect());
      if (!bars.length) return null;
      return { left: Math.min(...bars.map((bar) => bar.left)), right: Math.max(...bars.map((bar) => bar.right)) };
    }
    const out = [];
    [...row.children].forEach((element) => {
      if (element.getBoundingClientRect().width === 0) return;
      if (element.querySelector('img')) return;
      if (element.id === 'hamburger') return;
      if (element.matches('[data-desktop-nav], nav')) return;
      const hasVisibleSvg = [...element.querySelectorAll('svg')].some((svg) => svg.getBoundingClientRect().width > 0);
      const contentBox =
        element.matches('[data-account-slot]') && !hasVisibleSvg
          ? element.querySelector('button').getBoundingClientRect()
          : ink(element);
      if (contentBox)
        out.push({
          tag: element.id || element.getAttribute('aria-label') || element.tagName,
          l: contentBox.left,
          r: contentBox.right,
        });
    });
    out.sort((a, b) => a.l - b.l);
    return out.slice(1).map((current, index) => ({
      from: out[index].tag,
      to: current.tag,
      gap: +(current.l - out[index].r).toFixed(1),
    }));
  });
  console.log(`     celah tinta ikon: ${gaps.map((gap) => `${gap.from}->${gap.to} ${gap.gap}`).join(' · ')}`);
  ok(gaps.length >= 2, `${width}: minimal 2 celah ke-ukur (${gaps.length}) - kurang = harness rusak, bukan lolos`);
  const spread = Math.max(...gaps.map((gap) => gap.gap)) - Math.min(...gaps.map((gap) => gap.gap));
  ok(
    spread < 0.6,
    `${width}: celah antar ikon SAMA semua (spread ${spread.toFixed(1)}px :: ${gaps.map((gap) => gap.gap).join(', ')})`,
  );

  if (width > 992) {
    await browserContext.close();
    continue;
  }
  await page.click('#hamburger');
  await page.waitForTimeout(400);
  const menuLayout = await page.evaluate(() => {
    const hamburgerBox = document.getElementById('hamburger').getBoundingClientRect();
    const panel = document.querySelector('header nav > ul');
    const pr = panel.getBoundingClientRect();
    const element = document.elementFromPoint(
      hamburgerBox.left + hamburgerBox.width / 2,
      hamburgerBox.top + hamburgerBox.height / 2,
    );
    return {
      overlaps: hamburgerBox.right > pr.left && hamburgerBox.left < pr.right,
      panel: `${Math.round(pr.left)}-${Math.round(pr.right)}`,
      burger: `${Math.round(hamburgerBox.left)}-${Math.round(hamburgerBox.right)}`,
      w: Math.round(pr.width),
      panelR: Math.round(pr.right),
      panelL: Math.round(pr.left),
      closeVisible: !!document.querySelector('#nav-menu button[aria-label="Close menu"]')?.getBoundingClientRect()
        .width,
      hit: element ? element.id || element.tagName : 'none',
      hitCls: element ? (element.className || '').toString().slice(0, 40) : '',
    };
  });
  console.log(
    `     drawer ${menuLayout.panel} · burger ${menuLayout.burger} · hit-test ${menuLayout.hit} "${menuLayout.hitCls}"`,
  );
  ok(
    menuLayout.w > 100,
    `${width}: panel drawer beneran ke-ukur (lebar ${menuLayout.w}) - rect kosong = harness rusak, bukan lolos`,
  );
  ok(
    menuLayout.panelL > -1 && menuLayout.panelL < 1,
    `${width}: panel drawer nempel tepi KIRI (kiri ${menuLayout.panelL})`,
  );
  ok(
    menuLayout.overlaps,
    `${width}: panel nutupin burger - itu konsekuensi drawer sesisi, bukan bug (${menuLayout.burger} vs ${menuLayout.panel})`,
  );
  ok(
    menuLayout.hit !== 'hamburger',
    `${width}: yang ke-tap di posisi burger itu panel, bukan burger (hit: ${menuLayout.hit})`,
  );
  ok(menuLayout.closeVisible, `${width}: tombol x keliatan di dalam drawer`);
  await page.click('#nav-menu button[aria-label="Close menu"]');
  await page.waitForTimeout(400);
  const shut = await page.evaluate(() => document.querySelector('header nav > ul').getBoundingClientRect().right);
  ok(shut <= 1, `${width}: x beneran nutup - panel balik ke luar layar KIRI (kanan ${Math.round(shut)})`);
  await browserContext.close();
}

for (const width of [390]) {
  const browserContext = await br.newContext({ viewport: { width: width, height: 900 } });
  const page = await browserContext.newPage();
  page.on('pageerror', (error) => ok(false, `${width}: page error ${error.message}`));
  await page.route('**/api/**', api);
  await page.goto(`${baseUrl}/ubud-tour.html`, { waitUntil: 'load' });

  function read() {
    return page.evaluate(() => {
      const hamburger = document.getElementById('hamburger');
      const bars = [...hamburger.querySelectorAll(':scope > span')].filter(
        (bar) => getComputedStyle(bar).position === 'static',
      );
      const br = hamburger.getBoundingClientRect();
      return {
        btnW: +br.width.toFixed(1),
        btnH: +br.height.toFixed(1),
        gap: parseFloat(getComputedStyle(hamburger).rowGap) || 0,
        bars: bars.map((bar) => {
          const box = bar.getBoundingClientRect();
          return { w: +box.width.toFixed(1), h: +box.height.toFixed(1), mid: +(box.top + box.height / 2).toFixed(1) };
        }),
      };
    });
  }

  const shut = await read();
  console.log(
    `  ${width}px  tombol ${shut.btnW}x${shut.btnH} · gap ${shut.gap} · bar ${shut.bars.map((bar) => `${bar.w}x${bar.h}`).join(' ')}`,
  );
  ok(shut.bars.length === 3, `${width}: tepat 3 bar ke-ukur (${shut.bars.length}) - kurang/lebih = harness rusak`);
  ok(shut.btnW <= 24.5 && shut.btnW >= 18, `${width}: tombol udah dikecilin & gak kekecilan (${shut.btnW})`);
  ok(
    shut.bars.every((bar) => bar.w <= shut.btnW + 0.5 && bar.w >= 16),
    `${width}: bar muat di tombol & masih kebaca`,
  );
  if (width <= 992) ok(shut.btnH >= 32, `${width}: target jempol SENGAJA gak ikut dikecilin, >=32px (${shut.btnH})`);

  const step = +(shut.bars[1].mid - shut.bars[0].mid).toFixed(1);
  ok(
    Math.abs(step - (shut.bars[0].h + shut.gap)) < 0.6,
    `${width}: jarak bar == tinggi bar + gap (${step} vs ${shut.bars[0].h + shut.gap})`,
  );

  await page.click('#hamburger');
  await page.waitForTimeout(420);
  const open = await read();
  ok(
    open.bars.length === 3,
    `${width}: 3 bar masih ke-ukur pas kebuka (${open.bars.length}) - kalau kurang, spread-nya bohong`,
  );
  const mids = open.bars.map((bar) => bar.mid);
  const spread = Math.max(...mids) - Math.min(...mids);
  console.log(`         X: titik tengah ${mids.join(' / ')} · spread ${spread.toFixed(1)}`);
  ok(spread < 1.2, `${width}: X beneran nutup - 3 bar satu titik tengah (spread ${spread.toFixed(1)}px)`);
  await browserContext.close();
}

for (const [label, url] of [
  ['tour', '/ubud-tour.html'],
  ['destination', '/attractions/monkey-forest.html'],
  ['experience', '/attractions/atv-ride.html'],
]) {
  const browserContext = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await browserContext.newPage();
  await page.route('**/api/**', api);
  const response = await page.goto(baseUrl + url, { waitUntil: 'load' });
  ok(response.status() === 200, `hero ${label}: HTTP 200`);
  await page.waitForTimeout(500);
  function shot() {
    return page.evaluate(() => {
      const image = document.querySelector('header ~ * img, main img') || document.querySelector('img');
      if (!image) return null;
      const boxItem = image.getBoundingClientRect();
      return { w: +boxItem.width.toFixed(1), h: +boxItem.height.toFixed(1), tr: getComputedStyle(image).transform };
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
  await browserContext.close();
}

await br.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
