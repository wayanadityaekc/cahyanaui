const BOX = 'w-full mx-auto px-[var(--container-x)]';

export const WRAP = `${BOX} max-w-[var(--container-wide)]`;
export const WRAP_MID = `${BOX} max-w-[var(--container-mid)]`;
export const WRAP_READ = `${BOX} max-w-[var(--container-read)]`;

export const CONTAINER_WIDTHS = { wide: WRAP, mid: WRAP_MID, read: WRAP_READ };

export const SECTION = 'py-7 md:py-14';

export const SECTION_TONES = {
  plain: '',
  cream: 'bg-surface-raised',
  white: 'bg-surface-raised',
  dark: 'bg-gold',
};

export const ICON_CIRCLE =
  'inline-flex items-center justify-center w-11 h-11 rounded-pill bg-cream text-gold flex-none';

export const STARS = 'text-amber tracking-[0.1em]';

export const PROSE_COPY = 'prose-copy';
