// Utility strings for the custom control system, ported from CUE's
// components/ui/hsClasses.js. Defined ONCE here and imported by Select,
// DateField and Overlay so nothing is restated.
//
// WHY THESE EXIST AT ALL: this site used native <select> and
// <input type="date"> until now, which renders differently on every platform
// and shows a US "mm/dd/yyyy" hint to guests who do not write dates that way.
// CUE replaced every native control site-wide for that reason. The panels are
// centred cards on every screen, with a scrim behind them.
//
// TRIMMED: CUE's DatePopup bottom-sheet and HeroSearch menu panel variants are
// left out — nothing here consumes them, and dead strings rot.

// ===== Control (trigger button) =====
const CONTROL_COMMON =
  'w-full bg-white font-body font-normal text-field text-green text-left cursor-pointer rounded-md ' +
  '[border:1px_solid_var(--line)] ' +
  '[transition:border-color_var(--dur-fast)_ease,box-shadow_var(--dur-fast)_ease,scale_var(--dur-fast)_var(--ease)] ' +
  'hover:[border-color:var(--color-gold)] focus-visible:outline-none ' +
  'focus-visible:[border-color:var(--color-gold)] focus-visible:[box-shadow:var(--focus-ring)]';

// Plain control (.hs-control): 1 baris, chevron di kanan.
export const CONTROL =
  `${CONTROL_COMMON} flex items-center justify-between gap-[10px] px-[0.85rem] py-0 h-[var(--field-h)]`;

// Rich control (.hs-control--rich): ikon + stack (hint+val) + chevron, lebih tinggi.
export const CONTROL_RICH =
  `${CONTROL_COMMON} flex items-center justify-between gap-[0.65rem] px-[0.85rem] py-2 h-auto min-h-[3.1rem]`;

// .hs-control__val (plain): teks kepotong ellipsis. placeholder -> muted.
export const CONTROL_VAL = 'overflow-hidden text-ellipsis whitespace-nowrap';
export const CONTROL_VAL_PLACEHOLDER = `${CONTROL_VAL} text-muted`;
// .hs-control__val--flag: bendera + nama sejajar. Ellipsis pindah ke child .hs-opt__nm
// -> di-apply langsung di caller (CONTROL_FLAG_NM), biar gak main escape variant.
export const CONTROL_VAL_FLAG = 'flex items-center gap-[0.5rem]';
export const CONTROL_FLAG_NM = 'overflow-hidden text-ellipsis whitespace-nowrap';

// Rich stack bits (.hs-control--rich .hs-control__ic/__stack/__hint/__val)
export const CONTROL_IC = 'flex-[0_0_auto] inline-flex w-5 h-5 text-green [&_svg]:w-full [&_svg]:h-full';
export const CONTROL_STACK = 'flex-[1_1_auto] flex flex-col leading-[1.3] min-w-0';
export const CONTROL_HINT = 'text-label font-medium tracking-[0.04em] text-muted';
export const CONTROL_VAL_RICH = 'overflow-hidden text-ellipsis whitespace-nowrap text-field font-medium text-ink';
export const CONTROL_VAL_RICH_PLACEHOLDER = 'overflow-hidden text-ellipsis whitespace-nowrap text-field font-normal text-muted';

// .hs-chev — rotate on open itu DEAD di React (is-open gak pernah di-set), jadi gak
// dimasukin. transition tetep (mirror computed).
export const CHEV = 'w-[18px] h-[18px] shrink-0 text-muted [transition:transform_var(--dur)_ease]';

// ===== Panel: mode POPUP (kartu ke-center, SAMA di semua layar). Select selalu popup
// (popup default true, gak ada pemakaian popup=false), jadi cukup 1 layout - bottom-sheet
// & floating-dropdown gak kepake buat Select. Base .hs-panel (bg/border/overscroll/
// transisi) + override .hs-panel--popup (fixed center/size/radius/shadow/flex). =====
// HP (<=768): transition di-override sama @media(max-768) .hs-panel jadi transform/
// visibility 0.3s (tanpa opacity) - berlaku juga ke popup center. Direplikasi biar sama.
const PANEL_MOBILE_TRANSITION =
  '[@media(max-width:768px)]:[transition:transform_var(--dur-slow)_var(--ease),visibility_var(--dur-slow)]';
