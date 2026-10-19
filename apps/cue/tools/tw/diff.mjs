import fs from 'node:fs';

const [, , beforeF, afterF] = process.argv;
if (!beforeF || !afterF) { console.error('usage: node tools/tw/diff.mjs <before.json> <after.json>'); process.exit(2); }
const B = JSON.parse(fs.readFileSync(beforeF, 'utf8'));
const A = JSON.parse(fs.readFileSync(afterF, 'utf8'));

function normShadow(v) { return (typeof v === 'string' ? v.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?/g, '') : v); }

let diffs = 0;
const samples = [];
Object.keys(B).forEach((vw) => {
  const bv = B[vw] || [], av = A[vw] || [];
  if (bv.length !== av.length) { diffs += 999; samples.push(`@${vw} ELEMENT COUNT ${bv.length} != ${av.length}`); return; }
  bv.forEach((_, i) => {
    Object.keys(bv[i]).forEach((k) => {
      let x = bv[i][k], y = av[i][k];
      if (k === 'boxShadow') { x = normShadow(x); y = normShadow(y); }
      if (x !== y) { diffs++; if (samples.length < 40) samples.push(`@${vw} el${i}(${bv[i]._t}) ${k}: ${JSON.stringify(x)} -> ${JSON.stringify(y)}`); }
    });
  });
});
if (diffs === 0) { console.log('IDENTICAL'); process.exit(0); }
console.log(`DIFF (${diffs}):`);
samples.forEach((s) => console.log(`  ${s}`));
process.exit(1);
