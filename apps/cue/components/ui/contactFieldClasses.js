import { FIELD_INPUT, FIELD_AREA } from '@/components/ui/formClasses';
// Shared contact/auth form-field wrapper utilities (B-FINAL). Mirrors the old
// `.contact__group*` rules + the contact half of the shared form-field base
// (`.contact__group input/textarea` border/radius/font/color) and label rule.
// Used by ContactForm, AccountSettings, AuthModal. The element-level mobile rule
// `input,select,textarea{font-size:var(--fs-field)!important}` stays in style.css
// and keeps applying to these fields (same value), so it is not reproduced here.
export const CONTACT_GROUP = 'flex flex-col mb-4';
// Both come from the one field box in formClasses now - CONTACT_INPUT used to run
// its own padding (10.4px) and its own textarea min-height.
export const CONTACT_INPUT = FIELD_INPUT;
export const CONTACT_TEXTAREA = FIELD_AREA;
