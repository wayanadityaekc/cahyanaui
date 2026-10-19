import fs from 'node:fs';

const [, , beforeF, afterF] = process.argv;
if (!beforeF || !afterF) {
  console.error('usage: node tools/tw/diff.mjs <before.json> <after.json>');
  process.exit(2);
}
const beforeSnapshot = JSON.parse(fs.readFileSync(beforeF, 'utf8'));
const afterSnapshot = JSON.parse(fs.readFileSync(afterF, 'utf8'));

function normalizeShadow(shadowValue) {
  return typeof shadowValue === 'string'
    ? shadowValue.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?/g, '')
    : shadowValue;
}

let diffs = 0;
const samples = [];
Object.keys(beforeSnapshot).forEach((vw) => {
  const bv = beforeSnapshot[vw] || [],
    av = afterSnapshot[vw] || [];
  if (bv.length !== av.length) {
    diffs += 999;
    samples.push(`@${vw} ELEMENT COUNT ${bv.length} != ${av.length}`);
    return;
  }
  bv.forEach((beforeEntry, index) => {
    Object.keys(bv[index]).forEach((propertyName) => {
      let beforeValue = bv[index][propertyName],
        afterValue = av[index][propertyName];
      if (propertyName === 'boxShadow') {
        beforeValue = normalizeShadow(beforeValue);
        afterValue = normalizeShadow(afterValue);
      }
      if (beforeValue === afterValue) return;
      diffs++;
      if (samples.length < 40)
        samples.push(
          `@${vw} el${index}(${bv[index]._t}) ${propertyName}: ${JSON.stringify(beforeValue)} -> ${JSON.stringify(afterValue)}`,
        );
    });
  });
});
if (diffs === 0) {
  console.log('IDENTICAL');
  process.exit(0);
}
console.log(`DIFF (${diffs}):`);
samples.forEach((sample) => console.log(`  ${sample}`));
process.exit(1);
