'use client';

import { cn } from '../lib/cn.js';
import { GRID_SLIDER } from './gridClasses.js';

/**
 * A row of cards. Phones swipe it; desktop lays it out as a wrapping grid, so
 * there is no scroll button anywhere. The track is whatever class string is
 * passed (GRID_SLIDER by default).
 */
export default function Slider({ children, className = '', gridClassName = GRID_SLIDER }) {
  return (
    <div className={cn('relative', className)}>
      <div className={gridClassName}>{children}</div>
    </div>
  );
}
