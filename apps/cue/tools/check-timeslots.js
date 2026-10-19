#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const API_REPO = path.join(ROOT, '..', 'cahyana-api');
const API = path.join(API_REPO, 'pricing-data.js');

function checkIsBehindUpstream() {
  function runGit(...args) {
    return execFileSync('git', ['-C', API_REPO, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  }
  try {
    try {
      runGit('fetch', '-q', 'origin', 'main');
    } catch (e) {}
    const commitsBehindCount = Number(runGit('rev-list', '--count', 'HEAD..origin/main'));
    return Number.isFinite(commitsBehindCount) && commitsBehindCount > 0 ? commitsBehindCount : 0;
  } catch (e) {
    return 0;
  }
}

let fails = 0;
function assertCondition(cond, message) {
  if (!cond) {
    console.error(`  FAIL  ${message}`);
    fails++;
  }
}
function assertEqual(got, want, message) {
  return assertCondition(
    JSON.stringify(got) === JSON.stringify(want),
    `${message}\n          dapet: ${JSON.stringify(got)}\n          mau  : ${JSON.stringify(want)}`,
  );
}

(async () => {
  if (!fs.existsSync(API)) {
    console.log('cahyana-api not checked out next to this repo - skipping.');
    process.exit(0);
  }
  const behind = checkIsBehindUpstream();
  if (behind) {
    console.error(`cahyana-api is ${behind} commit(s) behind origin/main - its catalog is stale,`);
    console.error('so item names here cannot be trusted. Pull it first:');
    console.error('  git -C ../cahyana-api merge --ff-only origin/main');
    process.exit(1);
  }

  const { prices } = require(API);
  const timeSlotsModule = await import('../content/shared/timeSlots.js');
  const {
    TIME_SLOTS,
    RESTRICTED_SLOTS,
    findAllowedSlots: allowedSlots,
    timeOptions,
    findDefaultSlot: defaultSlot,
  } = timeSlotsModule;

  assertEqual(TIME_SLOTS.length, 48, 'TIME_SLOTS harus 48 (tiap 30 menit, 24 jam)');
  assertEqual(TIME_SLOTS[0], '00:00', 'slot pertama');
  assertEqual(TIME_SLOTS.at(-1), '23:30', 'slot terakhir');
  ['02:00', '03:00', '19:00', '12:00', '16:00', '07:00'].forEach((slot) => {
    assertCondition(TIME_SLOTS.includes(slot), `TIME_SLOTS kehilangan ${slot} - ada aturan yang butuh jam itu`);
  });

  const CATS = ['tour', 'experience', 'performance', 'combo', 'place', 'transfer'];
  const catOf = {};
  CATS.forEach((category) => {
    Object.keys(prices[category] || {}).forEach((itemName) => {
      catOf[itemName] = category;
    });
  });
  Object.keys(RESTRICTED_SLOTS).forEach((key) => {
    assertCondition(catOf[key], `"${key}" di RESTRICTED_SLOTS gak ada di katalog - restriction-nya GAK JALAN`);
  });

  const MORNING = ['08:00', '08:30', '09:00'];
  const PRE_DAWN = ['02:00', '03:00'];
  function filterSlotsBetween(startSlot, endSlot) {
    return TIME_SLOTS.filter((slot) => slot >= startSlot && slot <= endSlot);
  }

  [
    'Ubud Tour',
    'West Bali Tour',
    'Bedugul Highlands Tour',
    'Bali Hidden Beaches and Cliffs',
    'Banyumala & Twin Lakes',
    'Munduk Waterfall Tour',
    '3-Day Best of Bali Package',
  ].forEach((itemName) => {
    assertEqual(allowedSlots('tour', itemName), MORNING, `tour normal "${itemName}" harus 08:00/08:30/09:00`);
  });

  assertEqual(
    allowedSlots('tour', 'East Bali Tour'),
    filterSlotsBetween('03:00', '09:00'),
    'East Bali Tour (= tour Lempuyang) 03:00-09:00',
  );
  assertEqual(
    allowedSlots('place', 'Lempuyang Temple - Gates of Heaven'),
    filterSlotsBetween('03:00', '09:00'),
    'Lempuyang (destinasi) 03:00-09:00',
  );

  assertEqual(allowedSlots('experience', 'Mount Batur Trekking'), PRE_DAWN, 'Mount Batur Trekking 02:00/03:00');
  assertEqual(allowedSlots('experience', 'Jeep Sunrise'), PRE_DAWN, 'Jeep Sunrise 02:00/03:00');

  ['ATV', 'Rafting', 'Swing', 'Cooking Class', 'Watersport', 'Bali Zoo', 'Bali Bird Park'].forEach((itemName) => {
    assertEqual(
      allowedSlots('experience', itemName),
      filterSlotsBetween('07:00', '16:00'),
      `experience "${itemName}" harus daylight 07:00-16:00`,
    );
  });

  assertEqual(allowedSlots('performance', 'Kecak Dance'), ['19:00'], 'Kecak Dance cuma 19:00');
  assertEqual(allowedSlots('performance', 'Barong Dance'), MORNING, 'Barong Dance pagi (sementara)');

  assertEqual(
    allowedSlots('combo', 'Uluwatu & Sunset Kecak'),
    filterSlotsBetween('12:00', '16:00'),
    'Uluwatu & Sunset Kecak 12:00-16:00',
  );
  [
    'Ubud Culture Day',
    'GWK & Pandawa Beach',
    'Ubud Rafting Adventure',
    'Ubud ATV Adventure',
    'Lovina Dolphin & Sekumpul Waterfall',
    'Full Adventure: Rafting & ATV',
  ].forEach((itemName) => {
    assertEqual(allowedSlots('combo', itemName), MORNING, `combo "${itemName}" ikut default pagi`);
  });
  assertEqual(
    allowedSlots('combo', 'Batur Sunrise & Adrenaline'),
    PRE_DAWN,
    'Batur Sunrise & Adrenaline 02:00/03:00 (bacaan gua, ditandain ke Wayan)',
  );
  assertEqual(
    allowedSlots('combo', 'Kintamani Sunrise & Penglipuran'),
    PRE_DAWN,
    'Kintamani Sunrise & Penglipuran 02:00/03:00 (idem)',
  );

  ['Tanah Lot Sunset Temple', 'Uluwatu Cliff Temple'].forEach((itemName) => {
    assertEqual(
      allowedSlots('place', itemName),
      filterSlotsBetween('12:00', '16:00'),
      `destinasi sunset "${itemName}" 12:00-16:00`,
    );
  });

  ['charter', 'transfer'].forEach((category) => {
    assertEqual(allowedSlots(category, 'Airport – Ubud'), null, `${category} harus bebas 24 jam (null = semua slot)`);
  });
  assertEqual(
    timeOptions('transfer', 'Airport – Ubud').filter((option) => option.disabled).length,
    0,
    'transfer: nol slot yang dimatiin',
  );

  let checked = 0;
  ['tour', 'experience', 'performance', 'combo', 'place'].forEach((category) => {
    Object.keys(prices[category] || {}).forEach((itemName) => {
      checked++;
      const slots = allowedSlots(category, itemName);
      assertCondition(
        slots === null || slots.length > 0,
        `"${itemName}" (${category}) gak punya jam sama sekali - gak bisa di-book`,
      );
      if (slots)
        slots.forEach((slot) => {
          assertCondition(TIME_SLOTS.includes(slot), `"${itemName}": jam ${slot} gak ada di TIME_SLOTS`);
        });
      const defaultSlotResult = defaultSlot(category, itemName);
      assertCondition(
        !slots || slots.includes(defaultSlotResult),
        `"${itemName}": default ${defaultSlotResult} bukan jam yang diizinin`,
      );
      const options = timeOptions(category, itemName);
      assertEqual(
        options.length,
        48,
        `"${itemName}": picker harus tetep nampilin 48 slot (yang gak boleh di-disable, bukan dihapus)`,
      );
      assertCondition(
        options.some((opt) => !opt.disabled),
        `"${itemName}": semua slot ke-disable`,
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
