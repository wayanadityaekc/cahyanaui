import fs from 'node:fs';
import path from 'node:path';

const OUT = process.argv[2];
if (!OUT || !fs.existsSync(OUT)) {
  console.error('Usage: node tools/check-no-legacy-css.mjs <path to a site build out/ folder>');
  process.exit(2);
}
const RETIRED = [
  'wrap',
  'wrap-mid',
  'wrap-read',
  'section',
  'card',
  'card-hover',
  'badge',
  'badge-amber',
  'badge-cta',
  'eyebrow',
  'caps',
  'btn',
  'btn-cta',
  'btn-outline',
  'btn-outline-light',
  'btn-ghost',
  'btn-sm',
  'btn-full',
  'icon-circle',
  'stars-amber',
  'divider-line',
  'loadscreen',
  'loadscreen--out',
  'loadscreen__logo',
  'loadscreen__spin',
];
const KEPT = ['prose-copy', 'hs-locked', 'stickybar'];

function walk(directoryPath, out = []) {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) walk(entryPath, out);
    else out.push(entryPath);
  }
  return out;
}
const files = walk(OUT);
let pass = 0,
  fail = 0;
function recordCheck(isPassing, message) {
  if (isPassing) pass++;
  else {
    fail++;
    console.log('  FAIL', message);
  }
}

const css = files
  .filter((file) => file.endsWith('.css'))
  .map((cssFile) => fs.readFileSync(cssFile, 'utf8'))
  .join('\n');
for (const retiredClass of RETIRED) {
  const pattern = new RegExp(`\\.${retiredClass.replace(/[-]/g, '\\-')}(?![\\w-])\\s*[,{:]`);
  recordCheck(!pattern.test(css), `stylesheet still defines .${retiredClass}`);
}
for (const keptClass of KEPT) {
  const pattern = new RegExp(`\\.${keptClass}(?![\\w-])`);
  recordCheck(pattern.test(css), `.${keptClass} should still be present and is not`);
}

const htmlFiles = files.filter((file) => file.endsWith('.html'));
for (const retiredClass of RETIRED) {
  const hits = [];
  for (const htmlFile of htmlFiles) {
    const htmlSource = fs.readFileSync(htmlFile, 'utf8');
    for (const classMatch of htmlSource.matchAll(/class="([^"]*)"/g)) {
      if (classMatch[1].split(/\s+/).includes(retiredClass)) {
        hits.push(path.relative(OUT, htmlFile));
        break;
      }
    }
  }
  recordCheck(hits.length === 0, `class "${retiredClass}" still in markup: ${hits.slice(0, 3).join(', ')}`);
}

console.log(`\n${pass}/${pass + fail} | ${htmlFiles.length} pages, ${(css.length / 1024).toFixed(0)}KB css`);
process.exit(fail ? 1 : 0);
