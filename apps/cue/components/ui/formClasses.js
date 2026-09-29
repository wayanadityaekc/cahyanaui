// Shared form field strings; every field and label must be built from these, never re-typed numbers.

// Error state; use aria-[invalid=true]: (aria-invalid: is not generated) matched to =true only.
export const FIELD_INVALID =
  'aria-[invalid=true]:[border-color:var(--color-err)] ' +
  'aria-[invalid=true]:[box-shadow:0_0_0_3px_rgba(154,74,63,0.14)]';

// The one field box; py-0 is safe because height is fixed by --field-h.
const FIELD_BOX =
  'h-[var(--field-h)] py-0 px-3 [border:1px_solid_var(--line)] rounded-md ' +
  `font-body text-field text-green bg-white ${FIELD_INVALID}`;

// Text/number/native field polos (dulu `.charter__select` + base grup .field input).
export const FIELD_INPUT = `w-full ${FIELD_BOX}`;

// Textarea grows instead of using --field-h, so it needs its own vertical padding.
export const FIELD_AREA =
  'w-full min-h-[130px] py-2 px-3 [border:1px_solid_var(--line)] rounded-md ' +
  `font-body text-field text-green bg-white resize-y ${FIELD_INVALID}`;

// The one field label for the whole site.
export const FIELD_LABEL =
  'block mb-2 font-body text-small font-medium text-green tracking-normal normal-case';
