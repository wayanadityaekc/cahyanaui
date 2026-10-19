import { BTN_SM } from '@/components/ui/btnClasses';

const CONTROL_COMMON =
  'w-full bg-white font-body font-normal text-field text-green text-left cursor-pointer rounded-md ' +
  '[border:1px_solid_var(--line)] ' +
  '[transition:border-color_var(--dur-fast)_ease,box-shadow_var(--dur-fast)_ease,scale_var(--dur-fast)_var(--ease)] ' +
  'hover:[border-color:var(--color-gold)] focus-visible:outline-none ' +
  'focus-visible:[border-color:var(--color-gold)] focus-visible:[box-shadow:var(--focus-ring)]';

export const CONTROL = `${CONTROL_COMMON} flex items-center justify-between gap-[10px] px-3 py-0 h-[var(--field-h)]`;

export const CONTROL_RICH = `${CONTROL_COMMON} flex items-center justify-between gap-[0.65rem] px-3 py-2 h-auto min-h-[3.1rem]`;

export const CONTROL_VAL = 'overflow-hidden text-ellipsis whitespace-nowrap';
export const CONTROL_VAL_PLACEHOLDER = `${CONTROL_VAL} text-muted`;
export const CONTROL_VAL_FLAG = 'flex items-center gap-[0.5rem]';
export const CONTROL_FLAG_NM = 'overflow-hidden text-ellipsis whitespace-nowrap';

export const CONTROL_IC = 'flex-[0_0_auto] inline-flex w-5 h-5 text-green [&_svg]:w-full [&_svg]:h-full';
export const CONTROL_STACK = 'flex-[1_1_auto] flex flex-col leading-[1.3] min-w-0';
export const CONTROL_HINT = 'text-label font-medium tracking-[0.04em] text-muted';
export const CONTROL_VAL_RICH = 'overflow-hidden text-ellipsis whitespace-nowrap text-field font-medium text-ink';
export const CONTROL_VAL_RICH_PLACEHOLDER =
  'overflow-hidden text-ellipsis whitespace-nowrap text-field font-normal text-muted';

export const CHEV = 'w-[18px] h-[18px] shrink-0 text-muted [transition:transform_var(--dur)_ease]';

const PANEL_MOBILE_TRANSITION =
  '[@media(max-width:768px)]:[transition:transform_var(--dur-slow)_var(--ease),visibility_var(--dur-slow)]';
const PANEL_POPUP_STATIC =
  `fixed top-1/2 left-1/2 [right:auto] [bottom:auto] w-[min(440px,85vw)] max-h-[85vh] ` +
  `bg-white [border:1px_solid_var(--line)] rounded-xl z-[340] ` +
  `flex flex-col overflow-hidden [overscroll-behavior:contain] ` +
  `[transition:opacity_0.24s_var(--ease),transform_0.24s_var(--ease),visibility_0.24s] ${PANEL_MOBILE_TRANSITION}`;
export function buildPanelPopupClass(open) {
  return `${PANEL_POPUP_STATIC} ${open ? 'opacity-100 visible pointer-events-auto [transform:translate(-50%,-50%)_scale(1)]' : 'opacity-0 invisible pointer-events-none [transform:translate(-50%,-50%)_scale(0.96)]'}`;
}
export const PANEL_HEAD =
  'flex items-center justify-between pt-4 px-5 pb-3 [border-bottom:1px_solid_var(--line)] flex-none';
export const PANEL_HEAD_H3 = 'font-body font-semibold text-[1rem] text-green';
export const PANEL_CLOSE =
  'block w-[34px] h-[34px] rounded-[50%] [border:1px_solid_var(--line)] bg-white text-green text-[1.2rem] leading-none cursor-pointer';
export const PANEL_BODY =
  'max-h-none overflow-y-auto flex-[1_1_auto] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

