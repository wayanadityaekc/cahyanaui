import fs from 'node:fs';

const [, , file, deadSrc, keepSrc] = process.argv;
if (!file || !deadSrc) {
  console.error('usage: node tools/tw/remove-fam.mjs <file.css> "<deadRegex>" ["<keepRegex>"]');
  process.exit(2);
}
const DEAD = new RegExp(deadSrc);
const KEEP = keepSrc ? new RegExp(keepSrc) : null;
let css = fs.readFileSync(file, 'utf8');

function checkIsSelectorDead(selector) {
  if (KEEP && KEEP.test(selector)) return false;
  return DEAD.test(selector);
}
function findBrace(cssText, from) {
  let position = from;
  const cssLength = cssText.length;
  while (position < cssLength) {
    const character = cssText[position];
    if (character === '/' && cssText[position + 1] === '*') {
      const commentEnd = cssText.indexOf('*/', position + 2);
      position = commentEnd === -1 ? cssLength : commentEnd + 2;
      continue;
    }
    if (character === '"' || character === "'") {
      let scanPosition = position + 1;
      while (scanPosition < cssLength && cssText[scanPosition] !== character) {
        if (cssText[scanPosition] === '\\') scanPosition++;
        scanPosition++;
      }
      position = scanPosition + 1;
      continue;
    }
    if (character === '{') return position;
    position++;
  }
  return -1;
}
function matchClose(cssText, open) {
  let depth = 0,
    position = open;
  const cssLength = cssText.length;
  while (position < cssLength) {
    const character = cssText[position];
    if (character === '/' && cssText[position + 1] === '*') {
      const commentEnd = cssText.indexOf('*/', position + 2);
      position = commentEnd === -1 ? cssLength : commentEnd + 2;
      continue;
    }
    if (character === '"' || character === "'") {
      let scanPosition = position + 1;
      while (scanPosition < cssLength && cssText[scanPosition] !== character) {
        if (cssText[scanPosition] === '\\') scanPosition++;
        scanPosition++;
      }
      position = scanPosition + 1;
      continue;
    }
    if (character === '{') depth++;
    else if (character === '}') {
      depth--;
      if (depth === 0) return position;
    }
    position++;
  }
  return cssLength - 1;
}
function processBlock(blockText) {
  let out = '';
  let position = 0;
  const blockLength = blockText.length;
  while (position < blockLength) {
    const brace = findBrace(blockText, position);
    if (brace === -1) {
      out += blockText.slice(position);
      break;
    }
    const prelude = blockText.slice(position, brace);
    const close = matchClose(blockText, brace);
    const body = blockText.slice(brace + 1, close);
    const trimmedPrelude = prelude.replace(/^\s*(?:\/\*[\s\S]*?\*\/\s*)*/, '').trim();
    if (/^@media|^@supports/.test(trimmedPrelude)) {
      const inner = processBlock(body);
      if (inner.replace(/\/\*[\s\S]*?\*\//g, '').trim() !== '') out += `${prelude}{${inner}}`;
    } else if (/^@/.test(trimmedPrelude)) {
      out += `${prelude}{${body}}`;
    } else {
      const clean = prelude.replace(/\/\*[\s\S]*?\*\//g, '');
      const sels = clean
        .split(',')
        .map((line) => line.replace(/\n/g, ' ').trim())
        .filter(Boolean);
      const keptSelectors = sels.filter((sx) => !checkIsSelectorDead(sx));
      if (keptSelectors.length === 0) {
      } else if (keptSelectors.length === sels.length) out += `${prelude}{${body}}`;
      else {
        const lead = (prelude.match(/^(\s*(?:\/\*[\s\S]*?\*\/\s*)*)/) || [''])[0];
        out += `${lead}${keptSelectors.join(',\n')} {${body}}`;
      }
    }
    position = close + 1;
  }
  return out;
}

const before = css.length;
css = processBlock(css);
fs.writeFileSync(file, css);
const openBraceCount = (css.match(/{/g) || []).length,
  closeBraceCount = (css.match(/}/g) || []).length;
console.log(
  `removed from ${file} | chars ${before} -> ${css.length} | braces ${openBraceCount === closeBraceCount ? 'OK' : `MISMATCH ${openBraceCount}/${closeBraceCount}`}`,
);
if (openBraceCount !== closeBraceCount) process.exit(1);
