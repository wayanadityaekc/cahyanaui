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
const PANEL_POPUP_STATIC =
  'fixed top-1/2 left-1/2 [right:auto] [bottom:auto] w-[min(440px,85vw)] max-h-[85vh] ' +
  'bg-white [border:1px_solid_var(--line)] rounded-xl [box-shadow:var(--shadow-xl)] z-[340] ' +
  'flex flex-col overflow-hidden [overscroll-behavior:contain] ' +
  '[transition:opacity_0.24s_var(--ease),transform_0.24s_var(--ease),visibility_0.24s]';
export const panelPopup = (open) =>
  `${PANEL_POPUP_STATIC} ${open ? 'opacity-100 visible pointer-events-auto [transform:translate(-50%,-50%)_scale(1)]' : 'opacity-0 invisible pointer-events-none [transform:translate(-50%,-50%)_scale(0.96)]'}`;
export const PANEL_HEAD = 'flex items-center justify-between pt-4 px-5 pb-3 [border-bottom:1px_solid_#f2efe7] flex-none';
export const PANEL_HEAD_H3 = 'font-body font-semibold text-[1rem] text-green';
export const PANEL_CLOSE = 'block w-[34px] h-[34px] rounded-[50%] [border:1px_solid_var(--line)] bg-white text-green text-[1.2rem] leading-none cursor-pointer';
export const PANEL_BODY = 'max-h-none overflow-y-auto flex-[1_1_auto]';

// .hs-opt (+ .bk-opt padding 12/16 + .is-sel + hover + divider antar-opt). Selected TIDAK
// berubah pas hover (specificity is-sel > :hover di asli), jadi bg-nya di cabang.
export const opt = (sel) =>
  `w-full flex items-center gap-[0.8rem] py-3 px-4 border-none text-left cursor-pointer [&+&]:[border-top:1px_solid_#f2efe7] ${sel ? 'bg-[rgba(34,32,28,0.14)]' : 'bg-transparent hover:bg-[#faf8f3]'}`;

// .hs-overlay (scrim; cuma tampil pas open). --elevated = z lebih tinggi (dibuka dari modal).
export const overlay = (open, elevated) =>
  `fixed inset-0 bg-[rgba(26,26,26,0.42)] ${elevated ? 'z-[300]' : 'z-[55]'} ${open ? 'block' : 'hidden'}`;
