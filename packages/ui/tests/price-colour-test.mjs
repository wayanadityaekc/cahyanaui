import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.join(here, '../src');
const PRICE_WORDS = /price|PRICE|AMT|PBAR|amount|AMOUNT/;
const GOLD = /text-amber|tone = 'amber'/;

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return /\.(jsx|js)$/.test(entry.name) ? [full] : [];
  });
}

const goldPrices = listFiles(SOURCE).flatMap((file) =>
  fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .map((line, index) => ({ line, at: `${path.relative(SOURCE, file)}:${index + 1}` }))
    .filter(({ line }) => GOLD.test(line) && PRICE_WORDS.test(line))
    .map(({ at }) => at),
);
const calendar = fs.readFileSync(path.join(SOURCE, 'blocks/AvailabilityCalendar.jsx'), 'utf8');
const clearDates = (calendar.match(/const CLEAR_DATES =\s*'([^']+)'/) || [])[1] || '';

let failed = 0;
function reportCheck(name, pass, detail = '') {
  console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${detail ? `  (${detail})` : ''}`);
  if (!pass) failed += 1;
}
reportCheck('no price in the library is gold', goldPrices.length === 0, goldPrices.join(', '));
reportCheck(
  'Clear dates is a 32px outlined pill',
  /rounded-pill/.test(clearDates) &&
    /\bh-8\b/.test(clearDates) &&
    /border/.test(clearDates) &&
    !/underline/.test(clearDates),
  clearDates,
);
console.log(failed ? `\n${failed} check(s) failed` : '\nAll price colour checks passed');
process.exit(failed ? 1 : 0);
