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

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'villa-package-'));
const LOCAL_IMPORTS = {
  '../lib/cn.js': './cn.js',
  '../primitives/Eyebrow.jsx': './Eyebrow.js',
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
      /from ['"](react\/jsx-runtime|clsx)['"]/g,
      (match, pkg) => `from '${pathToFileURL(require.resolve(pkg)).href}'`,
    )
    .replace(/from ['"]([^'"]+)['"]/g, (match, spec) =>
      LOCAL_IMPORTS[spec] ? `from '${LOCAL_IMPORTS[spec]}'` : match,
    );
  fs.writeFileSync(path.join(out, name), js);
}
compileSource('lib/cn.js', 'cn.js');
compileSource('primitives/Eyebrow.jsx', 'Eyebrow.js');
compileSource('primitives/Coin.jsx', 'Coin.js');
compileSource('blocks/VillaPackageCard.jsx', 'card.js');
const { default: VillaPackageCard } = await import(pathToFileURL(path.join(out, 'card.js')).href);

let failed = 0;
function check(name, ok) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failed += 1;
}

function Mark(props) {
  return React.createElement('svg', { ...props, 'data-icon': 'mark' });
}
const props = {
  image: '/images/atv.webp',
  imageAlt: 'ATV in the jungle',
  badge: 'Best',
  eyebrow: 'Cahyana Tibuah · 3 nights',
  title: "Couple's ATV & Rafting",
  tagline: 'Two activity days.',
  items: [
    { label: 'Airport pickup', Icon: Mark },
    { label: 'ATV ride', Icon: Mark },
  ],
  priceLabel: 'From',
  price: '$483',
  coins: '+14 Cahyana Coins',
  note: 'Villa services are paid at the villa.',
  action: React.createElement('a', { href: '/book' }, 'Book'),
};
const full = renderToStaticMarkup(React.createElement(VillaPackageCard, props));
const bare = renderToStaticMarkup(React.createElement(VillaPackageCard, { title: 'Bare' }));

check('one card, marked for the sites to find', (full.match(/data-villa-package-card/g) || []).length === 1);
check(
  'the photo has its alt text',
  full.includes('src="/images/atv.webp"') && full.includes('alt="ATV in the jungle"'),
);
check('the title is the card heading', full.includes(`>Couple&#x27;s ATV &amp; Rafting</h3>`));
check(
  'every item shows with its icon',
  (full.match(/data-icon="mark"/g) || []).length === 2 && full.includes('ATV ride'),
);
check('the price shows with its label', /From<\/span><b[^>]*data-package-price[^>]*>\$483<\/b>/.test(full));
check('the coins line shows with the coin', full.includes('+14 Cahyana Coins') && full.includes('data-coin'));
check('the site action is rendered', full.includes('<a href="/book">Book</a>'));
check('the badge shows when given', full.includes('>Best</span>'));
check(
  'with nothing but a title: no badge, no price, no coins',
  !bare.includes('data-package-price') && !bare.includes('data-coin') && !bare.includes('<img'),
);

fs.rmSync(out, { recursive: true, force: true });
console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
