export const FIELD_INVALID =
  'aria-[invalid=true]:[border-color:var(--color-err)] ' +
  'aria-[invalid=true]:[box-shadow:0_0_0_3px_rgba(154,74,63,0.14)]';

const FIELD_BOX =
  'h-[var(--field-h)] py-0 px-3 [border:1px_solid_var(--line)] rounded-md ' +
  `font-body text-field text-green bg-white ${FIELD_INVALID}`;

export const FIELD_INPUT = `w-full ${FIELD_BOX}`;

export const FIELD_AREA =
  'w-full min-h-[130px] py-2 px-3 [border:1px_solid_var(--line)] rounded-md ' +
  `font-body text-field text-green bg-white resize-y ${FIELD_INVALID}`;

export const FIELD_LABEL = 'block mb-2 font-body text-small font-medium text-green tracking-normal normal-case';
