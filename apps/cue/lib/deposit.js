// Booking deposit - a FLAT fee by pickup zone, deliberately not a percentage.
//
// The deposit exists to cover what a no-show actually costs us: the driver's
// time and fuel getting to the pickup point. That scales with distance, not with
// the price of the booking, so a guest booking a cheap half-day from Sanur costs
// us more to lose than an expensive full-day from Ubud.
//
// This is a SEPARATE model from the villa site's percentage/referral deposit.
// Keep it that way: do not fold the two into one shared hook (Wayan, Sep 2026).
// Nothing here touches booking price calculation - the deposit sits alongside the
// price, it is not derived from it.

export const DEPOSIT_UBUD_USD = 5;
export const DEPOSIT_OUTSIDE_USD = 15;

// Hours before the booking that cancellation is still free.
export const FREE_CANCEL_HOURS = 24;

// Which zone is the guest picked up from?
//
// `stay` is the TripPrefs pickup area: 'ubud' (or empty) means "Ubud & nearby",
// anything else is a transfer-route key like "Sanur – Ubud" and therefore
// outside. `transferRoute` covers the other case: when the booking IS a transfer,
// the guest is collected at the route's origin, and every route on the site runs
// "<somewhere> – Ubud", so the origin is by definition outside Ubud.
export function depositZone({ stay, transferRoute } = {}) {
  if (transferRoute) return 'outside';
  return !stay || stay === 'ubud' ? 'ubud' : 'outside';
}

export function depositUsd(args) {
  return depositZone(args) === 'ubud' ? DEPOSIT_UBUD_USD : DEPOSIT_OUTSIDE_USD;
}

// Placeholder shown until the server sends the amount in the guest's own
// currency, the same way <Price> shows a hardcoded figure until the catalog
// loads. USD because that is the currency the two tiers are defined in.
export function depositFallbackDisplay(args) {
  return `$${depositUsd(args)}`;
}

// One place for the wording, so the modal, the confirmation and the policy page
// cannot drift apart.
export const DEPOSIT_COPY = {
  label: 'Deposit today',
  restLabel: 'Rest on the day',
  restValue: 'Cash or card to your driver',
  cancel: `Free cancellation up to ${FREE_CANCEL_HOURS} hours before pickup - the deposit is refunded in full.`,
  late: 'Cancel later than that, or no-show, and the deposit is not refunded.',
  secure: 'Card details are entered on a secure DOKU window. We never see or store them.',
};
