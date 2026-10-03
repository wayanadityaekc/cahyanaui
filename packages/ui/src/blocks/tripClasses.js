import { BTN_SM } from '../primitives/btnClasses.js';

// CUE's My Trips list styles (booked and past cards, empty and sign-in states). Cards are square like every card here.
export const TRIP_EMPTY = 'text-center pt-2 px-0 pb-0';
export const TRIP_EMPTY_LEAD = 'font-head font-medium tracking-[-0.01em] text-[1rem] text-green m-0 mb-[0.4rem]';
// Hint text needs text-body explicitly, or a bare <p> falls back to 16px.
export const TRIP_EMPTY_SUB = 'text-body text-muted max-w-[44ch] mx-auto mt-0 mb-[1.8rem]';
export const TRIP_CARD = 'bg-surface-raised border border-line mb-[0.9rem] overflow-hidden';
export const TRIP_HEAD = 'flex items-center gap-[0.85rem] py-[0.8rem] px-[0.95rem] cursor-default';
export const TRIP_ICON = 'flex-[0_0_auto] w-[56px] h-[56px] grid place-items-center rounded-md bg-cream bg-cover bg-center text-gold-d [&_svg]:w-[var(--icon-md)] [&_svg]:h-[var(--icon-md)]';
export const TRIP_BODY = 'flex-[1_1_auto] min-w-0';
export const TRIP_TITLE = 'font-semibold text-green m-0';
export const TRIP_DESC = 'text-small text-muted mt-[0.15rem] mx-0 mb-0';
export const TRIP_DATE = 'text-label font-medium tracking-[0.14em] uppercase text-muted mt-[0.3rem] mx-0 mb-0';
export const TRIP_PRICE = 'flex-[0_0_auto] text-right whitespace-nowrap font-semibold text-amber-d';
// Detail toggle; the chevron rotates when aria-expanded=true.
export const TRIP_DET_BOX = 'm-0 pt-0 px-[0.95rem] pb-[0.55rem]';
export const TRIP_DET_TOGGLE = 'flex items-center gap-[0.35rem] border-none bg-transparent py-[0.35rem] px-0 font-body text-small font-medium text-muted cursor-pointer hover:text-gold';
export const TRIP_DET_CHEV = 'w-[15px] h-[15px] [transition:transform_var(--dur-fast)_ease] [[aria-expanded=true]_&]:[transform:rotate(180deg)]';
export const TRIP_DET_LIST = 'list-none mt-[0.2rem] mx-0 mb-0 p-0 [border-top:1px_solid_var(--line)]';
export const TRIP_DET_LINE = 'flex items-baseline justify-between gap-[0.75rem] py-2 px-0 text-small [&+&]:[border-top:1px_solid_var(--line)]';
export const TRIP_DET_NAME = 'flex flex-col gap-[0.15rem] min-w-0 text-green';
export const TRIP_DET_META = 'text-label text-muted';
export const TRIP_DET_AMT = 'flex-[0_0_auto] whitespace-nowrap font-semibold text-amber-d';
// Contact bar on each upcoming card; ghost gold button, not the green primary.
export const TRIP_CANCEL_BOX = 'flex justify-end m-0 py-[0.7rem] px-[0.95rem] border-t border-line bg-cream';
export const TRIP_CANCEL_BTN = `inline-flex w-auto ${BTN_SM} [border:1px_solid_var(--color-gold)] bg-surface-raised text-gold-d font-body font-semibold text-small no-underline [transition:background-color_var(--dur)_ease,color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-gold hover:text-white max-[600px]:w-full max-[600px]:justify-center`;
