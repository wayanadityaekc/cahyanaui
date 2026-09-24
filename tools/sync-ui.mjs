#!/usr/bin/env node
/**
 * Push the monorepo's villa app + library into the STANDALONE villa repo, which
 * is what actually deploys the site today.
 *
 * WHY THIS EXISTS. The villa site is served from wayanadityaekc/ubud-private-villas
 * and its CI runs `npm ci`. npm cannot resolve a pnpm workspace package that
 * lives in a different repository, so the library is vendored there and
 * referenced as `file:packages/ui`. That is a COPY, and a copy drifts - so
 * copying is mechanical and one-way, never by hand, and never in reverse.
 *
 * This goes away when Hostinger is pointed at the monorepo. That is a change in
 * the hosting panel, not in code.
 *
 *   node tools/sync-ui.mjs [path-to-villa-repo]
 *
 * TWO THINGS DIFFER BETWEEN THE REPOS, and both fail SILENTLY if missed:
 *   1. package.json      workspace:*  ->  file:packages/ui
 *   2. globals.css       the @source path is one level shorter
 * A wrong @source does not error: every class used inside a library component
 * is purged and the component renders unstyled.
 */
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.resolve(import.meta.dirname, '..');
const DEST = path.resolve(process.argv[2] || path.join(HERE, '..', 'ubud-private-villas'));
const APP = path.join(HERE, 'apps', 'villas');

if (!fs.existsSync(path.join(DEST, '.git'))) {
  console.error(`not a repo: ${DEST}`);
  process.exit(1);
}

const copyDir = (from, to) => {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
};

// Source trees. `public/` is deliberately NOT synced: the live repo owns the
// photographs, and copying over them from a checkout that may be missing some
// would delete them.
for (const d of ['app', 'components', 'lib', 'content']) {
  copyDir(path.join(APP, d), path.join(DEST, d));
}
for (const f of ['next.config.js', 'jsconfig.json', 'postcss.config.mjs']) {
  const src = path.join(APP, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DEST, f));
}

// The library, minus anything installed.
copyDir(path.join(HERE, 'packages', 'ui'), path.join(DEST, 'packages', 'ui'));
fs.rmSync(path.join(DEST, 'packages', 'ui', 'node_modules'), { recursive: true, force: true });

// 1. the dependency form
const pkgPath = path.join(DEST, 'package.json');
const pkg = JSON.parse(fs.readFileSync(path.join(APP, 'package.json'), 'utf8'));
pkg.dependencies['@cahyana/ui'] = 'file:packages/ui';
pkg.dependencies = Object.fromEntries(Object.entries(pkg.dependencies).sort());
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// 2. the @source path
const cssPath = path.join(DEST, 'app', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');
const MONO = '@source "../../../packages/ui/src";';
const LIVE = `/* The library is VENDORED here (see packages/ui/VENDORED.md), so this path is
   one level shorter than the monorepo's. It is the one line the sync has to
   rewrite, and it fails SILENTLY if it is wrong: every class used inside a
   library component is simply purged and the component renders unstyled. */
@source "../packages/ui/src";`;
if (!css.includes(MONO)) {
  console.error('the @source line was not where it was expected - check globals.css by hand');
  process.exit(1);
}
fs.writeFileSync(cssPath, css.replace(MONO, LIVE));

fs.writeFileSync(path.join(DEST, 'packages', 'ui', 'VENDORED.md'), `# This directory is a COPY. Do not edit it here.

\`@cahyana/ui\` lives in the monorepo, wayanadityaekc/cahyanaui, at \`packages/ui\`.
This copy exists for one reason: this repository is what actually deploys the
villa site, its CI runs \`npm ci\`, and npm cannot resolve a pnpm workspace
package that lives in another repository.

So the library is vendored here and referenced as \`"@cahyana/ui": "file:packages/ui"\`.

**Change the library in the monorepo, then re-run \`node tools/sync-ui.mjs\`
there.** An edit made here is lost at the next sync, and until then the two
copies disagree - which is exactly the drift the library was built to remove.

This goes away when Hostinger is pointed at the monorepo.
`);

console.log(`synced -> ${DEST}`);
console.log('now, in that repo:  npm install && npm run build');
