import { cn } from '../lib/cn.js';
import { BTN_SM } from '../primitives/btnClasses.js';

const SCRIM =
  'absolute inset-0 [background:linear-gradient(to_top,rgba(34,32,28,0.93)_0%,rgba(34,32,28,0.86)_22%,rgba(34,32,28,0.55)_44%,rgba(34,32,28,0.10)_70%,rgba(34,32,28,0.34)_100%)]';

const FLAG =
  'absolute top-4 left-4 z-[2] inline-flex items-center gap-2 py-2 px-3.5 rounded-sm ' +
  '[background:linear-gradient(105deg,var(--color-amber-d),var(--color-amber))] ' +
  'text-white text-small font-semibold [text-shadow:0_1px_1px_rgba(0,0,0,0.18)]';

const SAVE =
  'absolute top-4 right-4 z-[3] grid place-items-center w-9 h-9 rounded-base bg-white ' +
  'cursor-pointer [transition:color_var(--dur)_var(--ease),background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';
const SAVE_ON = 'text-amber [&_svg]:fill-current';
const SAVE_OFF = 'text-gold';

const CTA =
  `inline-flex ${BTN_SM} gap-2 bg-surface-raised text-gold ` +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] group-hover:bg-cream';

export default function VillaCard({
  villa,
  place,
  price,
  unit = '/ night',
  fromLabel = 'From',
  facts = [],
  saveIcon = null,
  onSave = null,
  saved = false,
  href,
  linkAs: Link = 'a',
  cta = 'View details',
  ctaIcon = null,
  className,
}) {
  return (
    <div
      className={cn(
        'group relative isolate overflow-hidden bg-gold min-h-[27rem] min-[560px]:min-h-[30rem]',
        className,
      )}
    >
      <img
        src={villa.cardImg}
        alt={`${villa.name} private pool and garden`}
        width={1200}
        height={900}
        className="absolute inset-0 -z-[1] w-full h-full object-cover [transition:scale_var(--dur-slow)_var(--ease)]"
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

      {saveIcon ? (
        <button
          type="button"
          className={cn(SAVE, saved ? SAVE_ON : SAVE_OFF)}
          aria-pressed={saved}
          aria-label={`Save ${villa.name}`}
          onClick={onSave || undefined}
        >
          {saveIcon}
        </button>
      ) : null}

      <Link
        href={href || `/villas/${villa.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={`${villa.name} - view details`}
      >
        <span className="sr-only">{villa.name}</span>
      </Link>

      <div className="relative z-[2] pointer-events-none flex flex-col justify-end h-full min-h-[inherit] p-5 min-[560px]:p-7">
        {place ? (
          <p className="flex items-center gap-3 m-0 mb-2 text-small font-medium text-white/85">
            {place}
            <span className="h-px flex-1 max-w-[6.5rem] bg-white/40" aria-hidden="true" />
          </p>
        ) : null}

        <h3 className="font-semibold text-white leading-[1.05] [letter-spacing:-0.01em] text-[1.75rem] min-[560px]:text-[2.15rem]">
          {villa.name}
        </h3>

        {villa.shortDesc ? (
          <p className="mt-2 max-w-[30rem] text-small text-white/85 leading-[1.5]">{villa.shortDesc}</p>
        ) : null}

        <div className="mt-5 flex flex-col gap-4 min-[560px]:flex-row min-[560px]:items-end min-[560px]:justify-between min-[560px]:gap-6">
          {facts.length ? (
            <ul className="list-none flex items-center gap-x-2 min-[560px]:gap-x-4 m-0 p-0 text-label min-[560px]:text-small text-white/90 [&_svg]:w-3.5 [&_svg]:h-3.5 min-[560px]:[&_svg]:w-[var(--icon-md)] min-[560px]:[&_svg]:h-[var(--icon-md)]">
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
                    {f.short ? <span className="block whitespace-nowrap min-[560px]:hidden">{f.short}</span> : null}
                    <span
                      className={f.short ? 'max-[559px]:hidden' : undefined}
                      aria-hidden={f.short ? 'true' : undefined}
                    >
                      {(f.lines || [f.label]).map((l) => (
                        <span key={l} className="block whitespace-nowrap">
                          {l}
                        </span>
                      ))}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}

          <div className="flex items-center justify-between gap-4 min-[560px]:flex-col min-[560px]:items-end min-[560px]:gap-3">
            {price ? (
              <p className="m-0 text-left min-[560px]:text-right leading-none">
                <span className="block text-label text-white/75 mb-1">{fromLabel}</span>
                <span className="font-semibold text-[1.75rem] text-amber">{price}</span>
                <span className="ml-1.5 text-small text-white/80">{unit}</span>
              </p>
            ) : (
              <span />
            )}

            <Link
              href={href || `/villas/${villa.slug}`}
              className={cn(CTA, 'pointer-events-auto')}
              tabIndex={-1}
              aria-hidden="true"
            >
              {cta}
              {ctaIcon}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
