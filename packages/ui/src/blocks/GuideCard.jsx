import { cn } from '../lib/cn.js';

const DEFAULT_IMAGE_WIDTH_PX = 600;
const DEFAULT_IMAGE_HEIGHT_PX = 600;

export default function GuideCard({
  href,
  img: image,
  alt = '',
  title,
  tag,
  cat,
  w: viewportWidth = DEFAULT_IMAGE_WIDTH_PX,
  hgt = DEFAULT_IMAGE_HEIGHT_PX,
  overlayTag = false,
  linkAs: LinkAs = 'a',
  className,
}) {
  const scrim = overlayTag
    ? 'after:bg-[linear-gradient(to_bottom,transparent_25%,rgba(0,0,0,0.6))]'
    : 'after:bg-[linear-gradient(to_bottom,transparent_42%,rgba(0,0,0,0.6))]';
  const TITLE =
    'm-0 block text-white font-body text-[1rem] font-semibold leading-[1.2] text-left [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] whitespace-nowrap overflow-hidden text-ellipsis';
  return (
    <LinkAs
      href={href}
      data-cat={cat}
      className={cn(
        'relative p-[5px] overflow-hidden rounded-base bg-white no-underline text-inherit shadow-[0_1px_2px_rgba(34,32,28,0.09)] flex flex-col',
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-base bg-green after:content-[''] after:absolute after:inset-0",
          scrim,
        )}
      >
        {image ? (
          <img
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={image}
            alt={alt || title}
            width={viewportWidth}
            height={hgt}
            loading="lazy"
          />
        ) : null}
        {overlayTag ? (
          <div className="absolute left-0 right-0 bottom-0 z-[1] flex flex-col gap-[0.2rem] px-[0.9rem] pb-[0.85rem]">
            {tag ? (
              <span className="text-small font-medium text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">{tag}</span>
            ) : null}
            <h3 className={cn(TITLE, '!text-white')}>{title}</h3>
          </div>
        ) : null}
      </div>
      {!overlayTag ? (
        <div className="relative flex flex-col grow px-[0.9rem] pt-[0.6rem] pb-[0.75rem]">
          <h3 className={cn(TITLE, 'absolute left-0 right-0 bottom-full px-[0.9rem] pb-[0.85rem] !text-white')}>
            {title}
          </h3>
          {tag ? <span className="text-small font-medium text-muted">{tag}</span> : null}
        </div>
      ) : null}
    </LinkAs>
  );
}
