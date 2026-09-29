// DOKU Checkout branding; literal copies of brand tokens (DOKU can't read our CSS). Not sent anywhere yet.
export const DOKU_THEME = {
  // Matches --color-cta / --color-cta-d.
  primaryColor: '#3d5c46',
  primaryColorHover: '#2f4737',
  // Matches --color-gold (soft black) and --color-cream.
  textColor: '#22201c',
  backgroundColor: '#f8f8f8',
  // Matches the site button radius (--r-sm, BTN_SM); change it when our buttons change.
  buttonRadius: 8,
  fontFamily: 'Inter, system-ui, sans-serif',
};

// Card brands for the DOKU integration; nothing imports this list yet.
export const DOKU_CARD_BRANDS = ['Visa', 'Mastercard', 'JCB', 'American Express'];

// Legal entity taking the payment, same DOKU account as the villa site.
export const MERCHANT_NAME = 'PT Cahyana Ubud Experience';
