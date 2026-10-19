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

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'pill-'));
function compile(rel, name) {
  const code = fs.readFileSync(path.join(here, '../src', rel), 'utf8');
  let js = swc.transformSync(code, { filename: rel, jsc: { parser: { syntax: 'ecmascript', jsx: true }, transform: { react: { runtime: 'automatic' } }, target: 'es2022' }, module: { type: 'es6' } }).code;
  js = js.replace(/from ['"](react\/jsx-runtime|lucide-react|clsx)['"]/g, (match, pkg) => `from '${pathToFileURL(require.resolve(pkg)).href}'`)
    .replace(/from ['"]\.\.\/lib\/cn\.js['"]/, "from './cn.js'");
  fs.writeFileSync(path.join(out, name), js);
}
compile('lib/cn.js', 'cn.js');
compile('blocks/MyCahyanaPill.jsx', 'pill.js');
const { default: MyCahyanaPill } = await import(pathToFileURL(path.join(out, 'pill.js')).href);

let failed = 0;
function check(name, ok) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) failed += 1; }

const href = 'https://my.cahyanaubudexperience.com/my-trips';
const fresh = renderToStaticMarkup(React.createElement(MyCahyanaPill, { href, seen: false }));
const seen = renderToStaticMarkup(React.createElement(MyCahyanaPill, { href, seen: true }));
const anchors = fresh.match(/<a /g) || [];

check('one link, to the my. address', anchors.length === 1 && fresh.includes(`href="${href}"`));
check('named "My Cahyana" for screen readers', fresh.includes('aria-label="My Cahyana"'));
check('person and bag icons inside the one link', /lucide-user-round/.test(fresh) && /lucide-shopping-bag/.test(fresh));
check('dot shows before the first tap', fresh.includes('data-my-pill-dot'));
check('dot gone once seen', !seen.includes('data-my-pill-dot'));
check('no number on the bag', !/>\s*\d+\s*</.test(fresh));
check("the EN button's box: 32px high, 12px corners, line border", /\bh-8\b/.test(fresh) && /\brounded-md\b/.test(fresh) && fresh.includes('[border:1px_solid_var(--line)]'));
function onTap() {}
check('onTap is the click handler', MyCahyanaPill({ href, onTap }).props.onClick === onTap);

fs.rmSync(out, { recursive: true, force: true });
console.log(failed ? `\n${failed} failed` : '\nall passed');
process.exit(failed ? 1 : 0);