export function buildOptionClass(selector, disabled) {
  return `w-full flex items-center gap-[0.8rem] py-3 px-4 border-none text-left [&+&]:[border-top:1px_solid_var(--line)] ${
    disabled
      ? 'cursor-not-allowed opacity-40 bg-transparent'
      : `cursor-pointer ${selector ? 'bg-[rgba(34,32,28,0.14)]' : 'bg-transparent hover:bg-[#faf8f3]'}`
  }`;
}

export function overlay(open, elevated) {
  return (
    `fixed inset-0 bg-[rgba(26,26,26,0.42)] ${elevated ? 'z-[300]' : 'z-[55]'} ` +
    `transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-out)] motion-reduce:transition-none ` +
    `${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`
  );
}

export const CHEV_CAL = 'w-[17px] h-[17px] shrink-0 text-muted [transition:transform_var(--dur)_ease]';

const PANEL_BOOKDATE_STATIC =
  `fixed top-1/2 left-1/2 [right:auto] [bottom:auto] w-[min(440px,85vw)] max-h-[85vh] ` +
  `bg-white [border:1px_solid_var(--line)] rounded-xl z-[340] ` +
  `flex flex-col overflow-hidden [overscroll-behavior:contain] ` +
  `[transition:opacity_0.24s_var(--ease),transform_0.24s_var(--ease),visibility_0.24s] ${PANEL_MOBILE_TRANSITION} ` +
  `min-[769px]:w-[min(430px,92vw)] min-[769px]:max-h-[86vh] min-[769px]:overflow-y-auto min-[769px]:[scrollbar-width:none] min-[769px]:[&::-webkit-scrollbar]:hidden`;
export function buildPanelBookdateClass(open) {
  return `${PANEL_BOOKDATE_STATIC} ${open ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'} ${open ? '[transform:translate(-50%,-50%)_scale(1)] min-[769px]:[transform:translate(-50%,-50%)]' : '[transform:translate(-50%,-50%)_scale(0.96)] min-[769px]:[transform:translate(-50%,-48%)]'}`;
}
export const PANEL_HEAD_BOOKDATE =
  'flex items-center justify-between pt-4 px-5 pb-3 [border-bottom:1px_solid_var(--line)] flex-none ' +
  'sticky top-0 bg-white min-[769px]:z-[1]';

export const HS_CAL =
  'pt-4 px-4 pb-[6px] max-h-[420px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [overscroll-behavior:contain] [@media(max-width:768px)]:max-h-none [@media(max-width:768px)]:overflow-visible';
export const CAL_CAP =
  'flex items-center justify-between gap-[0.5rem] font-body font-semibold text-[1rem] text-green mb-3';
export const CAL_CAP_SPAN = 'flex-[1_1_auto] text-center';
export const CAL_CAP_BTN =
  'flex-[0_0_auto] w-8 h-8 inline-flex items-center justify-center [border:1px_solid_var(--line)] rounded-sm bg-white text-gold text-[1.3rem] leading-none cursor-pointer [transition:background_var(--dur-fast)_ease,border-color_var(--dur-fast)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-cream hover:[border-color:var(--color-gold)]';
export const CAL_GRID = 'grid [grid-template-columns:repeat(7,1fr)] gap-[2px]';
export const CAL_DOW = 'font-body font-medium text-label tracking-[0.14em] uppercase text-muted text-center py-1';
export function buildCalendarDayClass(off, selector) {
  function pickRouteFilterValue() {
    if (selector) return 'bg-gold text-white cursor-pointer hover:bg-gold-d';
    if (off) return 'bg-transparent text-[#cfccc4] cursor-default';
    return 'bg-transparent text-ink cursor-pointer hover:bg-[#f1efe9]';
  }

  return `aspect-square flex items-center justify-center font-body font-normal text-small border-none border-current rounded-sm ${pickRouteFilterValue()}`;
}

export const CAL_FOOT =
  'flex items-center justify-between gap-[14px] py-3 px-[18px] [border-top:1px_solid_var(--line)] sticky bottom-0 bg-white';
