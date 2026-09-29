import { BTN_SM } from '@/components/ui/btnClasses';
// Primary green Book CTA; keep font-body or it renders in the browser font; same role as BTN_CTA, merging is Wayan's call.
export const BTN_BOOK =
  `flex w-full mt-4 ${BTN_SM} font-body [border-width:0] [border-style:none] [border-color:var(--color-cta)] ` +
  'text-white bg-cta cursor-pointer no-underline ' +
  'disabled:opacity-45 disabled:cursor-not-allowed';