const PANEL_POPUP_STATIC =
  'fixed top-1/2 left-1/2 [right:auto] [bottom:auto] w-[min(440px,85vw)] max-h-[85vh] ' +
  'bg-white [border:1px_solid_var(--line)] rounded-xl [box-shadow:var(--shadow-xl)] z-[340] ' +
  'flex flex-col overflow-hidden [overscroll-behavior:contain] ' +
  '[transition:opacity_0.24s_var(--ease),transform_0.24s_var(--ease),visibility_0.24s] ' +
  PANEL_MOBILE_TRANSITION;
export const panelPopup = (open) =>
  `${PANEL_POPUP_STATIC} ${open ? 'opacity-100 visible pointer-events-auto [transform:translate(-50%,-50%)_scale(1)]' : 'opacity-0 invisible pointer-events-none [transform:translate(-50%,-50%)_scale(0.96)]'}`;
export const PANEL_HEAD = 'flex items-center justify-between pt-4 px-5 pb-3 [border-bottom:1px_solid_#f2efe7] flex-none';
export const PANEL_HEAD_H3 = 'font-body font-semibold text-[1rem] text-green';
export const PANEL_CLOSE = 'block w-[34px] h-[34px] rounded-[50%] [border:1px_solid_var(--line)] bg-white text-green text-[1.2rem] leading-none cursor-pointer';
// Scrollbar disembunyiin (Wayan) - dulu keliatan pas opsi kepanjangan buat area
// popup (Guests/Pickup area di navbar, dst); tetep bisa di-scroll (touch/drag),
// cuma track/thumb-nya gak digambar. Pola sama kayak slider (`[scrollbar-width:none]
// [&::-webkit-scrollbar]:hidden`, lihat Modal.jsx/gridClasses.js).
export const PANEL_BODY = 'max-h-none overflow-y-auto flex-[1_1_auto] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

// .hs-opt (+ .bk-opt padding 12/16 + .is-sel + hover + divider antar-opt). Selected TIDAK
// berubah pas hover (specificity is-sel > :hover di asli), jadi bg-nya di cabang.
// `disabled` (Sep 2026, time-slot picker #TIME-1): opsi tetep KELIATAN (guest ngerti ada
// slot itu tapi gak bisa dipilih) - dimuting + no hover/cursor, bukan disembunyiin.
export const opt = (sel, disabled) =>
  `w-full flex items-center gap-[0.8rem] py-3 px-4 border-none text-left [&+&]:[border-top:1px_solid_#f2efe7] ${
    disabled
      ? 'cursor-not-allowed opacity-40 bg-transparent'
      : `cursor-pointer ${sel ? 'bg-[rgba(34,32,28,0.14)]' : 'bg-transparent hover:bg-[#faf8f3]'}`
  }`;

// .hs-overlay (scrim; cuma tampil pas open). --elevated = z lebih tinggi (dibuka dari modal).
// Fades in/out (was an instant block/hidden snap) - the consumers that render this
// (<Overlay>, DatePopup) are always mounted once open has ever been true, so the
// transition always has a "closed" frame to animate from.
export const overlay = (open, elevated) =>
  `fixed inset-0 bg-[rgba(26,26,26,0.42)] ${elevated ? 'z-[300]' : 'z-[55]'} ` +
  `transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-out)] motion-reduce:transition-none ` +
  `${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`;

// ===== DateField: chevron kalender + panel bookdate + kalender =====
// .hs-chev--cal (17px, gak muter).
export const CHEV_CAL = 'w-[17px] h-[17px] shrink-0 text-muted [transition:transform_var(--dur)_ease]';

// Panel .bookdate-panel (= .hs-panel--popup + override desktop min-769). HP: popup center
// (w 440/85vw, transform scale). Desktop: w 430/92vw, transform translate -48->-50 (tanpa
// scale), overflow-y auto, head sticky.
const PANEL_BOOKDATE_STATIC =
  'fixed top-1/2 left-1/2 [right:auto] [bottom:auto] w-[min(440px,85vw)] max-h-[85vh] ' +
  'bg-white [border:1px_solid_var(--line)] rounded-xl [box-shadow:var(--shadow-xl)] z-[340] ' +
  'flex flex-col overflow-hidden [overscroll-behavior:contain] ' +
  '[transition:opacity_0.24s_var(--ease),transform_0.24s_var(--ease),visibility_0.24s] ' +
  PANEL_MOBILE_TRANSITION + ' ' +
  'min-[769px]:w-[min(430px,92vw)] min-[769px]:max-h-[86vh] min-[769px]:overflow-y-auto min-[769px]:[scrollbar-width:none] min-[769px]:[&::-webkit-scrollbar]:hidden';
