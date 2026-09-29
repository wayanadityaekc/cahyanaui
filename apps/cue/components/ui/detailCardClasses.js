// DetailTabs card shell (--r-md, --line border, no shadow), opaque sticky strip and one-pill segment track.
export const CARD =
  'bg-white rounded-md [border:1px_solid_var(--line)] px-6 pt-6 pb-8 ' +
  'max-[560px]:px-4 max-[560px]:pt-5 max-[560px]:pb-[1.6rem]';
export const CARD_WRAP = 'max-w-[1000px] mt-5 mx-auto max-[560px]:mt-4';
export const STRIP = 'sticky top-[var(--header-h,52.8px)] min-[769px]:top-[var(--header-h,57.6px)] z-20 pt-[10px] bg-white';
export const TRACK = 'mb-6 flex w-full gap-1 p-1 rounded-md bg-[rgba(34,32,28,0.08)]';
export function segment(active) { return `flex-1 text-center whitespace-nowrap font-body text-small font-semibold border-none rounded-sm py-[0.55rem] px-2 cursor-pointer transition-[background-color,color,scale] duration-[var(--dur-fast)] ease-[ease] ${active ? 'bg-gold text-white' : 'bg-transparent text-muted hover:text-green'}`; }
// Section inside the card: spacing + a hairline between siblings.
export const SEC =
  'pt-6 [scroll-margin-top:120px] [&+&]:mt-6 [&+&]:[border-top:1px_solid_var(--line)] [&_.stops]:p-0 [&_.stop]:max-w-none';
export const SEC_H = 'text-h2 font-semibold text-gold m-0 mb-4';
