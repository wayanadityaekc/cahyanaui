import Img from '@/components/ui/Img';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { crumbsFor } from '@/lib/crumbs';
import { SUBHERO_TITLE } from '@/components/ui/subheroClasses';
import { INFO_CARD_BODY } from '@/components/ui/infoClasses';

// Shared head for charter/transfer/airport (title, sub, form, photo); 2 columns from 1200px, not 993.
const HEAD = 'bg-white pb-[var(--section-gap)] px-[var(--container-x)]';
const HEAD_TOP = 'pt-[calc(var(--header-h-max,92px)+var(--space-3))] min-[769px]:pt-[calc(var(--header-h-max,98px)+var(--space-3))]';
const INNER = 'max-w-[var(--container)] mx-auto';
const SUB = 'mt-3 mb-0 font-body text-body leading-[var(--lh-body)] text-green max-w-[var(--container-read)]';
// minmax(0,1fr) track so a wide form wraps instead of being clipped on phones.
const GRID = 'mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 min-[1200px]:gap-8 min-[1200px]:items-stretch';
// Charter and transfer split; class strings written out in full since Tailwind never generates interpolated classes.
const GRID_COLS = 'min-[1200px]:grid-cols-[2.4fr_1fr]';
// 50/50 split for /airport-transfer only; charter must keep 2.4fr or its plan rows wrap.
const GRID_COLS_HALF = 'min-[1200px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]';
// Photo is 4:3 on phones, fills the row on desktop; crop comes from photoPos (re-check if widths change).
const PHOTO =
  'relative overflow-hidden rounded-lg bg-cream aspect-[4/3] ' +
  'min-[1200px]:aspect-auto min-[1200px]:h-full min-[1200px]:min-h-0 ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover';

// Details sit in the same container as the form so edges line up; paragraphs capped at --container-read, heading left.
const DETAILS =
  `mt-[var(--section-gap)] ${INFO_CARD_BODY} [&_p]:max-w-[var(--container-read)] ` +
  '[&>h2]:!text-left';

export default function FormHero({ title, sub, photo, alt, photoPos = '[&>img]:object-center', half = false, details, children, page }) {
  return (
    <section className={`${HEAD} ${HEAD_TOP}`} data-formhero>
      <div className={INNER}>
        <Breadcrumb items={crumbsFor(page)} className="mb-2" />
        <h1 className={`${SUBHERO_TITLE} m-0 text-left`}>{title}</h1>
        <p className={SUB}>{sub}</p>
        <div className={`${GRID} ${half ? GRID_COLS_HALF : GRID_COLS}`}>
          <div className="min-w-0" data-formhero-form>{children}</div>
          <div className={`${PHOTO} ${photoPos}`} data-formhero-photo>
            {/* Above the fold, so it loads eagerly - no lazy. */}
            <Img src={`/assets/images/${photo}`} alt={alt} priority />
          </div>
        </div>
        {details && <div className={DETAILS} data-formhero-details>{details}</div>}
      </div>
    </section>
  );
}
