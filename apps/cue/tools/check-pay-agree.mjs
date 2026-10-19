import { payOptions } from '/home/user/CUE/lib/payment.js';
import { RAILS, DEFAULT_RAIL, chargeCurrency } from '/home/user/CUE/lib/rails.js';
import { createRequire } from 'node:module';
const request = createRequire(import.meta.url);
const SRV = request('/home/user/cahyana-api/payment.js');
const PROV = request('/home/user/cahyana-api/providers.js');
const FX = request('/home/user/cahyana-api/fx.js');
const CURS = FX.CURRENCIES;

let checked = 0;
const badRows = [];

const CASES = [700000, 450000, 1300000, 1000000, 200000];

CASES.forEach((idr) => {
  const usd = FX.display(idr, 'USD');
  CURS.forEach((current) => {
    ['ubud', '', 'canggu', 'kuta'].forEach((stay) => {
      [false, true].forEach((ref) => {
        const base = FX.display(idr, current);
        const deposit = FX.fromUsd(10, current);
        const site = payOptions({
          total: base,
          currency: current,
          stay,
          hasReferral: ref,
          deposit,
          totalIdr: idr,
          depositIdr: FX.fromUsd(10, 'IDR'),
          totalUsd: usd,
        });
        const srv = SRV.quotePayment({
          baseUsd: usd,
          baseIdr: idr,
          baseDisplay: base,
          currency: current,
          stay,
          hasReferral: ref,
        });

        ['deposit', 'full', 'referral'].forEach((id) => {
          const siteOption = site.find((option) => option.id === id);
          const serverOption = srv.options.find((option) => option.id === id);
          const isSiteAvailable = siteOption.available !== false;
          const isServerAvailable = serverOption.available !== false;
          checked++;
          if (isSiteAvailable !== isServerAvailable) {
            badRows.push(
              `${id} availability ${current}/${stay || 'ubud'}/ref=${ref}: site=${isSiteAvailable} server=${isServerAvailable}`,
            );
            return;
          }
          if (!isSiteAvailable) return;
          const aAmt = siteOption.amount;
          const bAmt = serverOption.amount ? serverOption.amount.display : null;
          if (aAmt !== bAmt) {
            badRows.push(
              `${id} ${current} base=${base} stay=${stay || 'ubud'} ref=${ref}: site=${aAmt} server=${bAmt}`,
            );
          }
          function pickIdrAmount() {
            if (serverOption.amount) {
              if (current === 'IDR') return serverOption.amount.display;
              return serverOption.amount.idr;
            }
            return null;
          }

          const bIdr = pickIdrAmount();
          const aIdr = current === 'IDR' ? siteOption.amount : siteOption.amountIdr;
          if (aIdr !== bIdr) {
            badRows.push(`${id} rupiah ${current} idr=${idr} ref=${ref}: site=${aIdr} server=${bIdr}`);
          }
          if (current !== 'IDR') return;
          const pp = SRV.quotePayment({
            baseUsd: usd,
            baseIdr: idr,
            baseDisplay: null,
            currency: 'USD',
            stay,
            hasReferral: ref,
          }).options.find((option) => option.id === id);
          const bUsd = pp && pp.amount ? pp.amount.display : null;
          if (siteOption.amountUsd !== bUsd)
            badRows.push(`${id} paypal-usd idr=${idr} ref=${ref}: site=${siteOption.amountUsd} server=${bUsd}`);
        });
      });
    });
  });
});

const envWas = { ...process.env };
process.env.PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'harness';
process.env.PAYPAL_SECRET = process.env.PAYPAL_SECRET || 'harness';
process.env.DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID || 'harness';
process.env.DOKU_SECRET = process.env.DOKU_SECRET || 'harness';

let rails = 0;
if (PROV.DEFAULT_RAIL !== DEFAULT_RAIL) badRows.push(`default rail: site=${DEFAULT_RAIL} server=${PROV.DEFAULT_RAIL}`);
CURS.forEach((current) => {
  if (PROV.routeFor(current).provider !== DEFAULT_RAIL)
    badRows.push(`no choice ${current}: server=${PROV.routeFor(current).provider}`);
  RAILS.forEach((rail) => {
    const srv = PROV.routeFor(current, rail);
    rails++;
    if (srv.provider !== rail) badRows.push(`rail ${current}/${rail}: server=${srv.provider}`);
    if (srv.chargeCurrency !== chargeCurrency(current, rail)) {
      badRows.push(
        `charge currency ${current}/${rail}: site=${chargeCurrency(current, rail)} server=${srv.chargeCurrency}`,
      );
    }
  });
});
process.env = envWas;

console.log(`kombinasi dicek : ${checked}`);
console.log(`rail dicek      : ${rails} (default ${DEFAULT_RAIL})`);
console.log(`beda            : ${badRows.length}`);
badRows.slice(0, 12).forEach((problem) => console.log(`  ${problem}`));
process.exit(badRows.length ? 1 : 0);
