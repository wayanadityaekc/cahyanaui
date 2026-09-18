import CharterPrice from '@/components/CharterPrice';
import CharterSurcharge from '@/components/CharterSurcharge';
import { BTN_BOOK } from '@/components/ui/btnBookClasses';
import { PLAN_PRICE_BOX, PLAN_PRICE_KICK, PLAN_PRICE_BIG } from '@/components/ui/charterPlanClasses';
import { CHARTER_CARDS } from '@/content/shared/home';

// The homepage charter section reads as RATE ROWS, not a card slider (Sep 2026,
// Wayan: "section charter di homepage juga samain, dengan price menurun seperti di
// pagenya"). Four tall cards in a horizontal track meant three of the four rates
// were off-screen on a phone, each behind its own "Choose" button that went to the
// same page anyway. A row per rate shows all four at once and takes less height
// than one card did.
//
// The price block is the charter page's own (PLAN_PRICE_*, imported not copied):
// kicker stacked above the amount in a tinted box, dark rather than amber. Same
// component, same source, so the two cannot drift.
//
// ONE CTA for the section, to /charter.html (Wayan: "button build your charter ke
// page charternya"). The rows quote prices; the page is where a charter is
// actually built, so there is nothing for a per-row button to do that this one
// does not. no-underline comes with BTN_BOOK - it is an <a>, and Wayan asked for
// the line under it gone.
//
// Not a client component any more: with the slider gone nothing here holds state.
// CharterPrice and CharterSurcharge carry their own 'use client'.
const ROWS = 'mt-[var(--space-4)] flex flex-col gap-2 min-[769px]:grid min-[769px]:grid-cols-2 min-[769px]:gap-x-4 min-[769px]:gap-y-[0.625rem]';
// pop = the Full Day rate. Marked with the CTA border instead of a badge beside
// the name: at 320px in rupiah the price box leaves the name column barely wider
// than the name itself, and anything sharing that line wraps. The word "Popular"
// rides on the sub line, where a wrap costs nothing.
const ROW_BASE = 'flex items-center gap-3 py-[0.7rem] px-[0.875rem] rounded-md bg-white';
const ROW = `${ROW_BASE} [border:1px_solid_var(--line)]`;
// The inset ring is what makes the CTA border read as deliberate rather than as a
// 1px colour slip; it thickens the line without moving the row's box by a pixel,
// so the popular row still sits level with the others in the grid.
const ROW_POP = `${ROW_BASE} [border:1px_solid_var(--color-cta)] [box-shadow:inset_0_0_0_1px_var(--color-cta)]`;
const NAME = 'block text-h3 font-semibold text-gold';
const SUB = 'block text-[0.66rem] leading-[1.45] text-muted';

export default function CharterHome() {
  return (
    <section className="max-w-[var(--container)] my-[var(--space-5)] mx-auto px-[var(--container-x)]" id="charter-promo">
      <div className="bg-white border border-line rounded-lg shadow-md p-[var(--space-5)] max-[560px]:p-[var(--space-4)_var(--space-3)]">
        <div className="text-center mb-[var(--space-3)]">
          <span className="block uppercase tracking-[0.14em] text-label text-muted mb-[0.4rem]">One more way to explore</span>
          <h2 className="font-head text-h2 font-medium tracking-[-0.01em] mb-[0.6rem] text-gold">Charter a car for the whole day</h2>
          <p className="text-body leading-[1.6] text-ink mx-auto max-w-[60ch]">
            Private car and driver, yours for the day. Pick a length, build your own route. Petrol included, pick up
            anywhere on the island.
          </p>
        </div>

        <div className={ROWS}>
          {CHARTER_CARDS.map((c) => (
            <div className={c.pop ? ROW_POP : ROW} key={c.hours}>
              <span className="flex-1 min-w-0">
                <span className={NAME}>{c.hours}</span>
                <span className={SUB}>
                  {c.badge && <b className="font-semibold text-amber-d">{c.badge} &middot; </b>}
                  {c.label}{c.note ? ` \u00b7 ${c.note}` : ''}
                </span>
              </span>
              <span className={PLAN_PRICE_BOX}>
                <span className={PLAN_PRICE_KICK}>{c.from}</span>
                <CharterPrice duration={c.charter} extra={c.extra} fallback={c.fallback} className={PLAN_PRICE_BIG} />
              </span>
            </div>
          ))}
        </div>

        <a className={`${BTN_BOOK} block max-w-[320px] mx-auto text-center`} href="/charter.html">Build your charter</a>

        <p className="text-center mt-[var(--space-3)] text-small text-muted">
          Only a <b className="text-gold font-semibold">20% deposit</b> to book &middot; prices per car, pick-up outside Ubud <CharterSurcharge />
        </p>
      </div>
    </section>
  );
}
