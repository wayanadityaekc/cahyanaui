export const BAR_MARK = 'stickybar';

export const BAR_UPTO_MD = 'hidden max-md:flex';
export const BAR_UPTO_LG = 'hidden max-[993px]:flex';

export const BAR_SHELL =
  `${BAR_MARK} fixed inset-x-0 bottom-0 z-[95] items-center gap-3 ` +
  'pt-[0.55rem] pl-[1.1rem] pr-[0.9rem] pb-[max(0.55rem,env(safe-area-inset-bottom))] ' +
  'bg-white [border-top:1px_solid_var(--line)] rounded-t-[var(--r-xl)] ' +
  '';
