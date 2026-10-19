import { cn } from '../lib/cn.js';
import SectionHeading from './SectionHeading.jsx';

export default function LocationBand({ eyebrow = '', title = '', text = '', action = null, image = '', alt = '', places = [], className }) {
  return (
    <div className={cn('grid gap-8 items-center min-[993px]:grid-cols-[1fr_1.2fr_1fr] min-[993px]:gap-10', className)}>
      <div className="grid gap-6 content-center">
        <SectionHeading size="section" eyebrow={eyebrow} title={title} lede={text} />
        {action ? <div>{action}</div> : null}
      </div>
      <div className="relative overflow-hidden bg-cream aspect-[4/3]">
        {image ? <img src={image} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" /> : null}
      </div>
      <ul className="list-none p-0 m-0">
        {places.map(({ label, value }) => (
          <li key={label} className="flex items-baseline justify-between gap-4 py-3 text-small [&:not(:first-child)]:[border-top:1px_solid_var(--line)]">
            <span className="text-gold">{label}</span>
            <span className="text-muted whitespace-nowrap">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
