import { cn } from '../lib/cn.js';
import Container from './Container.jsx';
import SectionHeading from './SectionHeading.jsx';

/**
 * A photo band with words on it. Four of these had been hand-typed across the
 * villa app, each with its own height, its own scrim, and its own idea of how
 * dark to make it.
 *
 *   size   page (a landing hero) | band (a mid-page feature) |
 *          sub (a secondary page's opener) | compact (a detail page's strip)
 *   align  center | end   - where the words sit vertically
 *   width  passed to Container, so the words line up with the page below
 *
 * TWO SCRIMS, AND THIS IS THE PART WORTH KNOWING. The two layouts need
 * opposite gradients. On desktop the copy sits in the left third, so a
 * left-to-right wash darkens exactly where the words are and leaves the
 * photograph alone. On a phone the copy spans the FULL width, and that same
 * wash leaves the right-hand end of every line sitting on whatever is bright
 * in the picture - measured on the villa homepage, the subhead was genuinely
 * hard to read. Below 993px it becomes a top-to-bottom wash instead, dark at
 * both ends, the bottom end also carrying whatever card overlaps the hero.
 *
 * The gradient UNDER the photo is not decoration either: it is what the band
 * looks like in the moment before the image arrives, and it is why a hero
 * never flashes white.
 */
// Height AND the padding that goes with it. They are one decision, not two: a
// compact strip given the landing hero's padding pushes its own title up and
// out of where the reader expects it - measured, 24px on the service pages.
const SIZES = {
  page: { band: 'min-h-[58vh] sm:min-h-[72vh]', pad: 'py-14 sm:py-24' },
  band: { band: 'min-h-[46vh]', pad: 'py-16' },
  sub: { band: 'min-h-[42vh]', pad: 'py-14' },
  compact: { band: 'min-h-[38vh]', pad: 'py-10' },
};

const FALLBACK = '[background:linear-gradient(150deg,var(--color-gold),#2f2b24)]';

const SCRIM =
  '[background:linear-gradient(180deg,rgba(20,20,16,0.5)_0%,rgba(20,20,16,0.34)_40%,rgba(20,20,16,0.68)_100%)] ' +
  'min-[993px]:[background:linear-gradient(100deg,rgba(20,20,16,0.62)_0%,rgba(20,20,16,0.28)_48%,rgba(20,20,16,0.05)_75%)]';

export default function Hero({
  image,
  alt = '',
  size = 'page',
  align = 'center',
  width = 'wide',
  eyebrow,
  title,
  lede,
  as = 'h1',
  titleSize = 'display',
  actions = null,
  titleClassName = 'max-w-xl',
  ledeClassName,
  className,
  innerClassName,
  children,
  below = null,
  ...rest
}) {
  return (
    <section className={cn('relative', className)} {...rest}>
      <div
        className={cn(
          'relative flex overflow-hidden',
          align === 'end' ? 'items-end' : 'items-center',
          (SIZES[size] || SIZES.page).band,
          FALLBACK,
        )}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <div className={cn('absolute inset-0', SCRIM)} />
        <Container width={width} className={cn('relative z-10', (SIZES[size] || SIZES.page).pad, innerClassName)}>
          {title ? (
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              as={as}
              size={titleSize}
              tone="dark"
              titleClassName={titleClassName}
            />
          ) : null}
          {/* The lede is rendered here rather than through SectionHeading: a
              hero subhead is BODY copy (--fs-body) while a section lede is the
              smaller --fs-small. The two had drifted apart across this site -
              the homepage ran text-body/88 and the experiences page
              text-small/85 - and one of them had to win. Body size wins: this
              is the first sentence a guest reads, not a caption. */}
          {lede ? <p className={cn('mt-4 max-w-md text-body text-white/88', ledeClassName)}>{lede}</p> : null}
          {children}
          {actions ? <div className="flex flex-wrap gap-3 mt-7">{actions}</div> : null}
        </Container>
      </div>
      {below}
    </section>
  );
}
