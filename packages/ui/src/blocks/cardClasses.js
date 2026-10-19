const HOVER_LIFT =
  '[transition:transform_var(--dur-slow)_var(--ease-out)]';

export const CARD_FRAMED =
  'relative overflow-hidden rounded-base [border:1px_solid_var(--line)] ' +
  '[box-shadow:var(--shadow-md)] no-underline text-inherit';

export const CARD_TONES = {
  white: 'bg-surface-raised',
  cream: 'bg-cream',
  none: '',
};

export const CARD_INSET =
  'relative p-[5px] overflow-hidden bg-surface-raised ' +
  '[box-shadow:var(--shadow-md)] no-underline text-inherit';

export const CARD_SHAPES = { framed: CARD_FRAMED, inset: CARD_INSET };

export const CARD_HOVER_SM = `${HOVER_LIFT} hover:[transform:translateY(-2px)]`;
export const CARD_HOVER_LG = `${HOVER_LIFT} hover:[transform:translateY(-4px)]`;

export const CARD_MEDIA = 'relative overflow-hidden rounded-base bg-green';
export const CARD_MEDIA_INSET = CARD_MEDIA;
export const MEDIA_FALLBACK = '[background:linear-gradient(150deg,var(--color-gold),#2f2b24)]';
export const CARD_IMG = 'absolute inset-0 w-full h-full object-cover object-center';

export const CARD_SCRIM =
  "after:content-[''] after:absolute after:inset-0 " +
  'after:bg-[linear-gradient(to_bottom,transparent_55%,rgba(31,61,43,0.45))]';

export const CARD_BADGE_POPULAR =
  'absolute top-[0.8rem] right-[0.8rem] bg-amber text-gold text-label font-semibold ' +
  'tracking-[0.04em] uppercase rounded-pill py-[0.2rem] px-[0.7rem]';
