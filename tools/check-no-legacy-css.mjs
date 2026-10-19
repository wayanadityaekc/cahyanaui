import fs from 'node:fs';
import path from 'node:path';

const OUT = process.argv[2];
const RETIRED = ['wrap', 'wrap-mid', 'wrap-read', 'section', 'card', 'card-hover',
  'badge', 'badge-amber', 'badge-cta', 'eyebrow', 'caps', 'btn', 'btn-cta',
  'btn-outline', 'btn-outline-light', 'btn-ghost', 'btn-sm', 'btn-full',
  'icon-circle', 'stars-amber', 'divider-line',
  'loadscreen', 'loadscreen--out', 'loadscreen__logo', 'loadscreen__spin'];
const KEPT = ['prose-copy', 'hs-locked', 'stickybar'];

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const files = walk(OUT);
let pass = 0, fail = 0;
const say = (c, m) => { if (c) pass++; else { fail++; console.log('  FAIL', m); } };

const css = files.filter((f) => f.endsWith('.css')).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
for (const c of RETIRED) {
  const re = new RegExp(`\\.${c.replace(/[-]/g, '\\-')}(?![\\w-])\\s*[,{:]`);
  say(!re.test(css), `stylesheet still defines .${c}`);
}
for (const c of KEPT) {
  const re = new RegExp(`\\.${c}(?![\\w-])`);
  say(re.test(css), `.${c} should still be present and is not`);
}

const html = files.filter((f) => f.endsWith('.html'));
for (const c of RETIRED) {
  const hits = [];
  for (const f of html) {
    const s = fs.readFileSync(f, 'utf8');
    for (const m of s.matchAll(/class="([^"]*)"/g)) {
      if (m[1].split(/\s+/).includes(c)) { hits.push(path.relative(OUT, f)); break; }
    }
  }
  say(hits.length === 0, `class "${c}" still in markup: ${hits.slice(0, 3).join(', ')}`);
}

console.log(`\n${pass}/${pass + fail} | ${html.length} pages, ${(css.length / 1024).toFixed(0)}KB css`);
process.exit(fail ? 1 : 0);
