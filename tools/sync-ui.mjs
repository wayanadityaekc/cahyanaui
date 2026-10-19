#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.resolve(import.meta.dirname, '..');
const DEST = path.resolve(process.argv[2] || path.join(HERE, '..', 'ubud-private-villas'));
const APP = path.join(HERE, 'apps', 'villas');

if (!fs.existsSync(path.join(DEST, '.git'))) {
  console.error(`not a repo: ${DEST}`);
  process.exit(1);
}

function copyDir(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

for (const d of ['app', 'components', 'lib', 'content']) {
  copyDir(path.join(APP, d), path.join(DEST, d));
}

function mergeDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, e.name);
    const dst = path.join(to, e.name);
    if (e.isDirectory()) mergeDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}
mergeDir(path.join(APP, 'public'), path.join(DEST, 'public'));
for (const f of ['next.config.js', 'jsconfig.json', 'postcss.config.mjs']) {
  const src = path.join(APP, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DEST, f));
}

copyDir(path.join(HERE, 'packages', 'ui'), path.join(DEST, 'packages', 'ui'));
fs.rmSync(path.join(DEST, 'packages', 'ui', 'node_modules'), { recursive: true, force: true });

const pkgPath = path.join(DEST, 'package.json');
const pkg = JSON.parse(fs.readFileSync(path.join(APP, 'package.json'), 'utf8'));
pkg.dependencies['@cahyana/ui'] = 'file:packages/ui';
pkg.dependencies = Object.fromEntries(Object.entries(pkg.dependencies).sort());
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

const cssPath = path.join(DEST, 'app', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');
const MONO = '@source "../../../packages/ui/src";';
const LIVE = `/* Vendored library path: if wrong, every library class is purged SILENTLY and components render unstyled. */
@source "../packages/ui/src";`;
if (!css.includes(MONO)) {
  console.error('the @source line was not where it was expected - check globals.css by hand');
  process.exit(1);
}
fs.writeFileSync(cssPath, css.replace(MONO, LIVE));

fs.writeFileSync(
  path.join(DEST, 'packages', 'ui', 'VENDORED.md'),
  `# This directory is a COPY. Do not edit it here.

\`@cahyana/ui\` lives in the monorepo, wayanadityaekc/cahyanaui, at \`packages/ui\`.
This copy exists for one reason: this repository is what actually deploys the
villa site, its CI runs \`npm ci\`, and npm cannot resolve a pnpm workspace
package that lives in another repository.

So the library is vendored here and referenced as \`"@cahyana/ui": "file:packages/ui"\`.

**Change the library in the monorepo, then re-run \`node tools/sync-ui.mjs\`
there.** An edit made here is lost at the next sync, and until then the two
copies disagree - which is exactly the drift the library was built to remove.

This goes away when Hostinger is pointed at the monorepo.
`,
);

console.log(`synced -> ${DEST}`);
console.log('now, in that repo:  npm install && npm run build');
