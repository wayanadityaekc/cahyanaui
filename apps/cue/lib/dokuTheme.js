// Branding for the DOKU Checkout popup, so the payment window reads as part of
// this site rather than a generic gateway.
//
// Values mirror the brand tokens in style.css rather than being new hex codes:
// --color-cta (primary action green), --color-gold (soft black, used for text
// and accents), --color-cream. They are written out literally here because this
// object is sent to DOKU as JSON - the popup is rendered by DOKU, outside our
// document, so it cannot read our CSS variables. If a brand token changes, change
// it here too; there is no way to make that automatic across the iframe boundary.
//
// CHECKPOINT 1 - this is configuration only. Nothing sends it yet; the request
// that carries it is Checkpoint 2.
export const DOKU_THEME = {
  // Matches --color-cta / --color-cta-d.
  primaryColor: '#3d5c46',
  primaryColorHover: '#2f4737',
  // Matches --color-gold (soft black) and --color-cream.
  textColor: '#22201c',
  backgroundColor: '#f8f8f8',
  // Pill buttons everywhere else on the site (--r-pill).
  buttonRadius: 999,
  fontFamily: 'Inter, system-ui, sans-serif',
};

// Cards only for this integration (Wayan, Sep 2026): no wallets, no virtual
// account, no convenience store. Kept here next to the theme so the chips shown
// in the booking modal and the methods actually enabled on the session come from
// one list.
export const DOKU_CARD_BRANDS = ['Visa', 'Mastercard', 'JCB', 'American Express'];

// The company the payment is taken by - same legal entity and same DOKU account
// as the villa site.
export const MERCHANT_NAME = 'PT Cahyana Ubud Experience';
