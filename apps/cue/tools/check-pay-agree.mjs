// The site shows a figure; the server bills one. They live in two repos and
// must never disagree - a guest who agreed to $5 and is charged $15 is the
// whole failure mode this feature has.
import { payOptions } from '/home/user/CUE/lib/payment.js';
import { RAILS, DEFAULT_RAIL, chargeCurrency } from '/home/user/CUE/lib/rails.js';
import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
const SRV = req('/home/user/cahyana-api/payment.js');
const PROV = req('/home/user/cahyana-api/providers.js');
// The server's live-rate module. With no database it prices at its baseline -
// which is fine here: this compares the two SIDES' arithmetic, and the site
// takes every rate-derived number (totals AND the deposit) from the server.
const FX = req('/home/user/cahyana-api/fx.js');
const CURS = FX.CURRENCIES;

let checked = 0;
const bad = [];

const CASES = [700000, 450000, 1300000, 1000000, 200000];

for (const idr of CASES) {
  // USD is derived from rupiah like every other currency now.
  const usd = FX.display(idr, 'USD');
  for (const cur of CURS) {
    for (const stay of ['ubud', '', 'canggu', 'kuta']) {
      for (const ref of [false, true]) {
        const base = FX.display(idr, cur);
        // What the catalog hands the payment step (catalog.deposit.display).
        const deposit = FX.fromUsd(10, cur);
        // The rupiah figures the Card rail (DOKU) charges, as the payment step
        // is handed them: the rupiah total, and the catalog deposit in rupiah.
        const site = payOptions({ total: base, currency: cur, stay, hasReferral: ref, deposit, totalIdr: idr, depositIdr: FX.fromUsd(10, 'IDR'), totalUsd: usd });
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
          // What DOKU is told to charge (doku-routes: amount.idr for a
          // non-rupiah quote, display for a rupiah one) vs the rupiah figure
          // the site shows as exact.
          const bIdr = b.amount ? (cur === 'IDR' ? b.amount.display : b.amount.idr) : null;
          const aIdr = cur === 'IDR' ? a.amount : a.amountIdr;
          if (aIdr !== bIdr) {
            bad.push(`${id} rupiah ${cur} idr=${idr} ref=${ref}: site=${aIdr} server=${bIdr}`);
          }
          // A rupiah guest on PayPal is billed dollars: paypal-routes quotes
          // again in USD WITHOUT the stored display total (base_usd drives it).
          if (cur === 'IDR') {
            const pp = SRV.quotePayment({ baseUsd: usd, baseIdr: idr, baseDisplay: null, currency: 'USD', stay, hasReferral: ref })
              .options.find((o) => o.id === id);
            const bUsd = pp && pp.amount ? pp.amount.display : null;
            if (a.amountUsd !== bUsd) bad.push(`${id} paypal-usd idr=${idr} ref=${ref}: site=${a.amountUsd} server=${bUsd}`);
          }
        }
      }
    }
  }
}

// Rails: the guest picks one (Card = DOKU by default, or PayPal) and the
// server must honour exactly that choice, billing in the currency the site
// said it would. A site that promises rupiah while the server bills dollars is
// the same class of bug as a wrong amount.
const envWas = { ...process.env };
process.env.PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'harness';
process.env.PAYPAL_SECRET = process.env.PAYPAL_SECRET || 'harness';
process.env.DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID || 'harness';
process.env.DOKU_SECRET = process.env.DOKU_SECRET || 'harness';

let rails = 0;
if (PROV.DEFAULT_RAIL !== DEFAULT_RAIL) bad.push(`default rail: site=${DEFAULT_RAIL} server=${PROV.DEFAULT_RAIL}`);
for (const cur of CURS) {
  if (PROV.routeFor(cur).provider !== DEFAULT_RAIL) bad.push(`no choice ${cur}: server=${PROV.routeFor(cur).provider}`);
  for (const rail of RAILS) {
    const srv = PROV.routeFor(cur, rail);
    rails++;
    if (srv.provider !== rail) bad.push(`rail ${cur}/${rail}: server=${srv.provider}`);
    if (srv.chargeCurrency !== chargeCurrency(cur, rail)) {
      bad.push(`charge currency ${cur}/${rail}: site=${chargeCurrency(cur, rail)} server=${srv.chargeCurrency}`);
    }
  }
}
process.env = envWas;

console.log(`kombinasi dicek : ${checked}`);
console.log(`rail dicek      : ${rails} (default ${DEFAULT_RAIL})`);
console.log(`beda            : ${bad.length}`);
bad.slice(0, 12).forEach((b) => console.log(`  ${b}`));
process.exit(bad.length ? 1 : 0);
