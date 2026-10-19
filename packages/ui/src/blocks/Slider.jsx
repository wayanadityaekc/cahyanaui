'use client';

import { cn } from '../lib/cn.js';
import { GRID_SLIDER } from './gridClasses.js';

export default function Slider({ children, className = '', gridClassName = GRID_SLIDER }) {
  return (
    <div className={cn('relative', className)}>
      <div className={gridClassName}>{children}</div>
    </div>
  );
}
