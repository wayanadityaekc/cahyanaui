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
