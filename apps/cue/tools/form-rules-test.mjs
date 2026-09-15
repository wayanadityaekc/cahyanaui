// Locks the form rules in lib/schemas.js to the behaviour the site shipped before
// they became Zod schemas. The expectations below are the original if-chains from
// ContactForm / AuthModal / ReviewModal / BookConfirmModal, written out longhand;
// every combination of representative values is run through both and compared on
// validity AND on the exact message shown.
//
// Run it after touching lib/schemas.js: `node tools/form-rules-test.mjs`. A change
// here should only ever be deliberate - e.g. swapping the email regex for z.email()
// would start rejecting addresses the booking flow accepts today.
import { contactSchema, signInSchema, createAccountSchema, reviewSchema, bookingSchema } from '../lib/schemas.js';
import { validateWith } from '../lib/validate.js';

const STRINGS = ['', '   ', 'x', 'Wayan Aditya'];
const EMAILS = ['', '  ', 'nope', 'a@b', 'a@b.c', ' a@b.co '];
let checked = 0; const bad = [];

const cmp = (label, oldMsg, res, field) => {
  checked++;
  const newMsg = res.ok ? '' : (res.errors[field] || '');
  const oldOk = !oldMsg;
  // Old code stops at the FIRST failing rule, so only compare the field the old
  // rule was about; per-field mode legitimately reports the others at the same time.
  if (oldOk !== (newMsg === '')) bad.push(`${label}: old=${JSON.stringify(oldMsg)} new=${JSON.stringify(newMsg)}`);
  else if (oldMsg && oldMsg !== newMsg) bad.push(`${label}: message differs old=${JSON.stringify(oldMsg)} new=${JSON.stringify(newMsg)}`);
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;

// --- contact ---
for (const name of STRINGS) for (const em of EMAILS) for (const message of STRINGS) {
  const v = { name, email: em, message };
  const res = validateWith(contactSchema, v);
  cmp(`contact name=${JSON.stringify(name)}`, !name.trim() ? 'Please enter your name.' : '', res, 'name');
  cmp(`contact email=${JSON.stringify(em)}`, !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '', res, 'email');
  cmp(`contact msg=${JSON.stringify(message)}`, !message.trim() ? 'Please enter a message.' : '', res, 'message');
}

// --- sign in / create account ---
for (const em of EMAILS) {
  const res = validateWith(signInSchema, { email: em });
  cmp(`signin email=${JSON.stringify(em)}`, !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '', res, 'email');
}
for (const name of STRINGS) for (const em of EMAILS) for (const phone of STRINGS) {
  const res = validateWith(createAccountSchema, { name, email: em, phone });
  cmp(`create name=${JSON.stringify(name)}`, !name.trim() ? 'Please enter your name.' : '', res, 'name');
  cmp(`create email=${JSON.stringify(em)}`, !EMAIL_RE.test(em.trim()) ? 'Please enter a valid email address.' : '', res, 'email');
  cmp(`create phone=${JSON.stringify(phone)}`, !phone.trim() ? 'Please enter your phone number.' : '', res, 'phone');
}

// --- review ---
for (const picked of [[], ['a'], ['a', 'b']]) for (const rating of [0, 1, 5]) for (const message of STRINGS) {
  const res = validateWith(reviewSchema, { picked, rating, message });
  cmp(`review picked=${picked.length}`, !picked.length ? 'Please pick at least one tour to review.' : '', res, 'picked');
  cmp(`review rating=${rating}`, !rating ? 'Please give a star rating.' : '', res, 'rating');
  cmp(`review msg=${JSON.stringify(message)}`, !message.trim() ? 'Please write your review.' : '', res, 'message');
}

// --- booking, every flag combination ---
const FLAGS = [];
for (const pickupOptional of [false, true]) for (const dropoffRequired of [false, true])
  for (const needsTime of [false, true]) for (const needsFlight of [false, true])
    FLAGS.push({ pickupOptional, dropoffRequired, needsTime, needsFlight });

for (const flags of FLAGS) {
  const schema = bookingSchema(flags);
  for (const name of STRINGS) for (const phone of ['', 'x']) for (const em of EMAILS)
    for (const pickup of STRINGS) for (const dropoff of ['', 'x']) for (const time of ['', '09:00'])
      for (const flightNumber of ['', 'QZ7501']) for (const flightDatetime of ['', '2026-10-01T10:00']) {
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
      }
}

console.log(`compared ${checked} field outcomes`);
if (bad.length) {
  console.log(`MISMATCHES: ${bad.length}`);
  console.log([...new Set(bad)].slice(0, 20).join('\n'));
  process.exit(1);
}
console.log('all identical to the old rules');
