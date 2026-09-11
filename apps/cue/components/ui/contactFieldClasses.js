// Shared contact/auth form-field wrapper utilities (B-FINAL). Mirrors the old
// `.contact__group*` rules + the contact half of the shared form-field base
// (`.contact__group input/textarea` border/radius/font/color) and label rule.
// Used by ContactForm, AccountSettings, AuthModal. The element-level mobile rule
// `input,select,textarea{font-size:var(--fs-field)!important}` stays in style.css
// and keeps applying to these fields (same value), so it is not reproduced here.
export const CONTACT_GROUP = 'flex flex-col mb-4';
export const CONTACT_LABEL =
  'mb-[0.4rem] font-body text-[length:var(--fs-small)] font-medium normal-case tracking-normal';
const FIELD_BASE =
  'py-2 px-[0.65rem] [border:1px_solid_var(--line)] rounded-md font-body text-[length:var(--fs-field)] text-green';
export const CONTACT_INPUT = `h-[var(--field-h)] ${FIELD_BASE}`;
export const CONTACT_TEXTAREA = `min-h-[130px] resize-y ${FIELD_BASE}`;
