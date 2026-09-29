// App-mode classes, written out in full (Tailwind can't see interpolated classes); phone width only (<993px).

// Shown ONLY in app mode on a phone.
export const APP_ONLY = 'hidden standalone:max-[993px]:flex';

// Hides navbar icons in phone app mode; uses !hidden because it sits next to their inline-flex.
export const APP_HIDE = 'standalone:max-[993px]:!hidden';
