import { BTN_SM, BTN_PILL } from '@/components/ui/btnClasses';

// Class strings for the My Trips page (cart, booked and past tabs).
// Empty-cart styles; keep the `mtc-empty` marker class.
export const MTC_EMPTY = 'text-center pt-2 px-0 pb-0';
export const MTC_EMPTY_LEAD = 'font-head font-medium tracking-[-0.01em] text-[1rem] text-green m-0 mb-[0.4rem]';
// Hint text needs text-body explicitly, or a bare <p> falls back to 16px.
export const MTC_EMPTY_SUB = 'text-body text-muted max-w-[44ch] mx-auto mt-0 mb-[1.8rem]';
export const MTC_TOTAL = 'flex justify-between items-center bg-cream rounded-lg py-4 px-[1.2rem] mt-[1.4rem]';
export const MTC_TOTAL_LABEL = 'font-medium text-small tracking-[0.14em] uppercase text-green';
export const MTC_TOTAL_VAL = 'text-[1.4rem] font-semibold text-amber-d';
// Cart item icon strings; photo and svg variants are separate strings so w/h utilities don't conflict.
export const MTC_ITEM_ICON = 'flex-[0_0_auto] w-10 h-10 grid place-items-center rounded-md bg-cream text-gold-d [&_svg]:w-[var(--icon-md)] [&_svg]:h-[var(--icon-md)]';
export const MTC_ITEM_ICON_PHOTO = 'flex-[0_0_auto] w-[56px] h-[56px] grid place-items-center rounded-md bg-cream bg-cover bg-center text-gold-d';
export const MTC_ITEM_BODY = 'flex-[1_1_auto] min-w-0';
export const MTC_ITEM_TITLE = 'font-semibold text-green m-0';
export const MTC_ITEM_DESC = 'text-small text-muted mt-[0.15rem] mx-0 mb-0';
export const MTC_ITEM_PRICE = 'flex-[0_0_auto] text-right whitespace-nowrap font-semibold text-amber-d';
export const MTC_ITEM_DEL = 'flex-[0_0_auto] border-none bg-transparent text-muted text-[1.35rem] leading-none cursor-pointer py-0 px-[0.15rem] hover:text-err';
export const MTC_ITEM_DATE = 'text-label font-medium tracking-[0.14em] uppercase text-muted mt-[0.3rem] mx-0 mb-0';
// Booked-trip detail toggle; the chevron rotates via arbitrary transform when aria-expanded=true.
export const MTC_DET_TOGGLE = 'flex items-center gap-[0.35rem] border-none bg-transparent py-[0.35rem] px-0 font-body text-small font-medium text-muted cursor-pointer hover:text-gold';
export const MTC_DET_CHEV = 'w-[15px] h-[15px] [transition:transform_var(--dur-fast)_ease] [[aria-expanded=true]_&]:[transform:rotate(180deg)]';
export const MTC_DET_LIST = 'list-none mt-[0.2rem] mx-0 mb-0 p-0 [border-top:1px_solid_var(--line)]';
export const MTC_DET_LINE = 'flex items-baseline justify-between gap-[0.75rem] py-2 px-0 text-small [&+&]:[border-top:1px_solid_var(--line)]';
export const MTC_DET_NAME = 'flex flex-col gap-[0.15rem] min-w-0 text-green';
export const MTC_DET_META = 'text-label text-muted';
export const MTC_DET_AMT = 'flex-[0_0_auto] whitespace-nowrap font-semibold text-amber-d';
// Notes; the warn variant is a full separate string so text-muted and text-err don't conflict.
export const MTC_NOTE = 'text-small text-muted text-center mt-[0.7rem] mx-auto mb-0 max-w-[46ch]';
export const MTC_NOTE_WARN = 'text-small text-err text-center mt-[0.7rem] mx-auto mb-0 max-w-[46ch]';
export const MTC_POLICY_LINK = 'text-gold-d underline';
// Item rows: cart item (standalone) vs booked-card item (read-only, inside the booking card).
export const MTC_ITEM = 'flex items-center gap-[0.85rem] bg-white border border-line rounded-md py-[0.8rem] px-[0.95rem] mb-[0.6rem]';
export const MTC_ITEM_BOOKED = 'flex items-center gap-[0.85rem] py-[0.8rem] px-[0.95rem] bg-transparent border-0 rounded-none mb-0 cursor-default';
export const MTC_BOOK = 'bg-white border border-line rounded-lg mb-[0.9rem] overflow-hidden';
export const MTC_DET_BOX = 'm-0 pt-0 px-[0.95rem] pb-[0.55rem]';
// One Leave-a-review button under Past trips, covering every reviewable item.
export const MTC_REVIEW_BOX = 'flex justify-center mt-[1.4rem]';
export const MTC_REVIEW_BTN = 'w-full';
// Cancellation contact bar on each upcoming booked card; ghost gold button, not the green primary.
export const MTC_CANCEL_BOX = 'flex justify-end m-0 py-[0.7rem] px-[0.95rem] border-t border-line bg-cream';
export const MTC_CANCEL_BTN = `inline-flex w-auto ${BTN_SM} [border:1px_solid_var(--color-gold)] bg-white text-gold-d font-body font-semibold text-small no-underline [transition:background-color_var(--dur)_ease,color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-gold hover:text-white max-[600px]:w-full max-[600px]:justify-center`;
// Full-width add button.
export const MTC_ADD_FULL = `${BTN_PILL} w-full mt-4`;
// Calendar icon mask for the date button, %20-encoded so it survives as a Tailwind arbitrary value.
export const CAL_MASK = "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='black'%20stroke-width='1.8'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Crect%20x='3'%20y='5'%20width='18'%20height='16'%20rx='2'/%3E%3Cpath%20d='M8%203v4M16%203v4M3%2010h18'/%3E%3C/svg%3E\")";
export const MTC_DATEBTN = `inline-flex items-center whitespace-nowrap gap-[0.4rem] mt-[0.35rem] py-[0.3rem] px-[0.6rem] bg-white text-left cursor-pointer border border-line rounded-md font-body text-[length:var(--fs-field)] text-green before:content-[''] before:flex-none before:w-[14px] before:h-[14px] before:bg-current before:opacity-70 before:[-webkit-mask-image:${CAL_MASK}] before:[mask-image:${CAL_MASK}] before:[-webkit-mask-repeat:no-repeat] before:[mask-repeat:no-repeat] before:[-webkit-mask-position:center] before:[mask-position:center] before:[-webkit-mask-size:contain] before:[mask-size:contain]`;
