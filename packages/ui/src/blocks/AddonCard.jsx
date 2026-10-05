import { cn } from '../lib/cn.js';

/**
 * A card for an extra a guest can add to a stay: a picture (or an icon when
 * there is no approved photo yet), a name, one line, and a place for the action.
 *
 *   image / alt   optional photograph
 *   icon          rendered node shown on a tinted tile when there is no image
 *   title, text   the name and the one line
 *   meta          small line beside the action (for example "Priced at booking")
 *   action        the button; the app passes its own so the library never
 *                 reaches into one app's cart
 */
export default function AddonCard({ image = '', alt = '', icon = null, title, text, meta = '', action = null, className }) {
  return (
    <div className={cn('flex flex-row min-[560px]:flex-col overflow-hidden rounded-lg bg-surface-raised [border:1px_solid_var(--line)]', className)}>
      <div className="relative shrink-0 w-20 min-[560px]:w-auto min-[560px]:aspect-[4/3] bg-cream flex items-center justify-center text-gold [&>svg]:w-8 [&>svg]:h-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image ? <img src={image} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" /> : icon}
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
