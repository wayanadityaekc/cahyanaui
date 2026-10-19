'use client';

import {
  PLAN_PRICE_KICK,
  PLAN_PRICE_LEAD,
  PLAN_ROW,
  PLAN_ROW_PICKED,
  PLAN_NAME,
  PLAN_SUB,
  PLAN_BADGE,
  PLAN_GRID,
  PLAN_CELL_NAME,
  PLAN_CELL_PRICE,
  PLAN_CELL_SUB,
} from '@/components/ui/charterPlanClasses';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { CHARTER } from '@/content/shared/charter';
import { withSymbol } from '@/components/Price';

const FLAG =
  'absolute -top-[9px] left-[14px] px-2 py-[2px] rounded-sm bg-cta text-white ' +
  'text-label tracking-[0.1em] uppercase font-semibold whitespace-nowrap';
const ROWS = 'flex flex-col gap-3 pt-[9px]';
const ROW_BTN =
  'w-full text-left cursor-pointer ' +
  '[transition:border-color_var(--dur)_var(--ease),box-shadow_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)]';

export function useCharterTier({ area = '' } = {}) {
  const { currency } = useTripPrefs();
  const pricing = usePricing();
  const catalog = pricing && pricing.catalog;
  const symbol = (catalog && catalog.symbol) || '$';
  const isIdr = currency === 'IDR';

  function formatAmount(amount) {
    return symbol + amount.toLocaleString(isIdr ? 'id-ID' : 'en-US');
  }
  function findCharterTier(durationKey) {
    if (!catalog) return null;
    const base = catalog.charters.find((charter) => charter.duration === durationKey);
    if (!base) return null;
    const sur = catalog.charterSurcharge;
    return base.display + (area && area !== 'Ubud' && sur ? sur.display : 0);
  }
  return { tier: findCharterTier, fmt: formatAmount };
}

export default function CharterPlans({ value, onChange, area = '', heading }) {
  const { tier, fmt: formatTierPrice } = useCharterTier({ area });

  return (
    <div>
      {heading && <h3 className="m-0 mb-[var(--space-1)] text-h3 font-semibold text-gold">{heading}</h3>}
      <div className={ROWS} role="radiogroup" aria-label="Charter length">
        {CHARTER.durations.map((duration) => {
          const tierPrice = tier(duration.dur);
          const isSelected = duration.dur === value;
          return (
            <button
              type="button"
              key={duration.dur}
              role="radio"
              aria-checked={isSelected}
              className={`${isSelected ? PLAN_ROW_PICKED : PLAN_ROW} relative items-start min-[993px]:items-center ${ROW_BTN}`}
              onClick={() => onChange(duration.dur)}
            >
              {isSelected && (
                <span className={FLAG} data-plan-flag>
                  Selected
                </span>
              )}
              <span className={PLAN_GRID} data-plan-grid>
                <span className={`${PLAN_CELL_NAME} flex flex-wrap items-center gap-x-[6px]`}>
                  <span className={`${PLAN_NAME} whitespace-nowrap`}>{duration.name}</span>
                  {duration.badge && <span className={PLAN_BADGE}>{duration.badge}</span>}
                </span>
                <span className={PLAN_CELL_PRICE}>
                  {area && <span className={`${PLAN_PRICE_KICK} block mt-[2px] min-[993px]:mt-0`}>Total</span>}
                  <span className={PLAN_PRICE_LEAD}>
                    {tierPrice == null ? '—' : withSymbol(formatTierPrice(tierPrice))}
                  </span>
                </span>
                <span className={`${PLAN_CELL_SUB} ${PLAN_SUB} mt-[2px] min-[993px]:mt-0`}>{duration.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
