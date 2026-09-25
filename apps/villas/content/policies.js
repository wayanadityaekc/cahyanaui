// THE BOOKING TERMS. Every number here was set by Wayan (Sep 2026) - none of it
// is inferred from how the site reads, and none of it should be edited to make
// a page flow better. This file is the single source: the villa pages, the
// booking sheet, Our Company and the FAQ all read from it, so the site cannot
// promise two different things in two places.
//
// It exists because the site was shipping WITHOUT a stated policy. Our Company
// deliberately had no Terms or Cancellation tab, on the grounds that inventing
// plausible ones would put promises on the site nobody agreed to. These are the
// real ones.

/**
 * FULL PAYMENT UP FRONT. There is no deposit-only option, for a villa stay or
 * for a scooter.
 *
 * The reason is worth keeping next to the rule, because "pay it all now" reads
 * as unfriendly until you know it: a deposit-only booking holds the calendar.
 * Two villas is the entire inventory - a held date that never turns up is not a
 * small loss, it is that villa's whole week.
 */
export const PAYMENT = {
  mode: 'full',
  headline: 'Full payment when you book',
  short: 'Paid in full at booking. No deposit option.',
  why: 'We only have two villas, so a held date that does not turn up costs us the whole booking. Paying in full is what keeps the calendar honest.',
  appliesTo: ['Villa stays', 'Scooter rental'],
};

/**
 * CANCELLATION - this is Airbnb's "Firm" tier, matched deliberately so a guest
 * who found us on Airbnb and books direct is not agreeing to something stricter
 * than they expected.
 *
 * ORDER MATTERS: the bands are listed longest-notice first, which is the order
 * a guest reads them in ("how much notice do I have?"), and `refund` is the
 * percentage RETURNED, not withheld.
 */
export const CANCELLATION = {
  name: 'Firm',
  basis: 'Matches the Airbnb "Firm" policy, so booking direct is not stricter than booking through the listing.',
  bands: [
    { when: '30 days or more before check-in', refund: 100, label: 'Full refund' },
    { when: '7 to 30 days before check-in', refund: 50, label: '50% refund' },
    { when: 'Less than 7 days before check-in', refund: 0, label: 'No refund' },
  ],
  note: 'Notice is counted from your check-in date, in Bali time (WITA, UTC+8).',
};

/** Arrival and departure. Both are local Bali time. */
export const TIMES = {
  checkIn: '2:00 PM',
  checkOut: '11:00 AM',
  note: 'Earlier check-in or a later check-out is sometimes possible - ask, and we will tell you honestly whether the villa is free.',
};

/**
 * The three lines a guest should see before they pay, in the order they matter.
 * Used by the booking sheet and the villa panel so both say the same thing.
 */
export const BOOKING_TERMS = [
  PAYMENT.short,
  `Free cancellation up to 30 days before check-in, 50% up to 7 days.`,
  `Check-in from ${TIMES.checkIn}, check-out by ${TIMES.checkOut}.`,
];

/** Long form, for Our Company. Same facts, room to explain them. */
export const TERMS_BLOCKS = [
  { type: 'heading', html: 'Booking and payment' },
  { type: 'para', html: `Stays are paid <strong>in full when you book</strong>. There is no deposit-only option, for a villa or for a scooter.` },
  { type: 'para', html: PAYMENT.why },
  { type: 'para', html: 'You get a confirmation with the dates, the villa and the total. If anything on it is wrong, tell us before you travel and we will fix it.' },

  { type: 'heading', html: 'Check-in and check-out' },
  { type: 'para', html: `Check-in is from <strong>${TIMES.checkIn}</strong>. Check-out is by <strong>${TIMES.checkOut}</strong>.` },
  { type: 'para', html: TIMES.note },

  { type: 'heading', html: 'Who can stay' },
  { type: 'para', html: 'Each villa is booked as an entire house, for the number of guests on the booking. Cahyana House sleeps up to six, Cahyana Tibuah up to four. If your group changes, tell us - we would rather move you to the right villa than have you arrive and not fit.' },
];

export const CANCELLATION_BLOCKS = [
  { type: 'heading', html: 'Cancellation and refunds' },
  { type: 'para', html: CANCELLATION.basis },
  {
    type: 'list',
    items: CANCELLATION.bands.map((b) => `<strong>${b.when}:</strong> ${b.label.toLowerCase()}`),
  },
  { type: 'para', html: CANCELLATION.note },
  { type: 'para', html: 'To cancel, message us on WhatsApp or email - whichever you booked through. We will confirm in writing what is being refunded and when, and the refund goes back the way you paid.' },

  { type: 'heading', html: 'If we have to cancel' },
  { type: 'para', html: 'If something on our side makes the villa unusable, you get everything back, whenever it happens. We will also help you find somewhere else in Ubud if you want us to.' },

  { type: 'heading', html: 'Changing your dates' },
  { type: 'para', html: 'Moving dates is not a cancellation, and we will always try. If the villa is free on your new dates and you tell us more than 7 days out, we move the booking at no charge. Inside 7 days it depends on whether we can still fill the original nights - ask and we will tell you straight.' },
];
