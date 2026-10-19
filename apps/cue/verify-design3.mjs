import { chromium } from 'playwright-core';
const baseUrl = 'http://127.0.0.1:4000';
let pass = 0,
  fail = 0;
function checkAssertion(isPassing, message) {
  isPassing ? pass++ : fail++;
  console.log(`${isPassing ? 'ok  ' : 'FAIL'} ${message}`);
}
const br = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
});

function handleApiRoute(route) {
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
  await page.route('**/api/**', handleApiRoute);
  const errs = [];
  page.on('pageerror', (error) => errs.push(String(error).slice(0, 110)));
  let seen = 0,
    token = '';
  const badRows = [];
  const cards = {};
  for (const pagePath of PAGES) {
    const response = await page.goto(baseUrl + pagePath, { waitUntil: 'load' });
    checkAssertion(response.status() === 200, `${width} ${pagePath}: HTTP 200`);
    await page.waitForTimeout(350);
    const result = await page.evaluate(() => {
      const tok = getComputedStyle(document.documentElement).getPropertyValue('--shadow-card').trim();
      const tokNums = tok
        .replace(/rgba?\([^)]*\)/g, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(parseFloat);
      const shadowRows = [];
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
          const hasVisibleShadow = Math.abs(ox) > 0 || Math.abs(oy) > 0 || blur > 2;
          if (hasVisibleShadow) elevation = true;
        });
        if (elevation) {
          shadowRows.push(
            `<${element.tagName.toLowerCase()} class="${(element.className || '').toString().slice(0, 55)}"> ${sh.slice(0, 60)}`,
          );
        }
      });
      return { n: shadowCount, out: shadowRows, card, tok };
    });
    seen += result.n;
    cards[pagePath] = result.card;
    token = result.tok;
    result.out.forEach((offender) => {
      if (badRows.length < 8) badRows.push(`${pagePath} ${offender}`);
    });
  }
  checkAssertion(
    badRows.length === 0,
    `${width}: nol shadow elevasi se-web${badRows.length ? `\n        :: ${badRows.join('\n        :: ')}` : ''}`,
  );
  checkAssertion(seen > 0, `${width}: ring/hairline yang disengaja masih ke-render (${seen} elemen)`);
  checkAssertion(/\d/.test(token), `${width}: --shadow-card kedefinisi (${token || 'KOSONG'})`);
  ['/', '/tour.html', '/activities.html', '/destinations.html', '/bali-guide.html'].forEach((pagePath) => {
    checkAssertion(
      cards[pagePath] > 0,
      `${width} ${pagePath}: kartu masih bawa --shadow-card (${cards[pagePath]} elemen)`,
    );
  });
  checkAssertion(errs.length === 0, `${width}: nol page error${errs[0] ? ` :: ${errs[0]}` : ''}`);
  await browserContext.close();
}

