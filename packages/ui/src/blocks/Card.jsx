import { cn } from '../lib/cn.js';
import { CARD_HOVER_LG, CARD_HOVER_SM, CARD_SHAPES, CARD_TONES } from './cardClasses.js';

export default function Card({
  as: Tag = 'div',
  shape = 'framed',
  tone = 'white',
  hover = false,
  className,
  children,
  ...rest
}) {
  const lift = hover === 'lg' ? CARD_HOVER_LG : hover ? CARD_HOVER_SM : '';
  return (
    <Tag
      className={cn(CARD_SHAPES[shape] || CARD_SHAPES.framed, CARD_TONES[tone] ?? CARD_TONES.white, lift, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
