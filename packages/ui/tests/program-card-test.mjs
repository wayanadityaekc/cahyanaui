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

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'program-card-'));
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
      /from ['"](react\/jsx-runtime|lucide-react|clsx)['"]/g,
      (match, pkg) => `from '${pathToFileURL(require.resolve(pkg)).href}'`,
    )
    .replace(/from ['"]\.\.\/lib\/cn\.js['"]/, "from './cn.js'");
  fs.writeFileSync(path.join(out, name), js);
}
compileSource('lib/cn.js', 'cn.js');
compileSource('blocks/ProgramCard.jsx', 'card.js');
const { default: ProgramCard } = await import(pathToFileURL(path.join(out, 'card.js')).href);

let failed = 0;
function check(name, ok) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failed += 1;
}

const base = {
  href: 'https://cahyanaubudexperience.com/ubud-tour',
  title: 'Ubud: Rice Terrace & Monkey Forest',
  meta: '5–7 hours',
  cat: 'Nature',
  catLabel: 'Nature',
  image: { src: '/images/tegallalang-girl.webp', alt: 'Ubud Tour' },
};
const plainMarkup = renderToStaticMarkup(React.createElement(ProgramCard, { ...base, price: '$42' }));
const ratedMarkup = renderToStaticMarkup(
  React.createElement(ProgramCard, { ...base, price: 'Rp 650.000', rating: '4.9', ratingCount: 12 }),
);
const photolessMarkup = renderToStaticMarkup(React.createElement(ProgramCard, { ...base, image: null }));

check("CUE's 22px corners (rounded-xl), 4:5 card", /\brounded-xl\b/.test(plainMarkup) && plainMarkup.includes('aspect-[4/5]'));
check('no extra colour tint over the photo', !plainMarkup.includes('mix-blend-multiply'));
check("green categories get CUE's green accent", plainMarkup.includes('bg-[rgb(61,92,70)]'));
check(
  'one link with the photo and its alt text',
  (plainMarkup.match(/<a /g) || []).length === 1 && plainMarkup.includes('alt="Ubud Tour"'),
);
check('no rating yet shows New', /New<\/span>/.test(plainMarkup));
check('a rating shows the score and the count', ratedMarkup.includes('4.9') && ratedMarkup.includes('(12)'));
check('the currency symbol is set apart from the digits', plainMarkup.includes('mr-px">$</span>42'));
check('rupiah thousands are set smaller', ratedMarkup.includes('[vertical-align:0.05em]">000</span>'));
check(
  "no photo falls back to CUE's green gradient",
  photolessMarkup.includes('linear-gradient(135deg') && !photolessMarkup.includes('<img'),
);

console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
