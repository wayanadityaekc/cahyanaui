import { contactSchema, signInSchema, createAccountSchema, reviewSchema, buildBookingSchema } from '../lib/schemas.js';
import { validateWith } from '../lib/validate.js';

const STRINGS = ['', '   ', 'x', 'Wayan Aditya'];
const EMAILS = ['', '  ', 'nope', 'a@b', 'a@b.c', ' a@b.co '];
let checked = 0;
const badRows = [];

function compareMessages(label, oldMsg, { ok, errors }, field) {
  checked++;
  const newMsg = ok ? '' : errors[field] || '';
  const isOldValid = !oldMsg;
  if (isOldValid !== (newMsg === ''))
    badRows.push(`${label}: old=${JSON.stringify(oldMsg)} new=${JSON.stringify(newMsg)}`);
  else if (oldMsg && oldMsg !== newMsg)
    badRows.push(`${label}: message differs old=${JSON.stringify(oldMsg)} new=${JSON.stringify(newMsg)}`);
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function buildCombinations(lists) {
  return Object.entries(lists).reduce(
    (combinations, [key, values]) =>
      combinations.flatMap((combination) => values.map((val) => ({ ...combination, [key]: val }))),
    [{}],
  );
}

buildCombinations({ name: STRINGS, em: EMAILS, message: STRINGS }).forEach(({ name, em, message }) => {
  const formValues = { name, email: em, message };
  const result = validateWith(contactSchema, formValues);
  compareMessages(
    `contact name=${JSON.stringify(name)}`,
    !name.trim() ? 'Please enter your name.' : '',
    result,
    'name',
  );
  compareMessages(
    `contact email=${JSON.stringify(em)}`,
    !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '',
    result,
    'email',
  );
  compareMessages(
    `contact msg=${JSON.stringify(message)}`,
    !message.trim() ? 'Please enter a message.' : '',
    result,
    'message',
  );
});

EMAILS.forEach((em) => {
  const result = validateWith(signInSchema, { email: em });
  compareMessages(
    `signin email=${JSON.stringify(em)}`,
    !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '',
    result,
    'email',
  );
});
buildCombinations({ name: STRINGS, em: EMAILS, phone: STRINGS }).forEach(({ name, em, phone }) => {
  const result = validateWith(createAccountSchema, { name, email: em, phone });
  compareMessages(`create name=${JSON.stringify(name)}`, !name.trim() ? 'Please enter your name.' : '', result, 'name');
  compareMessages(
    `create email=${JSON.stringify(em)}`,
    !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '',
    result,
    'email',
  );
  compareMessages(
    `create phone=${JSON.stringify(phone)}`,
    !phone.trim() ? 'Please enter your phone number.' : '',
    result,
    'phone',
  );
});

buildCombinations({ picked: [[], ['a'], ['a', 'b']], rating: [0, 1, 5], message: STRINGS }).forEach(
  ({ picked, rating, message }) => {
    const result = validateWith(reviewSchema, { picked, rating, message });
    compareMessages(
      `review picked=${picked.length}`,
      !picked.length ? 'Please pick at least one tour to review.' : '',
      result,
      'picked',
    );
    compareMessages(`review rating=${rating}`, !rating ? 'Please give a star rating.' : '', result, 'rating');
    compareMessages(
      `review msg=${JSON.stringify(message)}`,
      !message.trim() ? 'Please write your review.' : '',
      result,
      'message',
    );
  },
);

const FLAGS = buildCombinations({
  pickupOptional: [false, true],
  dropoffRequired: [false, true],
  needsTime: [false, true],
  needsFlight: [false, true],
});

FLAGS.forEach((flags) => {
  const schema = buildBookingSchema(flags);
  buildCombinations({
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
    compareMessages(`book${flagsJson} name`, !name.trim() ? 'Please enter your name.' : '', result, 'name');
    compareMessages(`book${flagsJson} phone`, !phone.trim() ? 'Please enter your phone number.' : '', result, 'phone');
    compareMessages(
      `book${flagsJson} email`,
      !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '',
      result,
      'email',
    );
    compareMessages(
      `book${flagsJson} pickup`,
      !flags.pickupOptional && !pickup.trim() ? 'Please enter your pick-up location.' : '',
      result,
      'pickup',
    );
    compareMessages(
      `book${flagsJson} dropoff`,
      flags.dropoffRequired && !dropoff.trim() ? 'Please enter your drop-off location.' : '',
      result,
      'dropoff',
    );
    compareMessages(
      `book${flagsJson} time`,
      flags.needsTime && !time ? 'Please select a pickup time.' : '',
      result,
      'time',
    );
    compareMessages(
      `book${flagsJson} flightNumber`,
      flags.needsFlight && !flightNumber.trim() ? 'Please enter your flight number.' : '',
      result,
      'flightNumber',
    );
    compareMessages(
      `book${flagsJson} flightDatetime`,
      flags.needsFlight && !flightDatetime ? 'Please enter your flight date & time.' : '',
      result,
      'flightDatetime',
    );
  });
});

console.log(`compared ${checked} field outcomes`);
if (badRows.length) {
  console.log(`MISMATCHES: ${badRows.length}`);
  console.log([...new Set(badRows)].slice(0, 20).join('\n'));
  process.exit(1);
}
console.log('all identical to the old rules');
