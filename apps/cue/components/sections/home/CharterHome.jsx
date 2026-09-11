'use client';

import Slider from '@/components/ui/Slider';
import CharterPrice from '@/components/CharterPrice';
import CharterSurcharge from '@/components/CharterSurcharge';
import { BADGE_POPULAR } from '@/components/ui/cardClasses';
import { CHARTER_CARDS } from '@/content/shared/home';

// Tailwind-native (full-portable): keluarga `.chcard*` -> utilities inline. Data
// (CHARTER_CARDS) sekarang bawa flag `pop`/`solid` (bukan class string), di-map ke
// utilities di sini. Badge "Popular" pakai BADGE_POPULAR shared (cardClasses.js).
const CARD_BASE = 'relative flex-[0_0_220px] [scroll-snap-align:start] flex flex-col rounded-md p-[var(--space-3)] bg-white';
const chcard = (pop) => `${CARD_BASE} ${pop ? '[border:2px_solid_var(--color-cta)]' : '[border:1px_solid_var(--line)]'}`;
const BTN_BASE = 'mt-auto w-full inline-flex items-center justify-center rounded-pill h-[2.7rem] font-semibold text-strong no-underline [transition:background_var(--dur)_var(--ease),border-color_var(--dur)_var(--ease)]';
const chbtn = (solid) => `${BTN_BASE} ${solid ? 'bg-cta text-white hover:bg-cta-d' : 'bg-white text-gold [border:1px_solid_var(--line)] hover:[border-color:var(--color-gold)]'}`;

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

        <Slider gridClassName="flex gap-[var(--space-3)] overflow-x-auto overflow-y-hidden [scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] mt-[var(--space-4)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CHARTER_CARDS.map((c) => (
            <article className={chcard(c.pop)} key={c.hours}>
              {c.badge && <span className={BADGE_POPULAR}>{c.badge}</span>}
              <h3 className="font-head text-h2 font-semibold tracking-[-0.01em] mb-[0.1rem] text-gold">{c.hours}</h3>
              <p className="text-small text-muted mb-[0.8rem]">{c.label}</p>
              <p className="flex items-baseline gap-[0.3rem] mb-[0.7rem]">
                <span className="text-small text-muted">{c.from}</span>{' '}
                <CharterPrice duration={c.charter} extra={c.extra} fallback={c.fallback} className="text-[1.6rem] font-semibold text-amber tracking-[-0.01em]" />{' '}
                <span className="text-small text-muted">{c.unit}</span>
              </p>
              <p className="text-small text-muted mb-[1.1rem] leading-[1.45]">{c.note}</p>
              <a className={chbtn(c.solid)} href={c.href}>{c.btnText}</a>
            </article>
          ))}
        </Slider>

        <p className="text-center mt-[var(--space-4)] text-small text-muted">
          Only a <b className="text-gold font-semibold">10% deposit</b> to book &middot; prices per car, pick-up outside Ubud <CharterSurcharge />
        </p>
      </div>
    </section>
  );
}
