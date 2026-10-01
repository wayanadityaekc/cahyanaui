import { cn } from '../lib/cn.js';

// CUE's charter plan row (charterPlanClasses.js), read-only: name, badge and sub on the left, price on the right from 993px.
const ROW = 'flex py-[0.7rem] px-[0.875rem] rounded-md bg-white [border:1px_solid_var(--line)]';
const GRID = 'flex-1 min-w-0 grid grid-cols-1 gap-x-3 min-[993px]:grid-cols-[1fr_auto] min-[993px]:items-center';
const NAME = 'text-h3 font-semibold text-gold whitespace-nowrap';
const BADGE = 'text-label tracking-[0.1em] uppercase font-medium text-amber-d whitespace-nowrap';
const SUB = 'block mt-[2px] min-[993px]:mt-0 text-[0.66rem] leading-[1.45] text-muted min-[993px]:col-start-1 min-[993px]:row-start-2';
const PRICE_CELL = 'mt-[2px] min-[993px]:mt-0 min-[993px]:col-start-2 min-[993px]:row-start-1 min-[993px]:row-span-2 min-[993px]:self-center min-[993px]:text-right';
const PRICE = 'block text-gold font-semibold text-[1.5rem] leading-[1.15] whitespace-nowrap';

// Plan rows the site fills in; price null means "not loaded yet" and shows a dash, never a guessed number.
export default function PlanList({ plans = [], label = 'Plans', className = '' }) {
  if (!plans.length) return <p className="m-0 text-body text-muted">Sorry, we could not load this information. Please try again.</p>;
  return (
    <ul className={cn('list-none m-0 p-0 flex flex-col gap-3', className)} aria-label={label} data-plan-list>
      {plans.map(({ id, name = '', badge = '', sub = '', price = null }) => (
        <li key={id} className={ROW} data-plan={id}>
          <div className={GRID}>
            <span className="flex flex-wrap items-center gap-x-[6px] min-[993px]:col-start-1 min-[993px]:row-start-1">
              <span className={NAME}>{name}</span>
              {badge ? <span className={BADGE}>{badge}</span> : null}
            </span>
            <span className={PRICE_CELL}>
              {price == null
                ? <span className={PRICE} aria-label="Price loading" data-plan-price="">-</span>
                : <span className={PRICE} data-plan-price={price}>{price}</span>}
            </span>
            {sub ? <span className={SUB}>{sub}</span> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
