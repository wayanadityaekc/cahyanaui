// Shared tour/attraction "stops" layout (B-FINAL). Photo-left / text-right rows.
// These always render inside DetailTabs' Overview panel, whose SEC wrapper applies
// context overrides ([&_.stops]:p-0, [&_.stop]:max-w-none) that target the `stops`/
// `stop` classes. So those two classes stay as no-CSS hooks (kept in the strings
// below) while the base styling moves to utilities; the DetailTabs overrides still
// win by specificity, exactly as before. STOP_IMAGE has no such override.
export const STOPS = 'stops py-[var(--section-gap)] px-6';
export const STOP =
  'stop grid grid-cols-[1fr_1.1fr] gap-10 items-center max-w-[1000px] mx-auto py-8 ' +
  '[border-bottom:1px_solid_#e0ddd4] last:[border-bottom:none] ' +
  'max-[768px]:grid-cols-[1fr] max-[768px]:gap-5';
// NB: a later style.css rule zeroed .stop__image border-radius unconditionally, so the
// effective radius is 0 (base r-md was dead) — no rounded utility here.
export const STOP_IMAGE =
  'relative overflow-hidden aspect-[4/3] bg-green bg-cover bg-center ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center';
