// One separator for the whole site (WO7 fix 1, 29 Sep 2026). Shape borrowed from the
// shadcn/ui Separator: a 1px block in the border token, horizontal by default,
// `decorative` by default (role="none" - a line that only draws, says nothing).
// Pass decorative={false} when the line really divides two regions for a screen reader.
//
// Rules between LIST ROWS are not this component - they are the row-rule strings in
// separatorClasses.js, because those lines belong to the row (last row: no line) and
// wrapping every <li> would change the markup of lists that are working.
import { SEP_H, SEP_V } from './separatorClasses';

export default function Separator({ orientation = 'horizontal', decorative = true, className = '' }) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative || orientation === 'horizontal' ? undefined : 'vertical'}
      className={`${orientation === 'vertical' ? SEP_V : SEP_H} ${className}`.trim()}
    />
  );
}
