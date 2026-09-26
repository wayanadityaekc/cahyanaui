import { cn } from '../lib/cn.js';

/**
 * A villa, as a card - Wayan's mock, Sep 2026: one photograph, everything
 * written ON it, a gold "Most Popular" flag top-left, a save heart top-right,
 * and a bottom row that pairs the facts with the price and the CTA.
 *
 * WHY IT IS AN OVERLAY AND NOT A WHITE CARD. Two villas is not a catalogue to
 * scan, it is a choice between two places, and the photograph is the argument.
 * A white body under the picture makes the words compete with it; laid over a
 * scrim they read as a caption to the thing being sold.
 *
 * HEIGHT COMES FROM THE CONTENT, not from an aspect ratio. A fixed ratio card
 * at 390px is ~290px tall and the title, the blurb, three facts, the price and
 * a button do not fit in it - they either overflow or get clipped, and which
 * one you get depends on the guest's font size. So the photo is an absolutely
 * positioned layer and the content sets the height, with a min-height to stop
 * a short card looking like a banner.
 *
 * THIS IS SITE-SPECIFIC AND IT STILL LIVES IN THE LIBRARY - that is the rule.
 * What the library must NOT hold is the villas themselves, the icon set, or
 * anything that needs a provider. So:
 *
 *   villa     { slug, name, badge, cardImg, shortDesc }
 *   place     the line above the name ("Ubud, Bali")
 *   price     the already-formatted string - the currency hook lives in the
 *             app's provider tree, and a library component that reaches for it
 *             can only ever be rendered inside that one app
 *   facts     [{ icon, label }] - which facts matter is editorial, and the
 *             icons are nodes so the library takes no dependency on Lucide
 *   saveIcon  the heart. Passed in for the same reason; omit it and the
 *             control is not drawn at all, which is the honest state until
 *             there is somewhere for a saved villa to go.
 */

// The scrim. Two stops rather than a flat wash: the words sit in the bottom
// third, so that is where the darkness belongs - a full-card overlay just
// makes the photograph muddy. The top stop exists for the badge and heart.
const SCRIM =
  'absolute inset-0 [background:linear-gradient(to_top,rgba(12,11,9,0.93)_0%,rgba(12,11,9,0.86)_22%,rgba(12,11,9,0.55)_44%,rgba(12,11,9,0.10)_70%,rgba(12,11,9,0.34)_100%)]';

// Real gold here, not the soft black the palette calls "gold" - a badge is one
// of the three jobs --color-amber exists for, and on a photograph it has to
// carry its own light.
const FLAG =
  'absolute top-4 left-4 z-[2] inline-flex items-center gap-2 py-2 px-3.5 rounded-sm ' +
  '[background:linear-gradient(105deg,var(--color-amber-d),var(--color-amber))] ' +
  'text-white text-small font-semibold [text-shadow:0_1px_1px_rgba(0,0,0,0.18)]';

const SAVE =
  'absolute top-4 right-4 z-[3] grid place-items-center w-9 h-9 rounded-[50%] bg-white text-gold ' +
  'shadow-md cursor-pointer [transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';

const CTA =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap h-[2.6rem] px-5 rounded-sm ' +
  'bg-cta text-white text-strong font-semibold leading-none ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] group-hover:bg-cta-d';

