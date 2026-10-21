import { FOOT_COMPACT } from '../src/blocks/footerClasses.js';

let failed = 0;
function reportCheck(name, pass, detail = '') {
  console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${detail ? `  (${detail})` : ''}`);
  if (!pass) failed += 1;
}

const classes = FOOT_COMPACT.split(/\s+/);
reportCheck(
  'the short footer is fixed from 993px only',
  classes.includes('min-[993px]:fixed') && !classes.includes('fixed'),
  FOOT_COMPACT,
);
reportCheck(
  'below 993px it sits at the end of the page',
  classes.includes('static') && classes.includes('max-[992px]:mt-auto'),
);
console.log(failed ? `\n${failed} check(s) failed` : '\nAll short footer checks passed');
process.exit(failed ? 1 : 0);
