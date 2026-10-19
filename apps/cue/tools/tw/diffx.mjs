import fs from 'node:fs';
const [, , bF, aF] = process.argv;
if (!bF || !aF) {
  console.error('usage: node tools/tw/diffx.mjs <before.json> <after.json>');
  process.exit(2);
}
const beforeSnapshot = JSON.parse(fs.readFileSync(bF, 'utf8'));
const afterSnapshot = JSON.parse(fs.readFileSync(aF, 'utf8'));
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
    samples.push(`@${vw} COUNT ${bv.length}!=${av.length}`);
    return;
  }
  bv.forEach((beforeEntry, index) => {
    ['main', 'before', 'after'].forEach((layer) => {
      const bo = bv[index][layer] || {},
        ao = av[index][layer] || {};
      Object.keys(bo).forEach((propertyName) => {
        let beforeValue = bo[propertyName],
          afterValue = ao[propertyName];
        if (propertyName === 'boxShadow') {
          beforeValue = normalizeShadow(beforeValue);
          afterValue = normalizeShadow(afterValue);
        }
        if (beforeValue !== afterValue) {
          diffs++;
          if (samples.length < 40)
            samples.push(
              `@${vw} el${index}(${bv[index]._t}) ${layer}.${propertyName}: ${JSON.stringify(beforeValue)} -> ${JSON.stringify(afterValue)}`,
            );
        }
      });
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
