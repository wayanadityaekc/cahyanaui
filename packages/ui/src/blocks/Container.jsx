import { cn } from '../lib/cn.js';
import { CONTAINER_WIDTHS } from './layoutClasses.js';

export default function Container({ as: Tag = 'div', width = 'wide', className, children, ...rest }) {
  return (
    <Tag className={cn(CONTAINER_WIDTHS[width] || CONTAINER_WIDTHS.wide, className)} {...rest}>
      {children}
    </Tag>
  );
}
