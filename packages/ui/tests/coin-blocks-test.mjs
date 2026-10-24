import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const deps = path.resolve(process.argv[2] || path.join(here, '../../../../ubud-private-villas/node_modules'));
const require = createRequire(path.join(deps, 'x.js'));
const swc = require('@swc/core');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'coin-blocks-'));
const LOCAL_IMPORTS = {
  '../lib/cn.js': './cn.js',
  '../primitives/Coin.jsx': './Coin.js',
};
function compileSource(rel, name) {
  const code = fs.readFileSync(path.join(here, '../src', rel), 'utf8');
  let js = swc.transformSync(code, {
    filename: rel,
    jsc: {
      parser: { syntax: 'ecmascript', jsx: true },
      transform: { react: { runtime: 'automatic' } },
      target: 'es2022',
    },
    module: { type: 'es6' },
  }).code;
  js = js
    .replace(
      /from ['"](react\/jsx-runtime|clsx|lucide-react)['"]/g,
      (match, pkg) => `from '${pathToFileURL(require.resolve(pkg)).href}'`,
    )
    .replace(/from ['"]([^'"]+)['"]/g, (match, spec) =>
      LOCAL_IMPORTS[spec] ? `from '${LOCAL_IMPORTS[spec]}'` : match,
    );
  fs.writeFileSync(path.join(out, name), js);
}
compileSource('lib/cn.js', 'cn.js');
compileSource('primitives/Coin.jsx', 'Coin.js');
compileSource('blocks/UseCoin.jsx', 'UseCoin.js');
compileSource('blocks/CoinPrice.jsx', 'CoinPrice.js');
compileSource('blocks/CoinBalance.jsx', 'CoinBalance.js');
compileSource('blocks/PayOptions.jsx', 'PayOptions.js');
async function importBlock(name) {
  return (await import(pathToFileURL(path.join(out, name)).href)).default;
}
const UseCoin = await importBlock('UseCoin.js');
const CoinPrice = await importBlock('CoinPrice.js');
const CoinBalance = await importBlock('CoinBalance.js');
const PayOptions = await importBlock('PayOptions.js');

let failed = 0;
function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !detail ? '' : `  (${detail})`}`);
  if (!ok) failed += 1;
}
function render(Component, props) {
  return renderToStaticMarkup(React.createElement(Component, props));
}
function countMatches(markup, pattern) {
  return (markup.match(pattern) || []).length;
}
function readText(markup) {
  return markup.replace(/<[^>]+>/g, '');
}

const off = render(UseCoin, { variant: 'cta' });
const oldStepperProps = render(UseCoin, { variant: 'cta', coins: 3, onChange: () => {}, countText: '3 coins' });
const on = render(UseCoin, { variant: 'cta', on: true, countText: '1,200 coins' });
const offBlocked = render(UseCoin, { canUse: false });
const onBlocked = render(UseCoin, { on: true, canUse: false });

check('Use coin: one button, nothing else to press', countMatches(off, /<button/g) === 1, off);
check(
  'Use coin: off by default, labelled "Use coin"',
  off.includes('aria-pressed="false"') && readText(off) === 'Use coin',
);
check(
  'Use coin: no coin count to pick (no stepper, no less / more buttons)',
  countMatches(oldStepperProps, /<button/g) === 1 &&
    !oldStepperProps.includes('data-coin-stepper') &&
    !/coin (less|more)/i.test(oldStepperProps),
  oldStepperProps,
);
check(
  'Use coin: pressed when on, with the coins the server used',
  on.includes('aria-pressed="true"') && on.includes('aria-label="Use coin · 1,200 coins"'),
  on,
);
check('Use coin: cannot be turned on without usable coins', /<button[^>]*disabled=""/.test(offBlocked), offBlocked);
check('Use coin: can always be turned off', !/<button[^>]*disabled=""/.test(onBlocked), onBlocked);

const struck = render(CoinPrice, { was: '$480', now: '$300' });
const plain = render(CoinPrice, { now: '$480' });
check(
  'Coin price: the list price struck through, then the new price',
  /<s[^>]*data-coin-was[^>]*>\$480<\/s><span data-coin-now[^>]*>\$300<\/span>/.test(struck),
  struck,
);
check('Coin price: no maths shown, only the two prices', readText(struck) === '$480$300', readText(struck));
check('Coin price: no coin, no struck price', !/<s[\s>]/.test(plain) && readText(plain) === '$480', plain);

const balance = render(CoinBalance, {
  lead: 'Your Cahyana Coins',
  countText: '12 coins',
  pendingText: '40 coins pending',
  owedText: '5 coins to pay back',
});
const balanceClear = render(CoinBalance, { countText: '12 coins' });
check(
  'Balance: usable, pending and owed each on their own line',
  /data-coin-usable[^>]*>12 coins</.test(balance) &&
    /data-coin-pending[^>]*>40 coins pending</.test(balance) &&
    /data-coin-owed[^>]*>5 coins to pay back</.test(balance),
  balance,
);
check(
  'Balance: no pending and no owed line when there is none',
  !balanceClear.includes('data-coin-pending') && !balanceClear.includes('data-coin-owed'),
  balanceClear,
);

const options = [
  { id: 'full', label: 'Pay everything now', amount: '$300' },
  { id: 'deposit', label: 'Deposit now', amount: '$10' },
];
const withCoin = render(PayOptions, {
  options: options.map((option) => (option.id === 'full' ? option : { ...option, available: false })),
  value: 'full',
});
const withoutCoin = render(PayOptions, { options, value: 'full' });
check(
  'Payment step: the deposit the quote marks unavailable is not shown',
  withCoin.includes('data-pay-option="full"') && !withCoin.includes('data-pay-option="deposit"'),
  withCoin,
);
check(
  'Payment step: without a coin both options show',
  withoutCoin.includes('data-pay-option="full"') && withoutCoin.includes('data-pay-option="deposit"'),
);

fs.rmSync(out, { recursive: true, force: true });
console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
