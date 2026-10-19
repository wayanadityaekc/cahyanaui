import { cn } from '../lib/cn.js';

export default function AddonCard({
  image = '',
  alt = '',
  icon = null,
  title,
  text,
  meta = '',
  action = null,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-row min-[560px]:flex-col overflow-hidden bg-surface-raised [border:1px_solid_var(--line)]',
        className,
      )}
    >
      <div className="relative shrink-0 w-20 min-[560px]:w-auto min-[560px]:aspect-[4/3] bg-cream flex items-center justify-center text-gold [&>svg]:w-8 [&>svg]:h-8">
        {image ? (
          <img src={image} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          icon
        )}
      </div>
      <div className="flex flex-col flex-1 gap-1 p-4">
        <h3 className="text-h3 font-semibold text-gold m-0">{title}</h3>
        <p className="text-small leading-[1.5] text-muted m-0">{text}</p>
        <div className="mt-auto pt-3 grid gap-2">
          {meta ? <span className="text-label text-muted">{meta}</span> : null}
          {action}
        </div>
      </div>
    </div>
  );
}
