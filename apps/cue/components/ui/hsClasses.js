// Tailwind utility strings mirroring the legacy `.hs-*` custom control system
// (migrasi Fase 2, opsi A - Wayan: komponen self-contained). Didefinisiin SEKALI di
// sini, di-import Select / DateField / DatePopup / HeroSearch biar gak keduplikat.
//
// Nilai = mirror PERSIS computed style lama di style.css. State (open / selected /
// keyboard / kalender range) = fungsi atau varian kondisional, BUKAN class CSS.
// `.hs-*`/`.bk-*` CSS baru dihapus dari style.css kalau SEMUA pemakainya udah pindah.
//
// Catatan sumber:
//   - .bk-control REDUNDANT (height/pt-pb/weight udah sama kaya .hs-control base) -> di-drop.
//   - State `.is-open` di control + rotate chevron itu DEAD di React (komponen gak pernah
//     nge-set class `.is-open` di .hs-control) -> SENGAJA gak di-utility-in (zero-diff =
//     nyamain render sekarang, bukan ngidupin behavior mati). hover/focus-visible tetep
//     jalan (pseudo). Border tetep line; hover/focus override warnanya lewat pseudo.

// ===== Control (trigger button) =====
const CONTROL_COMMON =
  'w-full bg-white font-body font-normal text-field text-green text-left cursor-pointer rounded-md ' +
  '[border:1px_solid_var(--line)] ' +
  '[transition:border-color_var(--dur-fast)_ease,box-shadow_var(--dur-fast)_ease] ' +
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
export const CAL_CAP_BTN = 'flex-[0_0_auto] w-8 h-8 inline-flex items-center justify-center [border:1px_solid_var(--line)] rounded-sm bg-white text-gold text-[1.3rem] leading-none cursor-pointer [transition:background_var(--dur-fast)_ease,border-color_var(--dur-fast)_ease] hover:bg-cream hover:[border-color:var(--color-gold)]';
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

// ===== DatePopup (booking date picker): panel TANPA hs-panel--popup -> HP jadi
// bottom-sheet (@media max-768 .hs-panel), desktop di-center sama bookdate-panel.
// Radius/z/shadow ikut base .hs-panel (bukan popup): radius-lg, z-60. =====
export const panelDateSheet = (open) => [
  'fixed bg-white [border:1px_solid_var(--line)] z-[60] overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [overscroll-behavior:contain]',
  'rounded-lg [box-shadow:var(--shadow-xl)]',
  '[transition:opacity_0.24s_var(--ease),transform_0.24s_var(--ease),visibility_0.24s]', PANEL_MOBILE_TRANSITION,
  open ? 'visible pointer-events-auto opacity-100' : 'invisible pointer-events-none opacity-0',
  // HP: bottom-sheet
  '[@media(max-width:768px)]:left-0 [@media(max-width:768px)]:right-0 [@media(max-width:768px)]:bottom-0 [@media(max-width:768px)]:top-auto',
  '[@media(max-width:768px)]:[border-radius:var(--r-xl)_var(--r-xl)_0_0] [@media(max-width:768px)]:[box-shadow:0_-12px_48px_rgba(26,26,26,0.28)]',
  '[@media(max-width:768px)]:max-h-[calc(100dvh-100px)] [@media(max-width:768px)]:block [@media(max-width:768px)]:opacity-100',
  open ? '[@media(max-width:768px)]:[transform:translateY(0)]' : '[@media(max-width:768px)]:[transform:translateY(100%)]',
  // Desktop: center (bookdate)
  'min-[769px]:top-1/2 min-[769px]:left-1/2 min-[769px]:right-auto min-[769px]:w-[min(430px,92vw)] min-[769px]:max-h-[86vh]',
  open ? 'min-[769px]:[transform:translate(-50%,-50%)]' : 'min-[769px]:[transform:translate(-50%,-48%)]',
].join(' ');
// Head DatePopup: sama kaya bookdate TAPI TANPA flex-none (panelnya bukan flex-col).
export const PANEL_HEAD_SHEET =
  'flex items-center justify-between pt-4 px-5 pb-3 [border-bottom:1px_solid_#f2efe7] sticky top-0 bg-white min-[769px]:z-[1]';
// Footer kalender (Apply) - sticky bottom di HP & desktop.
export const CAL_FOOT = 'flex items-center justify-between gap-[14px] py-3 px-[18px] [border-top:1px_solid_#f2efe7] sticky bottom-0 bg-white';
export const CAL_HINT = 'font-body font-normal text-small text-muted';
// Apply = tombol CTA (bg-nya di-override grup .hs-cal__apply/.hsearch__go/dst jadi
// --color-cta, bukan --color-green; hover cta-d). border-color cta walau style none.
export const CAL_APPLY = 'font-body font-semibold text-small bg-cta text-white border-none [border-color:var(--color-cta)] rounded-pill py-[9px] px-5 cursor-pointer hover:bg-cta-d hover:[border-color:var(--color-cta-d)] hover:text-white disabled:opacity-50 disabled:cursor-default';
// Close DatePopup: keliatan di HP, DI-HIDE di desktop (@media min-769 .hs-panel__close),
// karena panelnya bukan popup (gak ada override display:block).
export const PANEL_CLOSE_SHEET = `${PANEL_CLOSE} min-[769px]:hidden`;

