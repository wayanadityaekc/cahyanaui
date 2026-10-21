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

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'consent-'));
const LOCAL_IMPORTS = {
  '../lib/cn.js': './cn.js',
  '../primitives/Button.jsx': './Button.js',
  './btnClasses.js': './btnClasses.js',
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
      /from ['"](react\/jsx-runtime|motion\/react|clsx)['"]/g,
      (match, pkg) => `from '${pathToFileURL(require.resolve(pkg)).href}'`,
    )
    .replace(/from ['"]([^'"]+)['"]/g, (match, spec) =>
      LOCAL_IMPORTS[spec] ? `from '${LOCAL_IMPORTS[spec]}'` : match,
    );
  fs.writeFileSync(path.join(out, name), js);
}
compileSource('lib/cn.js', 'cn.js');
compileSource('primitives/btnClasses.js', 'btnClasses.js');
compileSource('primitives/Button.jsx', 'Button.js');
compileSource('blocks/ConsentBanner.jsx', 'banner.js');
const { default: ConsentBanner } = await import(pathToFileURL(path.join(out, 'banner.js')).href);

let failed = 0;
function check(name, ok) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failed += 1;
}

const labels = {
  title: 'Cookies test',
  body: 'Body text here.',
  policyLabel: 'Policy here',
  policyHref: '/ja/our-company#privacy',
  acceptLabel: 'Yes all',
  necessaryLabel: 'Only needed',
  rejectLabel: 'No thanks',
};
const closed = renderToStaticMarkup(React.createElement(ConsentBanner, { ...labels, isOpen: false }));
const open = renderToStaticMarkup(React.createElement(ConsentBanner, { ...labels, isOpen: true }));
const buttons = [...open.matchAll(/<button[^>]*>([^<]*)<\/button>/g)].map((match) => match[1]);

check('closed: nothing is drawn', closed === '');
check(
  'open: one region named by the title',
  (open.match(/role="region"/g) || []).length === 1 && open.includes('aria-label="Cookies test"'),
);
check('open: the title and the body show', open.includes('>Cookies test</p>') && open.includes('Body text here.'));
check(
  'the policy link goes where the site says',
  open.includes('href="/ja/our-company#privacy"') && open.includes('>Policy here</a>'),
);
check(
  'three buttons: accept, only necessary, reject, in that order',
  JSON.stringify(buttons) === JSON.stringify(['Yes all', 'Only needed', 'No thanks']),
);
check(
  'accept is the primary button, the other two are ghost',
  /data-btn="primary"[^>]*>Yes all/.test(open) && (open.match(/data-btn="ghost"/g) || []).length === 2,
);
check(
  'the panel sits on top of the phone footer bar (z 96 over 90)',
  open.includes('z-[96]') && open.includes('fixed'),
);
check('the panel is marked for the sites to find', open.includes('data-consent-banner'));

fs.rmSync(out, { recursive: true, force: true });
console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
