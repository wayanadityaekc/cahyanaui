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

// The charter plan list, on its own so BOTH places render the very same control
// (Wayan, Sep 2026: "reuse komponen bro, gimanapun styling dan structure di page
// charter pakai itu juga di section homepage, berarti lu harus pisah input form
// dan card nya"). The charter page pairs it with the trip fields; the homepage
// shows it alone with a button through to the page.
//
// It takes the chosen plan as a prop rather than owning it: the page needs the
// same value for its summary line and its Book button, and the homepage needs to
// save it. One owner, no second copy of the truth.

// The chosen plan is marked by a small tab straddling its top edge (Wayan, Sep
// 2026, picking option C from the indicator sheet). No circle, no control shape:
// it says the state in a word instead of borrowing the look of a radio button,
// and only one row carries it, so the list stays quiet.
//
// It sits OUTSIDE the row's box (-top), so the list needs headroom above it and a
// gap between rows wide enough for the tab to land in - see ROWS below.
const FLAG =
  'absolute -top-[9px] left-[14px] px-2 py-[2px] rounded-pill bg-cta text-white ' +
  'text-label tracking-[0.1em] uppercase font-semibold whitespace-nowrap';
// pt: room for the first row's tab under the heading. gap-3: the tab drops into
// the space between two rows instead of sitting on the row above.
const ROWS = 'flex flex-col gap-3 pt-[9px]';
// The rows are buttons, so they need what a button does not inherit: full width,
// left-aligned text, a pointer, and a transition that names `scale` so the
// site-wide press feedback stays smooth instead of snapping.
const ROW_BTN =
  'w-full text-left cursor-pointer ' +
  '[transition:border-color_var(--dur)_var(--ease),box-shadow_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)]';

// Both the list and the page's own summary/Book gate need this number, so it is
// read in one place and the page imports it.
//
// NOTHING IS COMPUTED HERE ANY MORE (Sep 2026). Every length the site sells -
// half, full, and the 12-hour block that replaced "Extended" - is its own tier in
// the catalog, so this looks one up instead of adding hours onto a shorter one.
// The old version added `extra` x charterExtraHour on top of "full", which meant
// the page and the server each did the arithmetic and could land a rounding step
// apart (57 + 2x4 = 65 against the server's ceil(1120000/17600) = 64).
//
// The pick-up surcharge comes from the catalog too. It used to be written here as
// `isIdr ? 100000 : 7`: the 7 had drifted from the real 6, and a guest paying in
// AUD, EUR or GBP had 7 of THEIR currency added to an already-converted price.
export function useCharterTier({ area = '' } = {}) {
  const { currency } = useTripPrefs();
  const pricing = usePricing();
  const catalog = pricing && pricing.catalog;
  const symbol = (catalog && catalog.symbol) || '$';
  const isIdr = currency === 'IDR';

  const fmt = (n) => symbol + n.toLocaleString(isIdr ? 'id-ID' : 'en-US');
  const tier = (d) => {
    if (!catalog) return null;
    const base = catalog.charters.find((c) => c.duration === d);
    if (!base) return null;
    const sur = catalog.charterSurcharge;
    return base.display + (area && area !== 'Ubud' && sur ? sur.display : 0);
  };
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
          const on = d.dur === value;
          return (
            <button
              type="button"
              key={d.dur}
              role="radio"
              aria-checked={on}
              className={`${on ? PLAN_ROW_PICKED : PLAN_ROW} relative items-start min-[993px]:items-center ${ROW_BTN}`}
              onClick={() => onChange(d.dur)}
            >
              {on && <span className={FLAG} data-plan-flag>Selected</span>}
              {/* One DOM order, two arrangements (Wayan, Sep 2026: "di desktop
                  jelek bro, harga bagusnya di kanan card"). On a phone the three
                  blocks stack in source order - name, price, sub - which is the
                  card option he picked. From 993px the grid puts the price in a
                  second column spanning both rows, so it sits right-aligned
                  against the name and the sub line, where a wide row has the
                  space for it. A grid rather than reordered flex children: it
                  moves the price without splitting the name from its sub line. */}
              <span className={PLAN_GRID} data-plan-grid>
                {/* flex-wrap, and the name itself never wraps. At 320px in rupiah
                    "Full Day POPULAR" broke the NAME across two lines - measured,
                    the same bug the old cards had with an inline badge. */}
                <span className={`${PLAN_CELL_NAME} flex flex-wrap items-center gap-x-[6px]`}>
                  <span className={`${PLAN_NAME} whitespace-nowrap`}>{d.name}</span>
                  {d.badge && <span className={PLAN_BADGE}>{d.badge}</span>}
                </span>
                <span className={PLAN_CELL_PRICE}>
                  {/* No "From" over the number (Wayan, Sep 2026: "hapus from di atas
                      harga itu bro"). The word only appears once it has something to
                      say: tier() adds the area surcharge, so once a pick-up area is
                      chosen the figure really is the total, and the page says so. Before that - and on the homepage, which has no
                      pick-up field at all - the number stands on its own. */}
                  {area && <span className={`${PLAN_PRICE_KICK} block mt-[2px] min-[993px]:mt-0`}>Total</span>}
                  {/* No invented number while the catalog is still in flight: the
                      old card printed the word "from" with nothing after it. */}
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
