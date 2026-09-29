// Shared button class strings; import them instead of retyping button geometry.

// BTN_SM: geometry only; caller brings display (flex/inline-flex) and must delete old h/py/px/text/rounded classes.
export const BTN_SM =
  'items-center justify-center text-center leading-none whitespace-nowrap ' +
  'h-[var(--btn-h)] py-0 px-4 rounded-sm text-small font-semibold';

// BTN_CTA: primary green action; font-body is required (buttons don't inherit the page font), display is the caller's.
export const BTN_CTA =
  `${BTN_SM} font-body border-none text-white bg-cta cursor-pointer hover:bg-cta-d`;

// BTN_PILL: secondary gold-outline button that fills gold on hover.
export const BTN_PILL =
  `inline-flex ${BTN_SM} [border:1px_solid_var(--color-gold)] ` +
  'bg-white text-gold-d font-body no-underline ' +
  '[transition:background-color_var(--dur)_ease,color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-gold hover:text-white';
