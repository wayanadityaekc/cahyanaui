// Class strings used only by the booking confirmation popup (shared chrome lives in modalClasses.js).
export const ROW = 'flex justify-between gap-4 py-[0.65rem] [border-bottom:1px_solid_var(--line)] text-body [&>span:first-child]:font-semibold [&>span:last-child]:text-right [&>span:last-child]:text-gold [&>span:last-child]:font-semibold last:[border-bottom:none]';
export const STEPS = 'flex gap-[6px] mb-2';
export function stepBar(active) { return `flex-1 h-[3px] rounded-[2px] ${active ? 'bg-cta' : 'bg-line'}`; }
export const STEP_LABEL = 'mb-[0.9rem] text-center text-label font-medium tracking-[0.1em] uppercase text-muted';
export const GROUP_LABEL = 'mb-[0.4rem] text-label font-medium tracking-[0.12em] uppercase text-muted';
export const ROWSET = 'mb-4 [border-top:1px_solid_var(--line)]';
// Total gets its own bar on the check screen: it is the number the guest agrees to.
export const PBAR = 'flex items-center justify-between gap-[10px] py-[10px] px-3 rounded-md bg-cream [border:1px_solid_var(--line)]';
export const PBAR_L = 'text-body font-medium text-green';
export const PBAR_V = 'text-[1.15rem] font-semibold text-amber';
export const BACK_LINK = 'block w-full pt-[10px] text-center text-body font-medium text-green bg-transparent border-none cursor-pointer';
export const HINT = 'block mt-[0.35rem] text-small text-muted';
export const DETAILS_LI_ROW = "relative py-[0.5rem] pr-0 pl-[1.1rem] [border-bottom:1px_solid_var(--line)] text-body leading-[var(--lh-body)] text-muted [&::before]:content-['•'] [&::before]:absolute [&::before]:left-[0.15rem] [&::before]:text-gold last:[border-bottom:none]";
export const DETAILS_TOGGLE = 'flex items-center justify-between w-full py-[0.85rem] px-0 font-body text-[1rem] font-semibold text-green bg-transparent border-none cursor-pointer';
export const DETAILS_LI = "relative pt-[0.4rem] pr-0 pb-[0.4rem] pl-5 text-body leading-[var(--lh-body)] text-muted [&::before]:content-['•'] [&::before]:absolute [&::before]:left-[0.25rem] [&::before]:text-gold";
// Payment logo row props, shown above Book Now on the check and payment steps.
export const PAY_CHIPS = {
  className: 'mt-[1.1rem] mb-[1.35rem] text-center',
  logosClass: 'flex flex-wrap items-center justify-center gap-2',
  chipClass: 'inline-flex items-center justify-center h-[30px] min-w-[46px] px-[0.55rem] bg-white [border:1px_solid_var(--line)] rounded-sm transition-transform duration-[var(--dur)] ease-[var(--ease-out)] hover:[transform:translateY(-2px)]',
  svgClass: 'block h-[var(--icon-sm)] w-auto',
};
