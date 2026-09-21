// The site shows a figure; the server bills one. They live in two repos and
// must never disagree - a guest who agreed to $5 and is charged $15 is the
// whole failure mode this feature has.
import { payOptions } from '/home/user/CUE/lib/payment.js';
import { railFor, chargeCurrency } from '/home/user/CUE/lib/rails.js';
import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
const SRV = req('/home/user/cahyana-api/payment.js');
const PROV = req('/home/user/cahyana-api/providers.js');

let checked = 0;
const bad = [];

const CASES = [
  { usd: 40, idr: 700000 },
  { usd: 26, idr: 450000 },
  { usd: 74, idr: 1300000 },
  { usd: 57, idr: 1000000 },
  { usd: 11, idr: 200000 },
];

for (const { usd, idr } of CASES) {
  for (const cur of ['USD', 'IDR', 'AUD', 'EUR', 'GBP']) {
    for (const stay of ['ubud', '', 'canggu', 'kuta']) {
      for (const ref of [false, true]) {
        const base = cur === 'IDR' ? idr : Math.ceil(usd * ({ USD: 1, AUD: 1.4, EUR: 0.86, GBP: 0.74 })[cur]);
        const site = payOptions({ total: base, currency: cur, stay, hasReferral: ref });
        const srv = SRV.quotePayment({ baseUsd: usd, baseIdr: idr, baseDisplay: base, currency: cur, stay, hasReferral: ref });

        for (const id of ['deposit', 'full', 'referral']) {
          const a = site.find((o) => o.id === id);
          const b = srv.options.find((o) => o.id === id);
          // Availability must agree too: an option the site offers but the
          // server refuses is a dead end at the payment step.
          const aAvail = a.available !== false;
          const bAvail = b.available !== false;
          checked++;
          if (aAvail !== bAvail) {
            bad.push(`${id} availability ${cur}/${stay || 'ubud'}/ref=${ref}: site=${aAvail} server=${bAvail}`);
            continue;
          }
          if (!aAvail) continue;
          const aAmt = a.amount;
          const bAmt = b.amount ? b.amount.display : null;
          if (aAmt !== bAmt) {
            bad.push(`${id} ${cur} base=${base} stay=${stay || 'ubud'} ref=${ref}: site=${aAmt} server=${bAmt}`);
          }
        }
      }
    }
  }
}

// Rails, the same way: the site tells the guest which rail and which currency
// before they commit; the server picks one when the money moves. A site that
// promises rupiah while the server bills dollars is the same class of bug as a
// wrong amount.
//
// The server reads env vars to decide what is switched on, so the comparison is
// run under the env the site's mirror assumes (DOKU off today, PayPal on).
const envWas = { ...process.env };
process.env.PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'harness';
process.env.PAYPAL_SECRET = process.env.PAYPAL_SECRET || 'harness';
delete process.env.DOKU_CLIENT_ID;
delete process.env.DOKU_SECRET;

let rails = 0;
for (const cur of ['USD', 'IDR', 'AUD', 'EUR', 'GBP']) {
  const srv = PROV.routeFor(cur);
  rails++;
  if (srv.provider !== railFor(cur)) {
    bad.push(`rail ${cur}: site=${railFor(cur)} server=${srv.provider}`);
  }
  if (srv.chargeCurrency !== chargeCurrency(cur)) {
    bad.push(`charge currency ${cur}: site=${chargeCurrency(cur)} server=${srv.chargeCurrency}`);
  }
}
process.env = envWas;

console.log(`kombinasi dicek : ${checked}`);
console.log(`rail dicek      : ${rails}`);
console.log(`beda            : ${bad.length}`);
bad.slice(0, 12).forEach((b) => console.log('  ' + b));
process.exit(bad.length ? 1 : 0);
