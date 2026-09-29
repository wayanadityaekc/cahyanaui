#!/usr/bin/env node
/**
 * GATE: malformed Tailwind utilities in source.
 *
 * A utility that is misspelt in one specific way - a variant prefix with nothing
 * after it (`hover:`), or the same prefix twice (`hover:hover:bg-cta-d`) - does not
 * generate ANY CSS. So it is invisible in the built stylesheet, invisible in the
 * browser, and invisible to every computed-style harness in this repo: there is no
 * element to measure, because the rule was never written. The only place the damage
 * exists is the source text, which is why this gate reads source and not `out/`.
 *
 * It was written after a find-and-replace sweep (the Sep 2026 shadow removal) left
 * SIX of them behind, and two were worse than dead: in a concatenated class string
 * the dangling `hover:` glued onto the NEXT segment, so `min-[769px]:flex-col` became
 * `hover:min-[769px]:flex-col` and the desktop listing cards only took their column
 * layout while the pointer was over them. Four CI gates and three browser harnesses
 * all passed on that.
 *
 * Rule of thumb for the next sweep over class strings: removing a token with a
 * variant prefix means removing the PREFIX TOO, and a token that was an entire
 * array entry or line means removing the line.
 */
const { execSync } = require('node:child_process');
const { readFileSync } = require('node:fs');

const VARIANT = /^(hover|focus|focus-within|focus-visible|active|visited|target|disabled|checked|required|invalid|open|group-open|group-hover|group-focus|peer-[\w-]+|first|last|only|odd|even|first-of-type|last-of-type|empty|before|after|placeholder|file|marker|selection|backdrop|motion-reduce|motion-safe|standalone|dark|light|print|portrait|landscape|rtl|ltr|sm|md|lg|xl|2xl|min|max|aria-\[[^\]]*\]|data-\[[^\]]*\]|has-\[[^\]]*\]|not-has-\[[^\]]*\]|group-has-\[[^\]]*\]|peer-has-\[[^\]]*\]|max-\[[^\]]*\]|min-\[[^\]]*\]|supports-\[[^\]]*\]|\[@[^\]]*\]|\[&[^\]]*\])$/;

// A bare bracket like [k] is NOT a variant - that is a JS computed key. Tailwind
// arbitrary variants always carry & or @, and keeping the pattern that tight is what
// stops this gate from flagging every object literal in the repo.

// split on colons that sit outside [] and ()
function segments(tok) {
  const out = [];
  let depth = 0, cur = '';
  [...tok].forEach((ch) => {
    if (ch === '[' || ch === '(') depth++;
    else if (ch === ']' || ch === ')') depth--;
    if (ch === ':' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  });
  out.push(cur);
  return out;
}

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((l) => (/^\s*(\/\/|\*)/.test(l) ? '' : l.replace(/\s\/\/.*$/, '')))
    .join('\n');
}

const files = execSync(
  "git ls-files 'components/**/*.js' 'components/**/*.jsx' 'app/**/*.js' 'app/**/*.jsx' 'lib/**/*.js'",
  { encoding: 'utf8' },
).trim().split('\n').filter(Boolean);

const bad = [];
files.forEach((f) => {
  const lines = stripComments(readFileSync(f, 'utf8')).split('\n');
  lines.forEach((line, i) => {
    // Split on whitespace and string punctuation only - NOT on parens or brackets.
    // Arbitrary values are full of both (var(--x), [@media(min-width:769px)]), and
    // splitting there tears the token in half so the gate sees nothing wrong.
    line.split(/[\s'"`{};,]+/).filter(Boolean).forEach((tok) => {
      if (!tok.includes(':')) return;
      const parts = segments(tok);
      const last = parts.pop();
      if (!parts.length || !parts.every((p) => VARIANT.test(p))) return;
      if (last === '') bad.push([f, i + 1, tok, 'variant prefix with no utility after it']);
      else if (new Set(parts).size !== parts.length) bad.push([f, i + 1, tok, 'the same variant prefix twice']);
    });
    if (/var\(--\)/.test(line)) bad.push([f, i + 1, 'var(--)', 'empty custom property']);
  });
});

if (!bad.length) {
  console.log(`check-classes: OK (${files.length} files, no malformed utilities)`);
  process.exit(0);
}
console.error(`check-classes: ${bad.length} malformed utilit${bad.length > 1 ? 'ies' : 'y'}\n`);
bad.forEach(([f, l, tok, why]) => { console.error(`  ${f}:${l}\n    ${tok}\n    ${why} - it generates no CSS at all\n`); });
process.exit(1);
