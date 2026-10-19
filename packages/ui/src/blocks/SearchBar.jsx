'use client';

import { cn } from '../lib/cn.js';
import Card from './Card.jsx';

const GRIDS = {
  hero: 'relative z-10 mx-auto -mt-10 sm:-mt-12 max-w-4xl grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 sm:items-end',
  panel: 'grid grid-cols-2 gap-2',
  stack: 'grid grid-cols-1 gap-3',
};

export default function SearchBar({ variant = 'hero', className, children, action = null }) {
  const grid = GRIDS[variant] || GRIDS.hero;
  if (variant !== 'hero') {
    return (
      <>
        <div className={cn(grid, className)}>{children}</div>
        {action}
      </>
    );
  }
  return (
    <Card className={cn(grid, className)}>
      {children}
      {action}
    </Card>
  );
}

export const SEARCH_LABEL = 'block mb-1 text-small font-medium text-muted';
