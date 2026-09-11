// tools/tw/diffx.mjs — diff for snapx.mjs snapshots (element main + ::before + ::after).
// Prints "IDENTICAL" (exit 0) or per-element/pseudo property diffs (exit 1).
// Usage: node tools/tw/diffx.mjs <before.json> <after.json>
import fs from 'node:fs';
const [, , bF, aF] = process.argv;
if (!bF || !aF) { console.error('usage: node tools/tw/diffx.mjs <before.json> <after.json>'); process.exit(2); }
const B = JSON.parse(fs.readFileSync(bF, 'utf8'));
const A = JSON.parse(fs.readFileSync(aF, 'utf8'));
const normShadow = (v) => (typeof v === 'string' ? v.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?/g, '') : v);
let diffs = 0; const samples = [];
for (const vw of Object.keys(B)) {
  const bv = B[vw] || [], av = A[vw] || [];
  if (bv.length !== av.length) { diffs += 999; samples.push(`@${vw} COUNT ${bv.length}!=${av.length}`); continue; }
  for (let i = 0; i < bv.length; i++) {
    for (const layer of ['main', 'before', 'after']) {
      const bo = bv[i][layer] || {}, ao = av[i][layer] || {};
      for (const k of Object.keys(bo)) {
        let x = bo[k], y = ao[k];
        if (k === 'boxShadow') { x = normShadow(x); y = normShadow(y); }
        if (x !== y) { diffs++; if (samples.length < 40) samples.push(`@${vw} el${i}(${bv[i]._t}) ${layer}.${k}: ${JSON.stringify(x)} -> ${JSON.stringify(y)}`); }
      }
    }
  }
}
if (diffs === 0) { console.log('IDENTICAL'); process.exit(0); }
console.log(`DIFF (${diffs}):`);
samples.forEach((s) => console.log('  ' + s));
process.exit(1);
