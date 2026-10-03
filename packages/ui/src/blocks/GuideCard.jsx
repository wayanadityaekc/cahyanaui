import { cn } from '../lib/cn.js';

// Ported 1:1 from CUE's GuideCard: square photo, title over a bottom gradient, tag below (or overlaid on the photo).
export default function GuideCard({
  href,
  img,
  alt = '',
  title,
  tag,
  cat,
  w = 600,
  hgt = 600,
  overlayTag = false,
  linkAs: LinkAs = 'a',
  className,
}) {
  const scrim = overlayTag
    ? "after:bg-[linear-gradient(to_bottom,transparent_25%,rgba(0,0,0,0.6))]"
    : "after:bg-[linear-gradient(to_bottom,transparent_42%,rgba(0,0,0,0.6))]";
  const TITLE = 'm-0 block text-white font-body text-[1rem] font-semibold leading-[1.2] text-left [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] whitespace-nowrap overflow-hidden text-ellipsis';
  return (
    <LinkAs
      href={href}
      data-cat={cat}
      className={cn('relative rounded-lg p-[5px] overflow-hidden bg-white no-underline text-inherit shadow-[0_1px_2px_rgba(34,32,28,0.09)] flex flex-col', className)}
    >
      <div className={cn("relative aspect-square rounded-md overflow-hidden bg-green after:content-[''] after:absolute after:inset-0", scrim)}>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="absolute inset-0 w-full h-full object-cover object-center" src={img} alt={alt || title} width={w} height={hgt} loading="lazy" />
        ) : null}
        {overlayTag ? (
          <div className="absolute left-0 right-0 bottom-0 z-[1] flex flex-col gap-[0.2rem] px-[0.9rem] pb-[0.85rem]">
            {tag ? <span className="text-label font-medium tracking-[0.14em] uppercase text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">{tag}</span> : null}
            <h3 className={cn(TITLE, '!text-white')}>{title}</h3>
          </div>
        ) : null}
      </div>
      {!overlayTag ? (
        <div className="relative flex flex-col grow px-[0.9rem] pt-[0.6rem] pb-[0.75rem]">
          <h3 className={cn(TITLE, 'absolute left-0 right-0 bottom-full px-[0.9rem] pb-[0.85rem] !text-white')}>{title}</h3>
          {tag ? <span className="text-label font-medium tracking-[0.14em] uppercase text-muted">{tag}</span> : null}
        </div>
      ) : null}
    </LinkAs>
  );
}
