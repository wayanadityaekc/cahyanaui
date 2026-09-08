// Shared form-field utility strings (full-portable migrasi). Didefinisiin SEKALI di
// sini, di-import komponen form biar gak keduplikat & style.css bisa dikecilin.
// Nilai = mirror computed style lama di style.css.

// Text/number/native field polos (dulu `.charter__select` + base grup .field input).
// border/radius/font/color/tinggi/padding seragam sama kontrol form lain.
export const FIELD_INPUT =
  'w-full h-[var(--field-h)] py-[0.6rem] px-[0.8rem] [border:1px_solid_var(--line)] rounded-md font-body text-field text-green bg-white';