export const CAL_HINT = 'font-body font-normal text-small text-muted';
export const CAL_APPLY = `inline-flex ${BTN_SM} font-body bg-cta text-white border-none [border-color:var(--color-cta)] cursor-pointer hover:bg-cta-d hover:[border-color:var(--color-cta-d)] hover:text-white disabled:opacity-50 disabled:cursor-default`;
export const PANEL_CLOSE_SHEET = `${PANEL_CLOSE} min-[769px]:hidden`;

export function buildPanelMenuClass(open) {
  return [
    'absolute top-[calc(100%_+_8px)] left-0 right-0 z-[60] bg-white [border:1px_solid_var(--line)] rounded-lg overflow-hidden [overscroll-behavior:contain]',
    '[transition:opacity_0.24s_var(--ease),transform_0.24s_var(--ease),visibility_0.24s]',
    PANEL_MOBILE_TRANSITION,
    open
      ? 'opacity-100 visible pointer-events-auto [transform:translateY(0)]'
      : 'opacity-0 invisible pointer-events-none [transform:translateY(-8px)]',
    '[@media(max-width:768px)]:fixed [@media(max-width:768px)]:left-0 [@media(max-width:768px)]:right-0 [@media(max-width:768px)]:bottom-0 [@media(max-width:768px)]:top-auto',
    '[@media(max-width:768px)]:[border-radius:var(--r-xl)_var(--r-xl)_0_0]',
    '[@media(max-width:768px)]:max-h-[calc(100dvh-100px)] [@media(max-width:768px)]:overflow-y-auto [@media(max-width:768px)]:[scrollbar-width:none] [@media(max-width:768px)]:[&::-webkit-scrollbar]:hidden [@media(max-width:768px)]:block [@media(max-width:768px)]:opacity-100',
    open
      ? '[@media(max-width:768px)]:[transform:translateY(0)]'
      : '[@media(max-width:768px)]:[transform:translateY(100%)]',
  ].join(' ');
}
export const PANEL_HEAD_MENU =
  'hidden [@media(max-width:768px)]:flex [@media(max-width:768px)]:items-center [@media(max-width:768px)]:justify-between [@media(max-width:768px)]:pt-4 [@media(max-width:768px)]:px-5 [@media(max-width:768px)]:pb-3 [@media(max-width:768px)]:[border-bottom:1px_solid_var(--line)] [@media(max-width:768px)]:sticky [@media(max-width:768px)]:top-0 [@media(max-width:768px)]:bg-white';
export const PANEL_BODY_MENU = 'max-h-[500px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
export function buildOptionMenuClass(selector) {
  return `w-full flex items-center gap-[0.8rem] py-[0.85rem] px-4 border-none text-left cursor-pointer [&+&]:[border-top:1px_solid_var(--line)] ${selector ? 'bg-[rgba(34,32,28,0.14)]' : 'bg-transparent hover:bg-[#faf8f3]'}`;
}

export const CSEL_GROUP = 'relative block w-full';
export const BK_NATIVE = '!hidden';
export const HS_OPT_FLAG = 'w-5 h-[14px] flex-none object-cover rounded-[2px] [box-shadow:0_0_0_1px_rgba(0,0,0,0.08)]';
export const HS_OPT_NM =
  'flex-1 font-body font-medium text-[1rem] text-green [&_small]:block [&_small]:font-normal [&_small]:text-[length:var(--fs-label)] [&_small]:text-muted';
export const HS_OPT_PR = 'font-body font-semibold text-[length:var(--fs-small)] text-gold-d whitespace-nowrap';
export const HS_OPT_IC =
  'flex-none w-[38px] h-[38px] rounded-[50%] [border:1.5px_solid_var(--color-gold)] text-gold-d flex items-center justify-center [&_svg]:w-[var(--icon-md)] [&_svg]:h-[var(--icon-md)]';
