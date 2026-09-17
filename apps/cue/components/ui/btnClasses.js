// Shared button utility-strings (migrasi Fase 2, TW-A12 #333). Satu sumber DRY
// buat primitif tombol yang dulu class CSS di style.css — komponen import string
// ini biar tetep self-contained (bawa style-nya) tanpa nyalin CSS.
//
// BTN_PILL = ghost/secondary pill ("View all …", "Add a program", "Sign out",
// review CTA). Mirror 1:1 dari `.btn-pill` (+ :hover) di style.css: outline gold,
// bg putih, teks gold-d, isi gold pas hover. (border butuh warna eksplisit —
// Preflight OFF; text-h3 = --fs-h3 14px; transition pakai token --dur.)
export const BTN_PILL =
  'inline-block py-[0.85rem] px-[1.9rem] rounded-pill [border:1px_solid_var(--color-gold)] ' +
  'bg-white text-gold-d font-body font-semibold text-h3 no-underline ' +
  '[transition:background-color_var(--dur)_ease,color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-gold hover:text-white';
