import { contactSchema, signInSchema, createAccountSchema, reviewSchema, bookingSchema } from '../lib/schemas.js';
import { validateWith } from '../lib/validate.js';

const STRINGS = ['', '   ', 'x', 'Wayan Aditya'];
const EMAILS = ['', '  ', 'nope', 'a@b', 'a@b.c', ' a@b.co '];
let checked = 0;
const bad = [];

function cmp(label, oldMsg, { ok, errors }, field) {
  checked++;
  const newMsg = ok ? '' : errors[field] || '';
  const isOldValid = !oldMsg;
  if (isOldValid !== (newMsg === '')) bad.push(`${label}: old=${JSON.stringify(oldMsg)} new=${JSON.stringify(newMsg)}`);
  else if (oldMsg && oldMsg !== newMsg)
    bad.push(`${label}: message differs old=${JSON.stringify(oldMsg)} new=${JSON.stringify(newMsg)}`);
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function combos(lists) {
  return Object.entries(lists).reduce(
    (combinations, [key, values]) =>
      combinations.flatMap((combination) => values.map((val) => ({ ...combination, [key]: val }))),
    [{}],
  );
}

combos({ name: STRINGS, em: EMAILS, message: STRINGS }).forEach(({ name, em, message }) => {
  const formValues = { name, email: em, message };
  const result = validateWith(contactSchema, formValues);
  cmp(`contact name=${JSON.stringify(name)}`, !name.trim() ? 'Please enter your name.' : '', result, 'name');
  cmp(
    `contact email=${JSON.stringify(em)}`,
    !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '',
    result,
    'email',
  );
  cmp(`contact msg=${JSON.stringify(message)}`, !message.trim() ? 'Please enter a message.' : '', result, 'message');
});

EMAILS.forEach((em) => {
  const result = validateWith(signInSchema, { email: em });
  cmp(
    `signin email=${JSON.stringify(em)}`,
    !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '',
    result,
    'email',
  );
});
combos({ name: STRINGS, em: EMAILS, phone: STRINGS }).forEach(({ name, em, phone }) => {
  const result = validateWith(createAccountSchema, { name, email: em, phone });
  cmp(`create name=${JSON.stringify(name)}`, !name.trim() ? 'Please enter your name.' : '', result, 'name');
  cmp(
    `create email=${JSON.stringify(em)}`,
    !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '',
    result,
    'email',
  );
  cmp(`create phone=${JSON.stringify(phone)}`, !phone.trim() ? 'Please enter your phone number.' : '', result, 'phone');
});

combos({ picked: [[], ['a'], ['a', 'b']], rating: [0, 1, 5], message: STRINGS }).forEach(
  ({ picked, rating, message }) => {
    const result = validateWith(reviewSchema, { picked, rating, message });
    cmp(
      `review picked=${picked.length}`,
      !picked.length ? 'Please pick at least one tour to review.' : '',
      result,
      'picked',
    );
    cmp(`review rating=${rating}`, !rating ? 'Please give a star rating.' : '', result, 'rating');
    cmp(`review msg=${JSON.stringify(message)}`, !message.trim() ? 'Please write your review.' : '', result, 'message');
  },
);

const FLAGS = combos({
  pickupOptional: [false, true],
  dropoffRequired: [false, true],
  needsTime: [false, true],
  needsFlight: [false, true],
});

FLAGS.forEach((flags) => {
  const schema = bookingSchema(flags);
  combos({
    name: STRINGS,
    phone: ['', 'x'],
    em: EMAILS,
    pickup: STRINGS,
    dropoff: ['', 'x'],
    time: ['', '09:00'],
    flightNumber: ['', 'QZ7501'],
    flightDatetime: ['', '2026-10-01T10:00'],
  }).forEach(({ name, phone, em, pickup, dropoff, time, flightNumber, flightDatetime }) => {
    const formValues = { name, phone, email: em, pickup, dropoff, time, flightNumber, flightDatetime, referral: '' };
    const result = validateWith(schema, formValues);
    const flagsJson = JSON.stringify(flags);
    cmp(`book${flagsJson} name`, !name.trim() ? 'Please enter your name.' : '', result, 'name');
    cmp(`book${flagsJson} phone`, !phone.trim() ? 'Please enter your phone number.' : '', result, 'phone');
    cmp(
      `book${flagsJson} email`,
      !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '',
      result,
      'email',
    );
    cmp(
      `book${flagsJson} pickup`,
      !flags.pickupOptional && !pickup.trim() ? 'Please enter your pick-up location.' : '',
      result,
      'pickup',
    );
    cmp(
      `book${flagsJson} dropoff`,
      flags.dropoffRequired && !dropoff.trim() ? 'Please enter your drop-off location.' : '',
      result,
      'dropoff',
    );
    cmp(`book${flagsJson} time`, flags.needsTime && !time ? 'Please select a pickup time.' : '', result, 'time');
    cmp(
      `book${flagsJson} flightNumber`,
      flags.needsFlight && !flightNumber.trim() ? 'Please enter your flight number.' : '',
      result,
      'flightNumber',
    );
    cmp(
      `book${flagsJson} flightDatetime`,
      flags.needsFlight && !flightDatetime ? 'Please enter your flight date & time.' : '',
      result,
      'flightDatetime',
    );
  });
});

console.log(`compared ${checked} field outcomes`);
if (bad.length) {
  console.log(`MISMATCHES: ${bad.length}`);
  console.log([...new Set(bad)].slice(0, 20).join('\n'));
  process.exit(1);
}
console.log('all identical to the old rules');
