import { cn } from '../lib/cn.js';
import Container from './Container.jsx';
import SectionHeading from './SectionHeading.jsx';
import { MEDIA_FALLBACK } from './cardClasses.js';

const SIZES = {
  page: { band: 'min-h-[58vh] sm:min-h-[72vh]', pad: 'py-14 sm:py-24' },
  band: { band: 'min-h-[46vh]', pad: 'py-16' },
  sub: { band: 'min-h-[42vh]', pad: 'py-14' },
  compact: { band: 'min-h-[38vh]', pad: 'py-10' },
};

const FALLBACK = MEDIA_FALLBACK;

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
  bandClassName,
  scrimClassName,
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
          bandClassName,
        )}
      >
        {image ? (
          <img src={image} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <span aria-hidden="true" className="absolute inset-0 pointer-events-none mix-blend-multiply [background:linear-gradient(180deg,rgba(214,178,120,0.18),rgba(120,80,40,0.30))]" />
        <div className={cn('absolute inset-0', SCRIM, scrimClassName)} />
        <Container width={width} className={cn('relative z-10', (SIZES[size] || SIZES.page).pad, innerClassName)}>
          {title ? (
            <SectionHeading
              eyebrow={eyebrow}
              upper
              title={title}
              as={as}
              size={titleSize}
              tone="dark"
              titleClassName={titleClassName}
            />
          ) : null}
          {lede ? <p className={cn('mt-4 max-w-md text-body text-white/88', ledeClassName)}>{lede}</p> : null}
          {children}
          {actions ? <div className="flex flex-wrap gap-3 mt-7">{actions}</div> : null}
        </Container>
      </div>
      {below}
    </section>
  );
}
