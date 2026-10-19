import { cn } from '../lib/cn.js';
import { SEP_H, SEP_V } from './separatorClasses.js';

export default function Separator({ orientation = 'horizontal', decorative = true, className = '' }) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative || orientation === 'horizontal' ? undefined : 'vertical'}
      className={cn(orientation === 'vertical' ? SEP_V : SEP_H, className)}
    />
  );
}