export default function VillaCard({
  villa,
  place,
  price,
  unit = '/ night',
  fromLabel = 'From',
  facts = [],
  saveIcon = null,
  onSave = null,
  href,
  linkAs: Link = 'a',
  cta = 'View details',
  ctaIcon = null,
  className,
}) {
  return (
    <div className={cn('group relative isolate overflow-hidden rounded-lg bg-gold min-h-[27rem] min-[560px]:min-h-[30rem]', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={villa.cardImg}
        alt={`${villa.name} private pool and garden`}
        width={1200}
        height={900}
        className="absolute inset-0 -z-[1] w-full h-full object-cover [transition:scale_var(--dur-slow)_var(--ease)] group-hover:scale-[1.04]"
      />
      <div className={SCRIM} aria-hidden="true" />

      {villa.badge ? (
        <span className={FLAG}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 flex-none" fill="currentColor" aria-hidden="true">
            <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95L12 2.6z" />
          </svg>
          {villa.badge}
        </span>
      ) : null}

      {/* The heart sits OUTSIDE the link, not inside it: a button nested in an
          anchor is invalid HTML, and browsers resolve it by guessing - usually
          by following the link the moment the guest tries to save. */}
      {saveIcon ? (
        <button type="button" className={SAVE} aria-label={`Save ${villa.name}`} onClick={onSave || undefined}>
          {saveIcon}
        </button>
      ) : null}

      {/* The whole photograph is the link, and it sits UNDER the bottom row so
          the CTA and the heart stay their own targets. `after` rather than a
          wrapper: a link wrapping the content would make every word inside it
          part of one enormous accessible name. */}
      <Link
        href={href || `/villas/${villa.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={`${villa.name} - view details`}
      >
        <span className="sr-only">{villa.name}</span>
      </Link>

      <div className="relative z-[2] pointer-events-none flex flex-col justify-end h-full min-h-[inherit] p-5 min-[560px]:p-7">
        {place ? (
          <p className="flex items-center gap-3 m-0 mb-2 text-label font-medium tracking-[0.18em] uppercase text-white/85">
            {place}
            <span className="h-px flex-1 max-w-[6.5rem] bg-white/40" aria-hidden="true" />
          </p>
        ) : null}

        <h3 className="font-serif font-medium text-white leading-[1.05] [letter-spacing:-0.01em] text-[1.75rem] min-[560px]:text-[2.15rem]">
          {villa.name}
        </h3>

        {villa.shortDesc ? (
          <p className="mt-2 max-w-[30rem] text-small text-white/85 leading-[1.5]">{villa.shortDesc}</p>
        ) : null}

        {/* Facts left, money right - one row where there is room, stacked where
            there is not. The break is at 560px because below it the three
            facts alone already fill the width. */}
        <div className="mt-5 flex flex-col gap-4 min-[560px]:flex-row min-[560px]:items-end min-[560px]:justify-between min-[560px]:gap-6">
          {/* TWO LINES PER FACT, which is the mock's own trick and the only
              reason three facts and a price fit across one card: "Up to 6
              guests" on one line measures 104px, and three of those plus
              their dividers wrapped onto a second row inside a 570px card.
              Split, each fact is about 70px. A fact given one line still
              renders as one line. */}
          {facts.length ? (
            <ul className="list-none flex items-center gap-x-2 min-[560px]:gap-x-4 m-0 p-0 text-small text-white/90 [&_svg]:w-[var(--icon-sm)] [&_svg]:h-[var(--icon-sm)] min-[560px]:[&_svg]:w-[var(--icon-md)] min-[560px]:[&_svg]:h-[var(--icon-md)]">
              {facts.map((f, i) => (
                <li
                  key={f.label}
                  className={cn(
                    'flex items-center gap-1.5 min-[560px]:gap-2',
                    i > 0 && 'pl-2 min-[560px]:pl-4 [border-left:1px_solid_rgba(255,255,255,0.28)]',
                  )}
                >
                  {f.icon}
                  <span className="leading-[1.25]">
                    {(f.lines || [f.label]).map((l) => (
                      <span key={l} className="block whitespace-nowrap">{l}</span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          ) : <span />}

          <div className="flex items-center justify-between gap-4 min-[560px]:flex-col min-[560px]:items-end min-[560px]:gap-3">
            {price ? (
              <p className="m-0 text-left min-[560px]:text-right leading-none">
                <span className="block text-label text-white/75 mb-1">{fromLabel}</span>
                <span className="font-serif font-semibold text-[1.9rem] text-amber">{price}</span>
                <span className="ml-1.5 text-small text-white/80">{unit}</span>
              </p>
            ) : <span />}

            {/* pointer-events come back on for the one control the guest is
                meant to hit, since the whole block above is transparent to
                clicks so the photo-wide link underneath still works. */}
            <Link href={href || `/villas/${villa.slug}`} className={cn(CTA, 'pointer-events-auto')} tabIndex={-1} aria-hidden="true">
              {cta}
              {ctaIcon}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
