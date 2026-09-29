import { cn } from '../lib/cn.js';
import { SEP_H, SEP_V } from './separatorClasses.js';

/**
 * One separator: 1px of --line. Decorative (role="none") by default, because
 * most lines only draw a boundary the layout already makes; pass
 * decorative={false} when the line really splits two groups for a screen reader.
 * List rows take ROW_RULE instead of a Separator between every pair.
 */
export default function Separator({ orientation = 'horizontal', decorative = true, className = '' }) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative || orientation === 'horizontal' ? undefined : 'vertical'}
      className={cn(orientation === 'vertical' ? SEP_V : SEP_H, className)}
    />
  );
}