export const panelBookdate = (open) =>
  `${PANEL_BOOKDATE_STATIC} ${open ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'} ${open ? '[transform:translate(-50%,-50%)_scale(1)] min-[769px]:[transform:translate(-50%,-50%)]' : '[transform:translate(-50%,-50%)_scale(0.96)] min-[769px]:[transform:translate(-50%,-48%)]'}`;
// Head bookdate: flex-none (popup) + sticky/top-0/bg-white di HP (dari @media max-768)
// DAN desktop (dari bookdate min-769); z-1 cuma desktop.
export const PANEL_HEAD_BOOKDATE =
  'flex items-center justify-between pt-4 px-5 pb-3 [border-bottom:1px_solid_#f2efe7] flex-none ' +
  'sticky top-0 bg-white min-[769px]:z-[1]';

// Kalender (.hs-cal*). HP: cal max-h none + overflow visible (panel body yg scroll).
export const HS_CAL = 'pt-4 px-4 pb-[6px] max-h-[340px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [overscroll-behavior:contain] [@media(max-width:768px)]:max-h-none [@media(max-width:768px)]:overflow-visible';
export const CAL_CAP = 'flex items-center justify-between gap-[0.5rem] font-body font-semibold text-[1rem] text-green mb-3';
export const CAL_CAP_SPAN = 'flex-[1_1_auto] text-center';
export const CAL_CAP_BTN = 'flex-[0_0_auto] w-8 h-8 inline-flex items-center justify-center [border:1px_solid_var(--line)] rounded-sm bg-white text-gold text-[1.3rem] leading-none cursor-pointer [transition:background_var(--dur-fast)_ease,border-color_var(--dur-fast)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-cream hover:[border-color:var(--color-gold)]';
// grid-cols-7 Tailwind = repeat(7,minmax(0,1fr)); asli pakai repeat(7,1fr) (min auto) ->
// beda sub-pixel, jadi pakai arbitrary biar persis.
export const CAL_GRID = 'grid [grid-template-columns:repeat(7,1fr)] gap-[2px]';
export const CAL_DOW = 'font-body font-medium text-label tracking-[0.14em] uppercase text-muted text-center py-1';
// Hari: sel (tanggal kepilih, prioritas) = gold/soft-black + putih (konvensi active-state
// design system) · off (muted, gak bisa klik) · normal (hover bg abu tipis). Dulu tanggal
// kepilih gak ke-highlight (CSS `.sel` vs JSX `is-sel` mismatch) - sekarang di-wire lewat flag.
export const calDay = (off, sel) =>
  `aspect-square flex items-center justify-center font-body font-normal text-small border-none border-current rounded-sm ${
    sel
      ? 'bg-gold text-white cursor-pointer hover:bg-gold-d'
      : off
        ? 'bg-transparent text-[#cfccc4] cursor-default'
        : 'bg-transparent text-ink cursor-pointer hover:bg-[#f1efe9]'
  }`;

// Custom-select shell + option-item primitives (B-FINAL). Wrapper, hidden native,
// and the flag / name / price / icon parts of option rows and the selected-value display.
export const CSEL_GROUP = 'relative block w-full';
export const BK_NATIVE = '!hidden';
export const HS_OPT_FLAG = 'w-5 h-[14px] flex-none object-cover rounded-[2px] [box-shadow:0_0_0_1px_rgba(0,0,0,0.08)]';
export const HS_OPT_NM = 'flex-1 font-body font-medium text-[1rem] text-green [&_small]:block [&_small]:font-normal [&_small]:text-[length:var(--fs-label)] [&_small]:text-muted';
export const HS_OPT_PR = 'font-body font-semibold text-[length:var(--fs-small)] text-gold-d whitespace-nowrap';
export const HS_OPT_IC = 'flex-none w-[38px] h-[38px] rounded-[50%] [border:1.5px_solid_var(--color-gold)] text-gold-d flex items-center justify-center [&_svg]:w-[var(--icon-md)] [&_svg]:h-[var(--icon-md)]';
