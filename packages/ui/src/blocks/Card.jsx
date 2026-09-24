import { cn } from '../lib/cn.js';
import { CARD_HOVER_LG, CARD_HOVER_SM, CARD_SHAPES } from './cardClasses.js';

/**
 * A card's surface. Contents are entirely the caller's.
 *
 *   shape  framed | inset   (see cardClasses - the two are for two backgrounds)
 *   hover  false | 'sm' | 'lg'   the lift on pointer hover
 *   as     e.g. `as={Link}` when the whole card is one link
 *
 * This is a shell and nothing else. It does not know what a villa is, what a
 * price is, or that a photo goes on top - the moment it does, it can only be
 * used for the thing it learned about. MediaCard is the one that knows.
 */
export default function Card({
  as: Tag = 'div',
  shape = 'framed',
  hover = false,
  className,
  children,
  ...rest
}) {
  const lift = hover === 'lg' ? CARD_HOVER_LG : hover ? CARD_HOVER_SM : '';
  return (
    <Tag className={cn(CARD_SHAPES[shape] || CARD_SHAPES.framed, lift, className)} {...rest}>
      {children}
    </Tag>
  );
}
