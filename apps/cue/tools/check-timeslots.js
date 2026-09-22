#!/usr/bin/env node
/**
 * Asserts the start-time schedule in content/shared/timeSlots.js against the real
 * catalog in cahyana-api/pricing-data.js.
 *
 * Why this exists: RESTRICTED_SLOTS is keyed by catalog item name, and a key that
 * does not match ANY item restricts nothing at all - silently. There is no error,
 * no empty picker, nothing to notice: the item just keeps offering every slot. So a
 * typo here means a guest can book a sunrise trek for 2pm and the site looks fine.
 * Every rule Wayan gave is pinned below, so changing one by accident fails loudly.
 *
 * NOT a CI gate: it needs cahyana-api checked out next to this repo, and CI only
 * has out/. Run it by hand whenever timeSlots.js or the catalog changes.
 */
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const API_REPO = path.join(ROOT, "..", "cahyana-api");
const API = path.join(API_REPO, "pricing-data.js");

// Same guard as check-prices: a stale clone makes this lie convincingly - it would
// call a real item name a typo because the commit that added it is not pulled.
function behindUpstream() {
  const git = (...args) =>
    execFileSync("git", ["-C", API_REPO, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  try {
    try { git("fetch", "-q", "origin", "main"); } catch { /* offline: use the last fetch */ }
    const n = Number(git("rev-list", "--count", "HEAD..origin/main"));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

let fails = 0;
const ok = (cond, msg) => {
  if (!cond) { console.error("  FAIL  " + msg); fails++; }
};
const eq = (got, want, msg) => ok(
  JSON.stringify(got) === JSON.stringify(want),
  `${msg}\n          dapet: ${JSON.stringify(got)}\n          mau  : ${JSON.stringify(want)}`
);

(async () => {
  if (!fs.existsSync(API)) {
    console.log("cahyana-api not checked out next to this repo - skipping.");
    process.exit(0);
  }
  const behind = behindUpstream();
  if (behind) {
    console.error(`cahyana-api is ${behind} commit(s) behind origin/main - its catalog is stale,`);
    console.error("so item names here cannot be trusted. Pull it first:");
    console.error("  git -C ../cahyana-api merge --ff-only origin/main");
    process.exit(1);
  }

  const { prices } = require(API);
  const T = await import("../content/shared/timeSlots.js");
  const { TIME_SLOTS, RESTRICTED_SLOTS, allowedSlots, timeOptions, defaultSlot } = T;

  // ---- the slot list itself -------------------------------------------------
  eq(TIME_SLOTS.length, 48, "TIME_SLOTS harus 48 (tiap 30 menit, 24 jam)");
  eq(TIME_SLOTS[0], "00:00", "slot pertama");
  eq(TIME_SLOTS.at(-1), "23:30", "slot terakhir");
  for (const t of ["02:00", "03:00", "19:00", "12:00", "16:00", "07:00"])
    ok(TIME_SLOTS.includes(t), `TIME_SLOTS kehilangan ${t} - ada aturan yang butuh jam itu`);

  // ---- every override key must be a REAL catalog item -----------------------
  const CATS = ["tour", "experience", "performance", "combo", "place", "transfer"];
  const catOf = {};
  for (const c of CATS) for (const n of Object.keys(prices[c] || {})) catOf[n] = c;
  for (const key of Object.keys(RESTRICTED_SLOTS))
    ok(catOf[key], `"${key}" di RESTRICTED_SLOTS gak ada di katalog - restriction-nya GAK JALAN`);

  // ---- Wayan's rules, pinned ------------------------------------------------
  const MORNING = ["08:00", "08:30", "09:00"];
  const PRE_DAWN = ["02:00", "03:00"];
  const r = (a, b) => TIME_SLOTS.filter((t) => t >= a && t <= b);

  // "tour normal selain lempuyang, trekking itu pilihanya jam 8.00,8.30, 9.00 am"
  for (const n of ["Ubud Tour", "West Bali Tour", "Bedugul Highlands Tour", "Bali Hidden Beaches and Cliffs",
    "Banyumala & Twin Lakes", "Munduk Waterfall Tour", "3-Day Best of Bali Package"])
    eq(allowedSlots("tour", n), MORNING, `tour normal "${n}" harus 08:00/08:30/09:00`);

  // "Lempuyang start bisa dari jam 3 pagi sampai max jam 9" - the tour AND the place
  eq(allowedSlots("tour", "East Bali Tour"), r("03:00", "09:00"), 'East Bali Tour (= tour Lempuyang) 03:00-09:00');
  eq(allowedSlots("place", "Lempuyang Temple - Gates of Heaven"), r("03:00", "09:00"), "Lempuyang (destinasi) 03:00-09:00");

  // "trekking pilihanya jam 2 dan 3 aja, jeep sunrise juga jam 2 dan 3"
  eq(allowedSlots("experience", "Mount Batur Trekking"), PRE_DAWN, "Mount Batur Trekking 02:00/03:00");
  eq(allowedSlots("experience", "Jeep Sunrise"), PRE_DAWN, "Jeep Sunrise 02:00/03:00");

  // "Experience salain selain kecak dan barong itu jam nya daylight" + "7-4"
  for (const n of ["ATV", "Rafting", "Swing", "Cooking Class", "Watersport", "Bali Zoo", "Bali Bird Park"])
    eq(allowedSlots("experience", n), r("07:00", "16:00"), `experience "${n}" harus daylight 07:00-16:00`);

  // Kecak fixed showtime; Barong morning until Wayan sends the real time
  eq(allowedSlots("performance", "Kecak Dance"), ["19:00"], "Kecak Dance cuma 19:00");
  eq(allowedSlots("performance", "Barong Dance"), MORNING, "Barong Dance pagi (sementara)");

  // "Uluwatu sunset siang aja jam 12-4bro, sisanya ikut default"
  eq(allowedSlots("combo", "Uluwatu & Sunset Kecak"), r("12:00", "16:00"), "Uluwatu & Sunset Kecak 12:00-16:00");
  for (const n of ["Ubud Culture Day", "GWK & Pandawa Beach", "Ubud Rafting Adventure", "Ubud ATV Adventure",
    "Lovina Dolphin & Sekumpul Waterfall", "Full Adventure: Rafting & ATV"])
    eq(allowedSlots("combo", n), MORNING, `combo "${n}" ikut default pagi`);
  // my reading, not his words - the two combos whose activity IS the pre-dawn one
  eq(allowedSlots("combo", "Batur Sunrise & Adrenaline"), PRE_DAWN, "Batur Sunrise & Adrenaline 02:00/03:00 (bacaan gua, ditandain ke Wayan)");
  eq(allowedSlots("combo", "Kintamani Sunrise & Penglipuran"), PRE_DAWN, "Kintamani Sunrise & Penglipuran 02:00/03:00 (idem)");

  // "Destinasi sunset dari jam 12- 4 aja bro"
  for (const n of ["Tanah Lot Sunset Temple", "Uluwatu Cliff Temple"])
    eq(allowedSlots("place", n), r("12:00", "16:00"), `destinasi sunset "${n}" 12:00-16:00`);

  // "charter bebas jam 24 jam" / "Transfer 24 jam" - no restriction at all
  for (const c of ["charter", "transfer"])
    eq(allowedSlots(c, "Airport – Ubud"), null, `${c} harus bebas 24 jam (null = semua slot)`);
  eq(timeOptions("transfer", "Airport – Ubud").filter((o) => o.disabled).length, 0, "transfer: nol slot yang dimatiin");

  // ---- nothing may end up unbookable ---------------------------------------
  let checked = 0;
  for (const c of ["tour", "experience", "performance", "combo", "place"]) {
    for (const n of Object.keys(prices[c] || {})) {
      checked++;
      const a = allowedSlots(c, n);
      ok(a === null || a.length > 0, `"${n}" (${c}) gak punya jam sama sekali - gak bisa di-book`);
      if (a) for (const t of a) ok(TIME_SLOTS.includes(t), `"${n}": jam ${t} gak ada di TIME_SLOTS`);
      const d = defaultSlot(c, n);
      ok(!a || a.includes(d), `"${n}": default ${d} bukan jam yang diizinin`);
      const opts = timeOptions(c, n);
      eq(opts.length, 48, `"${n}": picker harus tetep nampilin 48 slot (yang gak boleh di-disable, bukan dihapus)`);
      ok(opts.some((o) => !o.disabled), `"${n}": semua slot ke-disable`);
    }
  }

  console.log(`\nitem ke-cek: ${checked} · override: ${Object.keys(RESTRICTED_SLOTS).length}`);
  if (fails) { console.error(`\n${fails} GAGAL`); process.exit(1); }
  console.log("semua aturan jam cocok sama katalog.");
})();
