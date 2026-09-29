'use client';

import {
  PLAN_PRICE_KICK, PLAN_PRICE_LEAD,
  PLAN_ROW, PLAN_ROW_PICKED, PLAN_NAME, PLAN_SUB, PLAN_BADGE,
  PLAN_GRID, PLAN_CELL_NAME, PLAN_CELL_PRICE, PLAN_CELL_SUB,
} from '@/components/ui/charterPlanClasses';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { CHARTER } from '@/content/shared/charter';
import { withSymbol } from '@/components/Price';

// Charter plan list shared by the charter page and homepage; the chosen plan is a prop, owned by the caller.

// 'Selected' tab on the chosen row sits outside the box (-top), so ROWS needs matching headroom and gap.
const FLAG =
  'absolute -top-[9px] left-[14px] px-2 py-[2px] rounded-sm bg-cta text-white ' +
  'text-label tracking-[0.1em] uppercase font-semibold whitespace-nowrap';
// pt makes room for the first row's tab; gap-3 lets the tab land between rows. Change with FLAG's offset.
const ROWS = 'flex flex-col gap-3 pt-[9px]';
// Rows are buttons: full width, left text, pointer, and a transition that names scale for press feedback.
const ROW_BTN =
  'w-full text-left cursor-pointer ' +
  '[transition:border-color_var(--dur)_var(--ease),box-shadow_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)]';

// Charter price per tier looked up from the catalog (incl. pick-up surcharge); never compute or hardcode it here.
export function useCharterTier({ area = '' } = {}) {
  const { currency } = useTripPrefs();
  const pricing = usePricing();
  const catalog = pricing && pricing.catalog;
  const symbol = (catalog && catalog.symbol) || '$';
  const isIdr = currency === 'IDR';

  function fmt(n) { return symbol + n.toLocaleString(isIdr ? 'id-ID' : 'en-US'); }
  function tier(d) {
    if (!catalog) return null;
    const base = catalog.charters.find((c) => c.duration === d);
    if (!base) return null;
    const sur = catalog.charterSurcharge;
    return base.display + (area && area !== 'Ubud' && sur ? sur.display : 0);
  }
  return { tier, fmt };
}

export default function CharterPlans({ value, onChange, area = '', heading }) {
  const { tier, fmt } = useCharterTier({ area });

  return (
    <div>
      {heading && <h3 className="m-0 mb-[var(--space-1)] text-h3 font-semibold text-gold">{heading}</h3>}
      <div className={ROWS} role="radiogroup" aria-label="Charter length">
        {CHARTER.durations.map((d) => {
          const v = tier(d.dur);
          const selected = d.dur === value;
          return (
            <button
              type="button"
              key={d.dur}
              role="radio"
              aria-checked={selected}
              className={`${selected ? PLAN_ROW_PICKED : PLAN_ROW} relative items-start min-[993px]:items-center ${ROW_BTN}`}
              onClick={() => onChange(d.dur)}
            >
              {selected && <span className={FLAG} data-plan-flag>Selected</span>}
              {/* One DOM order: phone stacks name, price, sub; from 993px the grid puts the price in a right column. */}
              <span className={PLAN_GRID} data-plan-grid>
                {/* Name never wraps; the badge wraps to the next line instead (narrow rupiah prices at 320px). */}
                <span className={`${PLAN_CELL_NAME} flex flex-wrap items-center gap-x-[6px]`}>
                  <span className={`${PLAN_NAME} whitespace-nowrap`}>{d.name}</span>
                  {d.badge && <span className={PLAN_BADGE}>{d.badge}</span>}
                </span>
                <span className={PLAN_CELL_PRICE}>
                  {/* 'Total' kicker only once a pick-up area is set (then the figure includes the surcharge); no 'From'. */}
                  {area && <span className={`${PLAN_PRICE_KICK} block mt-[2px] min-[993px]:mt-0`}>Total</span>}
                  {/* Dash, not an invented number, while the catalog is still loading. */}
                  <span className={PLAN_PRICE_LEAD}>{v == null ? '—' : withSymbol(fmt(v))}</span>
                </span>
                <span className={`${PLAN_CELL_SUB} ${PLAN_SUB} mt-[2px] min-[993px]:mt-0`}>{d.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
