import { cn } from '../lib/cn.js';
import Section from './Section.jsx';
import SectionHeading from './SectionHeading.jsx';

/**
 * A photo on one side, a short pitch on the other. The shape a homepage uses
 * to introduce one thing at a time without turning into a wall of cards.
 *
 *   image / alt   the photograph
 *   reverse       put the photo on the RIGHT
 *   tone          passed to Section (plain / cream / white / dark)
 *   actions       the buttons under the copy
 *
 * ALTERNATE `reverse` DOWN A PAGE. Three of these in a row with the photo
 * always on the same side reads as a list of the same thing; alternating makes
 * each one register as its own item. That is the only reason the prop exists.
 *
 * THE PHOTO STACKS ABOVE THE COPY ON A PHONE, ALWAYS - including when
 * `reverse` is set. `reverse` is a DESKTOP-only instruction (it applies from
 * 993px), because on one column the photo has to come first or the section
 * opens with a wall of text and the guest has nothing to look at.
 */
export default function SplitFeature({
  image,
  alt = '',
  reverse = false,
  tone = 'plain',
  eyebrow,
  title,
  lede,
  as = 'h2',
  actions = null,
  ratio = 'aspect-[4/3]',
  className,
  children,
  ...rest
}) {
  return (
    <Section tone={tone} className={className} {...rest}>
      <div className={cn(
        'grid gap-8 items-center min-[993px]:grid-cols-2 min-[993px]:gap-12',
        reverse && 'min-[993px]:[&>*:first-child]:order-2',
      )}>
        <div className={cn('relative overflow-hidden rounded-lg bg-green', ratio)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div>
          <SectionHeading eyebrow={eyebrow} title={title} lede={lede} as={as} size="h2" titleClassName="" />
          {children}
          {actions ? <div className="flex flex-wrap gap-3 mt-6">{actions}</div> : null}
        </div>
      </div>
    </Section>
  );
}
