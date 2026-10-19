import { contactSchema, signInSchema, createAccountSchema, reviewSchema, bookingSchema } from '../lib/schemas.js';
import { validateWith } from '../lib/validate.js';

const STRINGS = ['', '   ', 'x', 'Wayan Aditya'];
const EMAILS = ['', '  ', 'nope', 'a@b', 'a@b.c', ' a@b.co '];
let checked = 0; const bad = [];

function cmp(label, oldMsg, { ok, errors }, field) {
  checked++;
  const newMsg = ok ? '' : (errors[field] || '');
  const oldOk = !oldMsg;
  if (oldOk !== (newMsg === '')) bad.push(`${label}: old=${JSON.stringify(oldMsg)} new=${JSON.stringify(newMsg)}`);
  else if (oldMsg && oldMsg !== newMsg) bad.push(`${label}: message differs old=${JSON.stringify(oldMsg)} new=${JSON.stringify(newMsg)}`);
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function combos(lists) {
  return Object.entries(lists).reduce((acc, [k, vals]) => acc.flatMap((o) => vals.map((v) => ({ ...o, [k]: v }))), [{}]);
}

combos({ name: STRINGS, em: EMAILS, message: STRINGS }).forEach(({ name, em, message }) => {
  const v = { name, email: em, message };
  const res = validateWith(contactSchema, v);
  cmp(`contact name=${JSON.stringify(name)}`, !name.trim() ? 'Please enter your name.' : '', res, 'name');
  cmp(`contact email=${JSON.stringify(em)}`, !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '', res, 'email');
  cmp(`contact msg=${JSON.stringify(message)}`, !message.trim() ? 'Please enter a message.' : '', res, 'message');
});

EMAILS.forEach((em) => {
  const res = validateWith(signInSchema, { email: em });
  cmp(`signin email=${JSON.stringify(em)}`, !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '', res, 'email');
});
combos({ name: STRINGS, em: EMAILS, phone: STRINGS }).forEach(({ name, em, phone }) => {
  const res = validateWith(createAccountSchema, { name, email: em, phone });
  cmp(`create name=${JSON.stringify(name)}`, !name.trim() ? 'Please enter your name.' : '', res, 'name');
  cmp(`create email=${JSON.stringify(em)}`, !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '', res, 'email');
  cmp(`create phone=${JSON.stringify(phone)}`, !phone.trim() ? 'Please enter your phone number.' : '', res, 'phone');
});

combos({ picked: [[], ['a'], ['a', 'b']], rating: [0, 1, 5], message: STRINGS }).forEach(({ picked, rating, message }) => {
  const res = validateWith(reviewSchema, { picked, rating, message });
  cmp(`review picked=${picked.length}`, !picked.length ? 'Please pick at least one tour to review.' : '', res, 'picked');
  cmp(`review rating=${rating}`, !rating ? 'Please give a star rating.' : '', res, 'rating');
  cmp(`review msg=${JSON.stringify(message)}`, !message.trim() ? 'Please write your review.' : '', res, 'message');
});

const FLAGS = combos({ pickupOptional: [false, true], dropoffRequired: [false, true], needsTime: [false, true], needsFlight: [false, true] });

FLAGS.forEach((flags) => {
  const schema = bookingSchema(flags);
  combos({
    name: STRINGS, phone: ['', 'x'], em: EMAILS, pickup: STRINGS,
    dropoff: ['', 'x'], time: ['', '09:00'], flightNumber: ['', 'QZ7501'], flightDatetime: ['', '2026-10-01T10:00'],
  }).forEach(({ name, phone, em, pickup, dropoff, time, flightNumber, flightDatetime }) => {
    const v = { name, phone, email: em, pickup, dropoff, time, flightNumber, flightDatetime, referral: '' };
    const res = validateWith(schema, v);
    const f = JSON.stringify(flags);
    cmp(`book${f} name`, !name.trim() ? 'Please enter your name.' : '', res, 'name');
    cmp(`book${f} phone`, !phone.trim() ? 'Please enter your phone number.' : '', res, 'phone');
    cmp(`book${f} email`, !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '', res, 'email');
    cmp(`book${f} pickup`, !flags.pickupOptional && !pickup.trim() ? 'Please enter your pick-up location.' : '', res, 'pickup');
    cmp(`book${f} dropoff`, flags.dropoffRequired && !dropoff.trim() ? 'Please enter your drop-off location.' : '', res, 'dropoff');
    cmp(`book${f} time`, flags.needsTime && !time ? 'Please select a pickup time.' : '', res, 'time');
    cmp(`book${f} flightNumber`, flags.needsFlight && !flightNumber.trim() ? 'Please enter your flight number.' : '', res, 'flightNumber');
    cmp(`book${f} flightDatetime`, flags.needsFlight && !flightDatetime ? 'Please enter your flight date & time.' : '', res, 'flightDatetime');
  });
});

console.log(`compared ${checked} field outcomes`);
if (bad.length) {
  console.log(`MISMATCHES: ${bad.length}`);
  console.log([...new Set(bad)].slice(0, 20).join('\n'));
  process.exit(1);
}
console.log('all identical to the old rules');
