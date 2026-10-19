import { cn } from '../lib/cn.js';
import Section from './Section.jsx';
import SectionHeading from './SectionHeading.jsx';
import { MEDIA_FALLBACK } from './cardClasses.js';

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
        <div className={cn('relative overflow-hidden bg-green', ratio, !image && MEDIA_FALLBACK)}>
          {image ? <img src={image} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" /> : null}
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
