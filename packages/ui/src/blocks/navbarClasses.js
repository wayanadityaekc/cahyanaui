export const NAV_HEADER =
  'fixed top-0 left-0 right-0 z-[100] w-full leading-[normal] text-green bg-surface-raised ' +
  'animate-[navbarIn_0.4s_ease-out] motion-reduce:animate-none';

export const NAV_ROW =
  'flex justify-between items-center max-w-[var(--container-wide)] mx-auto py-[0.55rem] px-[var(--container-x)] min-[993px]:px-5';

export const NAV_ICON =
  'inline-flex items-center text-gold mr-[1.3rem] ' +
  'transition-[color,scale] duration-200 ease-[ease] hover:text-gold-d max-[992px]:mr-[0.85rem]';

export const NAV_BADGE_BASE =
  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-[5px] rounded-pill ' +
  'text-white text-label font-semibold leading-none [&[hidden]]:hidden';

export const NAV_BADGE = `absolute top-[-7px] right-[-9px] bg-gold ${NAV_BADGE_BASE}`;

export const NAV_BURGER =
  'min-[993px]:hidden relative flex flex-col gap-[4px] w-6 bg-transparent border-none cursor-pointer ' +
  'max-[992px]:h-[2.2rem] max-[992px]:mr-2 max-[992px]:items-center max-[992px]:justify-center';

export const NAV_BURGER_BAR =
  'w-full h-[2px] bg-gold max-[992px]:w-[20px] ' +
  '[transition:translate_var(--dur)_var(--ease),rotate_var(--dur)_var(--ease),opacity_var(--dur-fast)_var(--ease)] ' +
  'motion-reduce:transition-none';

export const NAV_DRAWER =
  'fixed top-0 left-0 bottom-0 right-auto w-4/5 max-w-[340px] max-[992px]:max-w-[360px] h-[100dvh] ' +
  'bg-surface-raised px-[22px] pb-[30px] overflow-y-auto ' +
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain ' +
  'transition-[translate] duration-300 ease-[var(--ease)] motion-reduce:transition-none ' +
  'z-[120] flex flex-col items-stretch text-left gap-0 list-none';

export const NAV_DRAWER_HEAD =
  'flex items-center gap-[10px] bg-surface-raised [border-bottom:1px_solid_var(--line)] ' +
  'mx-[-22px] pt-[0.8rem] px-[22px] pb-[0.8rem] min-h-[65px]';

export const NAV_SCRIM =
  'fixed inset-0 bg-[rgba(26,26,26,0.45)] z-[95] transition-[opacity,visibility] duration-300 ease-[var(--ease)]';

export const MENU_ROW_BOX =
  'flex items-center gap-[0.65rem] w-full text-left p-[0.7rem_0.75rem] rounded-[var(--r-md)] ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0';

export const NAV_LI = '-mx-3';

export const NAV_SUBLIST = 'list-none mt-[0.1rem] mb-[0.2rem] pt-[0.2rem] pb-[0.5rem] pl-[1.65rem] block';

export function navLink(active) {
  return `${MENU_ROW_BOX} text-strong no-underline ${
    active
      ? 'font-semibold bg-cream text-green max-[992px]:text-gold-d'
      : 'font-medium text-gold hover:bg-cream hover:text-green max-[992px]:hover:text-gold-d'
  }`;
}

export const NAV_SUBTRIGGER = `${MENU_ROW_BOX} text-strong font-body font-medium border-none bg-transparent text-gold cursor-pointer hover:bg-cream hover:text-green`;

export const NAV_CLOSE =
  'ml-auto flex-none grid place-items-center w-[34px] h-[34px] rounded-[var(--r-md)] ' +
  '[border:1px_solid_var(--line)] bg-surface-raised text-gold cursor-pointer [&>svg]:w-4 [&>svg]:h-4 ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';

export const NAV_SUBLINK =
  'block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d';

export const NAV_ROW_END = 'ml-auto';

export const NAV_DESK = 'max-[992px]:hidden flex items-center gap-1 list-none m-0 p-0 mr-auto ml-2';

export function navDeskLink(active) {
  return (
    'inline-flex items-center gap-1 h-[2.1rem] px-3 rounded-[var(--r-md)] text-small no-underline font-body bg-transparent border-none cursor-pointer ' +
    `[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream font-medium ${active ? 'text-green bg-cream' : 'text-gold'}`
  );
}

export const NAV_CHEVRON = 'w-[var(--icon-sm)] h-[var(--icon-sm)] transition-[rotate] duration-200';

export function navPop(open) {
  return (
    '[transition:opacity_var(--dur)_var(--ease-out),translate_var(--dur)_var(--ease-out),visibility_var(--dur)] motion-reduce:transition-none ' +
    `${open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-1.5'}`
  );
}

export const NAV_POP_WRAP = 'absolute left-0 top-full pt-[var(--space-1)] z-[130]';
export const NAV_POP_LIST =
  'list-none m-0 w-[12rem] bg-surface-raised [border:1px_solid_var(--line)] rounded-[var(--r-md)] p-[var(--space-1)]';

export function navPopLink(active) {
  return `flex w-full px-3 py-[0.55rem] rounded-[var(--r-md)] text-small no-underline hover:bg-cream font-medium ${active ? 'text-green bg-cream' : 'text-gold'}`;
}

export const ACCOUNT_PANEL =
  'absolute right-0 top-[calc(100%+var(--space-1))] z-[130] bg-surface-raised [border:1px_solid_var(--line)] rounded-[var(--r-md)] p-[var(--space-1)]';

export const ACCOUNT_ROW = `${MENU_ROW_BOX} text-small font-medium text-gold no-underline bg-transparent border-none cursor-pointer font-body hover:bg-cream`;

export const ACCOUNT_LOGIN =
  'max-[992px]:hidden inline-flex items-center h-[2.1rem] px-3 rounded-sm [border:1px_solid_var(--line)] bg-surface-raised ' +
  'text-small font-semibold font-body text-gold cursor-pointer whitespace-nowrap ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';

export const ACCOUNT_ICON_BTN =
  'min-[993px]:hidden inline-flex items-center bg-transparent border-none p-0 cursor-pointer text-gold ' +
  '[transition:color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:text-gold-d';

export const ACCOUNT_AVATAR_BTN =
  'inline-flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer font-body text-small font-semibold text-gold ' +
  '[transition:color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:text-gold-d';

export const ACCOUNT_AVATAR =
  'w-[30px] h-[30px] max-[992px]:w-[28px] max-[992px]:h-[28px] rounded-[50%] bg-gold text-white grid place-items-center text-label font-semibold tracking-[0.02em]';
