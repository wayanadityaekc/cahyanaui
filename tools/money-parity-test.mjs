// Compares @cahyana/ui lib/money.js with cahyana-api fx.js; needs the cahyana-api clone beside this repo.
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURRENCIES, BASELINE_FX, ladder, displayFromIdr } from '../packages/ui/src/lib/money.js';

const here = dirname(fileURLToPath(import.meta.url));
const fxPath = resolve(process.env.CAHYANA_API || resolve(here, '../../cahyana-api'), 'fx.js');
if (!existsSync(fxPath)) {
  console.error(`money-parity-test: ${fxPath} not found; clone cahyana-api beside this repo.`);
  process.exit(2);
}
const require = createRequire(import.meta.url);
const fx = require(fxPath);

let checked = 0;
let failed = 0;
function ok(cond, label) {
  checked += 1;
  if (!cond) { failed += 1; if (failed <= 15) console.log(`FAIL ${label}`); }
}

ok(JSON.stringify(CURRENCIES) === JSON.stringify(fx.CURRENCIES), `currency list matches fx.CURRENCIES (${fx.CURRENCIES})`);
ok(BASELINE_FX.buffer === fx.BUFFER, `buffer ${BASELINE_FX.buffer} = fx.BUFFER ${fx.BUFFER}`);
CURRENCIES.forEach((code) => {
  const want = fx.display(1000000, code);
  ok(displayFromIdr(1000000, code, BASELINE_FX) === want, `baseline ${code}: ${displayFromIdr(1000000, code, BASELINE_FX)} = ${want}`);
});

for (let value = 0.5; value < 5e6; value = value * 1.013 + 0.07) ok(ladder(value) === fx.ladder(value), `ladder(${value})`);

const prices = [1000, 150000, 1700000, 2500000, 3400000, 5000000, 7500000, 12500000];
let over = 0;
let seed = 7;
function random() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
for (let trial = 0; trial < 300; trial += 1) {
  const idrPerUsd = 15500 + random() * 3000;
  const rates = { IDR: 1 };
  Object.entries(BASELINE_FX.perUsd).forEach(([code, perUsd]) => { if (code !== 'IDR') rates[code] = (perUsd * (0.9 + random() * 0.2)) / idrPerUsd; });
  fx._setRates(rates);
  const snap = fx.snapshot();
  prices.forEach((idr) => CURRENCIES.forEach((code) => {
    const want = fx.display(idr, code);
    const got = displayFromIdr(idr, code, snap);
    ok(got >= want, `${code} ${idr} at ${idrPerUsd.toFixed(1)}: site ${got} never below server ${want}`);
    if (got > want) over += 1;
    ok(got === want || fx.ladder(want + 1e-6) === got, `${code} ${idr}: site ${got} at most one ladder step above ${want}`);
  }));
}

const pairs = 300 * prices.length * CURRENCIES.length;
console.log(`${checked - failed}/${checked} passed; site one step above server in ${over}/${pairs} (${((over / pairs) * 100).toFixed(2)}%), never below`);
process.exit(failed ? 1 : 0);