for (const width of [390, 1280]) {
  const browserContext = await br.newContext({ viewport: { width: width, height: 900 } });
  const page = await browserContext.newPage();
  await page.route('**/api/**', handleApiRoute);
  await page.goto(`${baseUrl}/ubud-tour.html`, { waitUntil: 'load' });
  await page.waitForFunction(
    () => getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim() !== '',
  );
  function measureHeaderBox() {
    return page.evaluate(() => {
      const header = document.querySelector('header');
      const bounds = header.getBoundingClientRect();
      const cs = getComputedStyle(document.documentElement);
      return {
        top: Math.round(bounds.top),
        bottom: Math.round(bounds.bottom),
        h: Math.round(bounds.height),
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
  async function scrollByDistance(distance) {
    await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), distance);
    await page.waitForTimeout(450);
  }

  const atTop = await measureHeaderBox();
  checkAssertion(atTop.top === 0, `${width}: di puncak header rata atas (top ${atTop.top})`);
  checkAssertion(atTop.bottom > 0, `${width}: di puncak header keliatan`);

  await scrollTo(40);
  checkAssertion(
    (await measureHeaderBox()).top === 0,
    `${width}: 40px = masih utuh, ambang tuck itu 80 (top ${(await measureHeaderBox()).top})`,
  );

  await scrollTo(600);
  const down = await measureHeaderBox();
  checkAssertion(down.bottom > 0, `${width}: scroll ke BAWAH header TETEP keliatan - sticky (bottom ${down.bottom})`);
  checkAssertion(
    Math.abs(down.top + down.barH) < 2,
    `${width}: yang ketuck cuma trip bar (top ${down.top} vs -${down.barH})`,
  );

  await scrollByDistance(-200);
  const up = await measureHeaderBox();
  checkAssertion(Math.abs(up.top - down.top) < 2, `${width}: scroll ke ATAS gak ngubah apa-apa lagi (top ${up.top})`);

  await scrollByDistance(300);
  checkAssertion((await measureHeaderBox()).bottom > 0, `${width}: turun lagi tetep keliatan`);

  await scrollTo(40);
  checkAssertion((await measureHeaderBox()).bottom > 0, `${width}: di 40 nav masih keliatan`);
  checkAssertion(
    Math.abs((await measureHeaderBox()).top + up.barH) < 2,
    `${width}: turun-balik ke 40 bar TETEP ketuck (ambang buka 8)`,
  );

  await scrollTo(0);
  const back = await measureHeaderBox();
  checkAssertion(back.top === 0, `${width}: balik ke puncak = trip bar + nav utuh (top ${back.top})`);

  await scrollTo(600);
  const before = (await measureHeaderBox()).top;
  for (const distance of [-3, 3, -2, 2, -3]) {
    await page.evaluate((scrollAmount) => window.scrollBy(0, scrollAmount), distance);
  }
  await page.waitForTimeout(400);
  checkAssertion((await measureHeaderBox()).top === before, `${width}: goyangan kecil gak bikin header kedip`);
  await browserContext.close();
}

for (const width of [390, 1280]) {
  const browserContext = await br.newContext({ viewport: { width: width, height: 900 } });
  const page = await browserContext.newPage();
  await page.route('**/api/**', handleApiRoute);
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
      .sort((a, b) => a.left - b.left);
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
    checkAssertion(hamburgerLayout.bw > 0, `${width}: burger keliatan di HP (lebar ${hamburgerLayout.bw})`);
    checkAssertion(
      hamburgerLayout.br <= hamburgerLayout.ll,
      `${width}: burger di KIRI logo (burger kanan ${hamburgerLayout.br} <= logo kiri ${hamburgerLayout.ll})`,
    );
    checkAssertion(
      Math.abs(hamburgerLayout.bl - (hamburgerLayout.rowL + hamburgerLayout.padL)) < 3,
      `${width}: burger nempel di gutter KIRI baris (${hamburgerLayout.bl} vs ${hamburgerLayout.rowL + hamburgerLayout.padL})`,
    );
    if (hamburgerLayout.crumbL != null)
      checkAssertion(
        Math.abs(hamburgerLayout.bl - hamburgerLayout.crumbL) < 2,
        `${width}: burger satu tepi sama crumb (${hamburgerLayout.bl} vs ${hamburgerLayout.crumbL})`,
      );
  } else {
    checkAssertion(hamburgerLayout.bw === 0, `${width}: desktop gak punya burger (lebar ${hamburgerLayout.bw})`);
    checkAssertion(hamburgerLayout.deskNav, `${width}: link halaman keliatan di bar desktop`);
  }
  checkAssertion(
    hamburgerLayout.rowR - hamburgerLayout.padR - hamburgerLayout.sr < 3,
    `${width}: slot akun nempel di gutter KANAN baris (${Math.round(hamburgerLayout.rowR - hamburgerLayout.padR - hamburgerLayout.sr)}px)`,
  );
  checkAssertion(
    hamburgerLayout.icons.every((icon) => icon.r <= hamburgerLayout.sr + 1),
    `${width}: slot akun paling kanan di klusternya`,
  );

  console.log(
    `     gutter baris nav: kiri ${hamburgerLayout.padL} · kanan ${hamburgerLayout.padR} · token ${hamburgerLayout.gutter}`,
  );
  checkAssertion(
    Math.abs(hamburgerLayout.padL - hamburgerLayout.padR) < 0.5,
    `${width}: gutter kiri == kanan (${hamburgerLayout.padL} vs ${hamburgerLayout.padR})`,
  );
  checkAssertion(hamburgerLayout.padL < 24, `${width}: gutter udah dikecilin dari 24 (${hamburgerLayout.padL})`);
  checkAssertion(hamburgerLayout.padL >= 14, `${width}: tapi gak kekecilan (${hamburgerLayout.padL})`);
  if (width <= 992)
    checkAssertion(
      Math.abs(hamburgerLayout.padL - hamburgerLayout.gutter) < 0.5,
      `${width}: di HP gutter nav == --container-x (${hamburgerLayout.padL} vs ${hamburgerLayout.gutter})`,
    );
  if (width <= 992)
    checkAssertion(
      Math.abs(width - hamburgerLayout.sr - hamburgerLayout.gutter) < 2,
      `${width}: slot akun berhenti satu gutter dari tepi kanan (${Math.round(width - hamburgerLayout.sr)} vs ${hamburgerLayout.gutter})`,
    );

  const gaps = await page.evaluate(() => {
    const row = document.getElementById('hamburger').parentElement;
    function measureInk(element) {
      const svg = element.querySelector('svg');
      if (svg) return svg.getBoundingClientRect();
      const bars = [...element.querySelectorAll('span')]
        .filter((candidate) => getComputedStyle(candidate).position === 'static')
        .map((staticElement) => staticElement.getBoundingClientRect());
      if (!bars.length) return null;
      return { left: Math.min(...bars.map((bar) => bar.left)), right: Math.max(...bars.map((bar) => bar.right)) };
    }
    const childBoxes = [];
    [...row.children].forEach((element) => {
      if (element.getBoundingClientRect().width === 0) return;
      if (element.querySelector('img')) return;
      if (element.id === 'hamburger') return;
      if (element.matches('[data-desktop-nav], nav')) return;
      const hasVisibleSvg = [...element.querySelectorAll('svg')].some((svg) => svg.getBoundingClientRect().width > 0);
      const contentBox =
        element.matches('[data-account-slot]') && !hasVisibleSvg
          ? element.querySelector('button').getBoundingClientRect()
          : measureInk(element);
      if (contentBox)
        childBoxes.push({
          tag: element.id || element.getAttribute('aria-label') || element.tagName,
          l: contentBox.left,
          r: contentBox.right,
        });
    });
    childBoxes.sort((a, b) => a.l - b.l);
    return childBoxes.slice(1).map((current, index) => ({
      from: childBoxes[index].tag,
      to: current.tag,
      gap: +(current.l - childBoxes[index].r).toFixed(1),
    }));
  });
  console.log(`     celah tinta ikon: ${gaps.map((gap) => `${gap.from}->${gap.to} ${gap.gap}`).join(' · ')}`);
  checkAssertion(
    gaps.length >= 2,
    `${width}: minimal 2 celah ke-ukur (${gaps.length}) - kurang = harness rusak, bukan lolos`,
  );
  const spread = Math.max(...gaps.map((gap) => gap.gap)) - Math.min(...gaps.map((gap) => gap.gap));
  checkAssertion(
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
  checkAssertion(
    menuLayout.w > 100,
    `${width}: panel drawer beneran ke-ukur (lebar ${menuLayout.w}) - rect kosong = harness rusak, bukan lolos`,
  );
  checkAssertion(
    menuLayout.panelL > -1 && menuLayout.panelL < 1,
    `${width}: panel drawer nempel tepi KIRI (kiri ${menuLayout.panelL})`,
  );
  checkAssertion(
    menuLayout.overlaps,
    `${width}: panel nutupin burger - itu konsekuensi drawer sesisi, bukan bug (${menuLayout.burger} vs ${menuLayout.panel})`,
  );
  checkAssertion(
    menuLayout.hit !== 'hamburger',
    `${width}: yang ke-tap di posisi burger itu panel, bukan burger (hit: ${menuLayout.hit})`,
  );
  checkAssertion(menuLayout.closeVisible, `${width}: tombol x keliatan di dalam drawer`);
  await page.click('#nav-menu button[aria-label="Close menu"]');
  await page.waitForTimeout(400);
  const shut = await page.evaluate(() => document.querySelector('header nav > ul').getBoundingClientRect().right);
  checkAssertion(shut <= 1, `${width}: x beneran nutup - panel balik ke luar layar KIRI (kanan ${Math.round(shut)})`);
  await browserContext.close();
}

for (const width of [390]) {
  const browserContext = await br.newContext({ viewport: { width: width, height: 900 } });
  const page = await browserContext.newPage();
  page.on('pageerror', (error) => checkAssertion(false, `${width}: page error ${error.message}`));
  await page.route('**/api/**', handleApiRoute);
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
  checkAssertion(
    shut.bars.length === 3,
    `${width}: tepat 3 bar ke-ukur (${shut.bars.length}) - kurang/lebih = harness rusak`,
  );
  checkAssertion(
    shut.btnW <= 24.5 && shut.btnW >= 18,
    `${width}: tombol udah dikecilin & gak kekecilan (${shut.btnW})`,
  );
  checkAssertion(
    shut.bars.every((bar) => bar.w <= shut.btnW + 0.5 && bar.w >= 16),
    `${width}: bar muat di tombol & masih kebaca`,
  );
  if (width <= 992)
    checkAssertion(shut.btnH >= 32, `${width}: target jempol SENGAJA gak ikut dikecilin, >=32px (${shut.btnH})`);

  const step = +(shut.bars[1].mid - shut.bars[0].mid).toFixed(1);
  checkAssertion(
    Math.abs(step - (shut.bars[0].h + shut.gap)) < 0.6,
    `${width}: jarak bar == tinggi bar + gap (${step} vs ${shut.bars[0].h + shut.gap})`,
  );

  await page.click('#hamburger');
  await page.waitForTimeout(420);
  const open = await read();
  checkAssertion(
    open.bars.length === 3,
    `${width}: 3 bar masih ke-ukur pas kebuka (${open.bars.length}) - kalau kurang, spread-nya bohong`,
  );
  const mids = open.bars.map((bar) => bar.mid);
  const spread = Math.max(...mids) - Math.min(...mids);
  console.log(`         X: titik tengah ${mids.join(' / ')} · spread ${spread.toFixed(1)}`);
  checkAssertion(spread < 1.2, `${width}: X beneran nutup - 3 bar satu titik tengah (spread ${spread.toFixed(1)}px)`);
  await browserContext.close();
}

for (const [label, url] of [
  ['tour', '/ubud-tour.html'],
  ['destination', '/attractions/monkey-forest.html'],
  ['experience', '/attractions/atv-ride.html'],
]) {
  const browserContext = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await browserContext.newPage();
  await page.route('**/api/**', handleApiRoute);
  const response = await page.goto(baseUrl + url, { waitUntil: 'load' });
  checkAssertion(response.status() === 200, `hero ${label}: HTTP 200`);
  await page.waitForTimeout(500);
  function measureImage() {
    return page.evaluate(() => {
      const image = document.querySelector('header ~ * img, main img') || document.querySelector('img');
      if (!image) return null;
      const imageBounds = image.getBoundingClientRect();
      return {
        w: +imageBounds.width.toFixed(1),
        h: +imageBounds.height.toFixed(1),
        tr: getComputedStyle(image).transform,
      };
    });
  }
  const before = await measureImage();
  checkAssertion(
    before && before.w > 200,
    `hero ${label}: foto hero ke-ukur (${before ? before.w : 'NULL'}) - rect kosong = harness rusak, bukan lolos`,
  );
  const box = await page.locator('img').first().boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(650);
  const after = await measureImage();
  checkAssertion(
    before.w === after.w && before.h === after.h,
    `hero ${label}: foto NOL berubah pas di-hover (${before.w}x${before.h} -> ${after.w}x${after.h})`,
  );
  checkAssertion(
    after.tr === 'none' || after.tr === before.tr,
    `hero ${label}: nol transform nyangkut pas hover (${after.tr})`,
  );
  await browserContext.close();
}

await br.close();
console.log(`\n${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