// ===== HeroSearch: dropdown "How to explore" (.hs-panel--menu). Desktop = dropdown
// ngambang (base .hs-panel absolute), HP = bottom-sheet. Head KE-HIDE di desktop
// (base .hs-panel__head display:none, gak ada override). =====
export const panelMenu = (open) => [
  'absolute top-[calc(100%_+_8px)] left-0 right-0 z-[60] bg-white [border:1px_solid_var(--line)] rounded-lg [box-shadow:var(--shadow-xl)] overflow-hidden [overscroll-behavior:contain]',
  '[transition:opacity_0.24s_var(--ease),transform_0.24s_var(--ease),visibility_0.24s]', PANEL_MOBILE_TRANSITION,
  open ? 'opacity-100 visible pointer-events-auto [transform:translateY(0)]' : 'opacity-0 invisible pointer-events-none [transform:translateY(-8px)]',
  '[@media(max-width:768px)]:fixed [@media(max-width:768px)]:left-0 [@media(max-width:768px)]:right-0 [@media(max-width:768px)]:bottom-0 [@media(max-width:768px)]:top-auto',
  '[@media(max-width:768px)]:[border-radius:var(--r-xl)_var(--r-xl)_0_0] [@media(max-width:768px)]:[box-shadow:0_-12px_48px_rgba(26,26,26,0.28)]',
  '[@media(max-width:768px)]:max-h-[calc(100dvh-100px)] [@media(max-width:768px)]:overflow-y-auto [@media(max-width:768px)]:[scrollbar-width:none] [@media(max-width:768px)]:[&::-webkit-scrollbar]:hidden [@media(max-width:768px)]:block [@media(max-width:768px)]:opacity-100',
  open ? '[@media(max-width:768px)]:[transform:translateY(0)]' : '[@media(max-width:768px)]:[transform:translateY(100%)]',
].join(' ');
// Head menu: hidden di desktop, muncul jadi sheet-head di HP.
export const PANEL_HEAD_MENU =
  'hidden [@media(max-width:768px)]:flex [@media(max-width:768px)]:items-center [@media(max-width:768px)]:justify-between [@media(max-width:768px)]:pt-4 [@media(max-width:768px)]:px-5 [@media(max-width:768px)]:pb-3 [@media(max-width:768px)]:[border-bottom:1px_solid_#f2efe7] [@media(max-width:768px)]:sticky [@media(max-width:768px)]:top-0 [@media(max-width:768px)]:bg-white';
// Body menu: max-h 500 di SEMUA layar. `.hs-panel--menu .hs-panel__body` (0,2,0)
// menang atas @media(max-768) .hs-panel__body none (0,1,0), jadi 500 terus.
export const PANEL_BODY_MENU = 'max-h-[500px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
// Opt HeroSearch: padding base .hs-opt (0.85rem 1rem, TANPA .bk-opt). Konten (ic/nm/pr)
// tetep class shared. is-sel sama kaya Select.
export const optMenu = (sel) =>
  `w-full flex items-center gap-[0.8rem] py-[0.85rem] px-4 border-none text-left cursor-pointer [&+&]:[border-top:1px_solid_#f2efe7] ${sel ? 'bg-[rgba(34,32,28,0.14)]' : 'bg-transparent hover:bg-[#faf8f3]'}`;

// Custom-select shell + option-item primitives (B-FINAL). Wrapper, hidden native,
// and the flag / name / price / icon parts of option rows and the selected-value display.
export const CSEL_GROUP = 'relative block w-full';
export const BK_NATIVE = '!hidden';
export const HS_OPT_FLAG = 'w-5 h-[14px] flex-none object-cover rounded-[2px] [box-shadow:0_0_0_1px_rgba(0,0,0,0.08)]';
export const HS_OPT_NM = 'flex-1 font-body font-medium text-[1rem] text-green [&_small]:block [&_small]:font-normal [&_small]:text-[length:var(--fs-label)] [&_small]:text-muted';
export const HS_OPT_PR = 'font-body font-semibold text-[length:var(--fs-small)] text-gold-d whitespace-nowrap';
export const HS_OPT_IC = 'flex-none w-[38px] h-[38px] rounded-[50%] [border:1.5px_solid_var(--color-gold)] text-gold-d flex items-center justify-center [&_svg]:w-[var(--icon-md)] [&_svg]:h-[var(--icon-md)]';
