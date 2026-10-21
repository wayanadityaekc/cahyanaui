import { SECTION, SECTION_TONES } from '../src/blocks/layoutClasses.js';

const BORDER = /\bborder(-[xytblr])?\b|\[border/;

let failed = 0;
function reportCheck(name, pass, detail = '') {
  console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${detail ? `  (${detail})` : ''}`);
  if (!pass) failed += 1;
}

const lined = Object.entries(SECTION_TONES).filter(([, classes]) => BORDER.test(classes));
reportCheck(
  'no section tone draws a line between sections',
  lined.length === 0,
  lined.map(([tone]) => tone).join(', '),
);
reportCheck('the section padding has no line either', !BORDER.test(SECTION), SECTION);
console.log(failed ? `\n${failed} check(s) failed` : '\nAll section line checks passed');
process.exit(failed ? 1 : 0);
