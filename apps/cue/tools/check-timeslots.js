#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const API_REPO = path.join(ROOT, '..', 'cahyana-api');
const API = path.join(API_REPO, 'pricing-data.js');

function behindUpstream() {
  function git(...args) {
    return execFileSync('git', ['-C', API_REPO, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  }
  try {
    try {
      git('fetch', '-q', 'origin', 'main');
    } catch (e) {}
    const n = Number(git('rev-list', '--count', 'HEAD..origin/main'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch (e) {
    return 0;
  }
}

let fails = 0;
function ok(cond, msg) {
  if (!cond) {
    console.error(`  FAIL  ${msg}`);
    fails++;
  }
}
function eq(got, want, msg) {
  return ok(
    JSON.stringify(got) === JSON.stringify(want),
    `${msg}\n          dapet: ${JSON.stringify(got)}\n          mau  : ${JSON.stringify(want)}`,
  );
}

(async () => {
  if (!fs.existsSync(API)) {
    console.log('cahyana-api not checked out next to this repo - skipping.');
    process.exit(0);
  }
  const behind = behindUpstream();
  if (behind) {
    console.error(`cahyana-api is ${behind} commit(s) behind origin/main - its catalog is stale,`);
    console.error('so item names here cannot be trusted. Pull it first:');
    console.error('  git -C ../cahyana-api merge --ff-only origin/main');
    process.exit(1);
  }

  const { prices } = require(API);
  const T = await import('../content/shared/timeSlots.js');
  const { TIME_SLOTS, RESTRICTED_SLOTS, allowedSlots, timeOptions, defaultSlot } = T;

  eq(TIME_SLOTS.length, 48, 'TIME_SLOTS harus 48 (tiap 30 menit, 24 jam)');
  eq(TIME_SLOTS[0], '00:00', 'slot pertama');
  eq(TIME_SLOTS.at(-1), '23:30', 'slot terakhir');
  ['02:00', '03:00', '19:00', '12:00', '16:00', '07:00'].forEach((t) => {
    ok(TIME_SLOTS.includes(t), `TIME_SLOTS kehilangan ${t} - ada aturan yang butuh jam itu`);
  });

  const CATS = ['tour', 'experience', 'performance', 'combo', 'place', 'transfer'];
  const catOf = {};
  CATS.forEach((c) => {
    Object.keys(prices[c] || {}).forEach((n) => {
      catOf[n] = c;
    });
  });
  Object.keys(RESTRICTED_SLOTS).forEach((key) => {
    ok(catOf[key], `"${key}" di RESTRICTED_SLOTS gak ada di katalog - restriction-nya GAK JALAN`);
  });

  const MORNING = ['08:00', '08:30', '09:00'];
  const PRE_DAWN = ['02:00', '03:00'];
  function r(a, b) {
    return TIME_SLOTS.filter((t) => t >= a && t <= b);
  }

  [
    'Ubud Tour',
    'West Bali Tour',
    'Bedugul Highlands Tour',
    'Bali Hidden Beaches and Cliffs',
    'Banyumala & Twin Lakes',
    'Munduk Waterfall Tour',
    '3-Day Best of Bali Package',
  ].forEach((n) => {
    eq(allowedSlots('tour', n), MORNING, `tour normal "${n}" harus 08:00/08:30/09:00`);
  });

  eq(allowedSlots('tour', 'East Bali Tour'), r('03:00', '09:00'), 'East Bali Tour (= tour Lempuyang) 03:00-09:00');
  eq(
    allowedSlots('place', 'Lempuyang Temple - Gates of Heaven'),
    r('03:00', '09:00'),
    'Lempuyang (destinasi) 03:00-09:00',
  );

  eq(allowedSlots('experience', 'Mount Batur Trekking'), PRE_DAWN, 'Mount Batur Trekking 02:00/03:00');
  eq(allowedSlots('experience', 'Jeep Sunrise'), PRE_DAWN, 'Jeep Sunrise 02:00/03:00');

  ['ATV', 'Rafting', 'Swing', 'Cooking Class', 'Watersport', 'Bali Zoo', 'Bali Bird Park'].forEach((n) => {
    eq(allowedSlots('experience', n), r('07:00', '16:00'), `experience "${n}" harus daylight 07:00-16:00`);
  });

  eq(allowedSlots('performance', 'Kecak Dance'), ['19:00'], 'Kecak Dance cuma 19:00');
  eq(allowedSlots('performance', 'Barong Dance'), MORNING, 'Barong Dance pagi (sementara)');

  eq(allowedSlots('combo', 'Uluwatu & Sunset Kecak'), r('12:00', '16:00'), 'Uluwatu & Sunset Kecak 12:00-16:00');
  [
    'Ubud Culture Day',
    'GWK & Pandawa Beach',
    'Ubud Rafting Adventure',
    'Ubud ATV Adventure',
    'Lovina Dolphin & Sekumpul Waterfall',
    'Full Adventure: Rafting & ATV',
  ].forEach((n) => {
    eq(allowedSlots('combo', n), MORNING, `combo "${n}" ikut default pagi`);
  });
  eq(
    allowedSlots('combo', 'Batur Sunrise & Adrenaline'),
    PRE_DAWN,
    'Batur Sunrise & Adrenaline 02:00/03:00 (bacaan gua, ditandain ke Wayan)',
  );
  eq(
    allowedSlots('combo', 'Kintamani Sunrise & Penglipuran'),
    PRE_DAWN,
    'Kintamani Sunrise & Penglipuran 02:00/03:00 (idem)',
  );

  ['Tanah Lot Sunset Temple', 'Uluwatu Cliff Temple'].forEach((n) => {
    eq(allowedSlots('place', n), r('12:00', '16:00'), `destinasi sunset "${n}" 12:00-16:00`);
  });

  ['charter', 'transfer'].forEach((c) => {
    eq(allowedSlots(c, 'Airport – Ubud'), null, `${c} harus bebas 24 jam (null = semua slot)`);
  });
  eq(timeOptions('transfer', 'Airport – Ubud').filter((o) => o.disabled).length, 0, 'transfer: nol slot yang dimatiin');

  let checked = 0;
  ['tour', 'experience', 'performance', 'combo', 'place'].forEach((c) => {
    Object.keys(prices[c] || {}).forEach((n) => {
      checked++;
      const a = allowedSlots(c, n);
      ok(a === null || a.length > 0, `"${n}" (${c}) gak punya jam sama sekali - gak bisa di-book`);
      if (a)
        a.forEach((t) => {
          ok(TIME_SLOTS.includes(t), `"${n}": jam ${t} gak ada di TIME_SLOTS`);
        });
      const d = defaultSlot(c, n);
      ok(!a || a.includes(d), `"${n}": default ${d} bukan jam yang diizinin`);
      const opts = timeOptions(c, n);
      eq(opts.length, 48, `"${n}": picker harus tetep nampilin 48 slot (yang gak boleh di-disable, bukan dihapus)`);
      ok(
        opts.some((o) => !o.disabled),
        `"${n}": semua slot ke-disable`,
      );
    });
  });

  console.log(`\nitem ke-cek: ${checked} · override: ${Object.keys(RESTRICTED_SLOTS).length}`);
  if (fails) {
    console.error(`\n${fails} GAGAL`);
    process.exit(1);
  }
  console.log('semua aturan jam cocok sama katalog.');
})();
