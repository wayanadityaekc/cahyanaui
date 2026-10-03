import { BTN_SM } from '../primitives/btnClasses.js';

// CUE's detail hero, split variant (guide articles): photo on the left 45%, white sheet on the right with
// crumb, title, intro, a short fact list and one CTA. On phones the sheet overlaps the photo with a rounded top.
export const SPLIT_TITLE = 'font-head text-[length:var(--fs-display)] leading-[var(--lh-heading)] text-gold font-bold tracking-[-0.01em]';
export const SPLIT_DESC = 'max-w-[460px] m-0 text-[#3d3d3d]';
export const SPLIT_CTA =
  `inline-flex mt-[1.6rem] ${BTN_SM} bg-cta text-white no-underline font-body ` +
  '[transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d [@media(max-width:768px)]:hidden';
export const SPLIT_FACTS =
  'list-none flex justify-center mt-6 mx-0 mb-0 p-0 [&>li]:flex [&>li]:flex-col [&>li]:px-4 ' +
  'min-[769px]:[&>li]:px-[22px] [&>li+li]:[border-left:1px_solid_var(--line)]';
export const SPLIT_FACT_LABEL = 'text-small font-normal tracking-[0] normal-case text-muted';
export const SPLIT_FACT_VALUE = 'mt-[0.2rem] text-small font-medium text-ink min-[769px]:text-h3 min-[769px]:whitespace-nowrap';

/**
 *   image     photo url (left side)
 *   crumb     node, a <Breadcrumb> already built by the site
 *   hooks     [{ label, value }]  the three facts
 *   cta/href  one button, hidden on phones like CUE's
 *   offsetHeader  adds the fixed header's height as top padding. Leave false when the
 *             layout's <main> already reserves it (the villa site does).
 */
export default function SplitHero({ image, crumb = null, title, desc, hooks = [], cta, href, linkAs: LinkAs = 'a', offsetHeader = false }) {
  const top = offsetHeader ? 'pt-[var(--header-h-max,92px)] min-[769px]:pt-[var(--header-h-max,98px)]' : '';
  return (
    <section className={`${top} min-[769px]:grid min-[769px]:grid-cols-[45%_55%] min-[769px]:items-stretch min-[769px]:min-h-[62vh]`}>
      <div
        className="min-h-[48vh] bg-green bg-cover bg-center min-[769px]:order-1 min-[769px]:min-h-0"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
        aria-hidden="true"
      />
      <div className="relative z-[1] -mt-7 pt-9 px-[var(--container-x)] pb-3 bg-surface-raised rounded-t-[var(--r-xl)] flex flex-col items-start text-left
        min-[769px]:mt-0 min-[769px]:pt-12 min-[769px]:pr-12 min-[769px]:pb-12 min-[769px]:pl-[max(1.5rem,calc((100vw-1280px)/2))]
        min-[769px]:bg-transparent min-[769px]:rounded-none min-[769px]:justify-center">
        {crumb}
        <h1 className={`${SPLIT_TITLE} mb-3`}>{title}</h1>
        {desc && <p className={SPLIT_DESC}>{desc}</p>}
        {hooks.length > 0 && (
          <ul className={SPLIT_FACTS}>
            {hooks.map((hook) => (
              <li key={hook.label}>
                <span className={SPLIT_FACT_LABEL}>{hook.label}</span>
                <span className={SPLIT_FACT_VALUE}>{hook.value}</span>
              </li>
            ))}
          </ul>
        )}
        {cta && <LinkAs href={href} className={SPLIT_CTA}>{cta}</LinkAs>}
      </div>
    </section>
  );
}
