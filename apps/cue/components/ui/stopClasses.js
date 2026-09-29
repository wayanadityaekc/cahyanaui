import { ROW_RULE } from './separatorClasses';
// Stop row classes; keep the `stops`/`stop` hook classes, DetailTabs' SEC wrapper overrides target them.
export const STOPS = 'stops py-[var(--section-gap)] px-6';
export const STOP =
  'stop grid grid-cols-[1fr_1.1fr] gap-10 items-center max-w-[1000px] mx-auto py-8 ' +
  ROW_RULE + ' ' +
  'max-[768px]:grid-cols-[1fr] max-[768px]:gap-5';
// No radius on the stop image, on purpose.
export const STOP_IMAGE =
  'relative overflow-hidden aspect-[4/3] bg-green bg-cover bg-center ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center';
