import TransferPicker from '@/components/sections/TransferPicker';
import { SECTION_TITLE } from '@/components/ui/sectionTitle';
import Price from '@/components/Price';
import Prose from '@/components/prose/Prose';
import { INFO_SECTION_DETAIL, INFO_CARD, INFO_CARD_BODY } from '@/components/ui/infoClasses';
import { CHARTER_HERO, CHARTER_HERO_INNER, CHARTER_HERO_TITLE, CHARTER_HERO_SUB } from '@/components/ui/charterHeroClasses';
import { detailBlocks } from '@/lib/detailBlocks';
import { TRANSFER } from '@/content/shared/transfer';

// The transfer page body (hero + picker form + routes + details), extracted so
// both the /transfer route and the All Programs "Transfer" tab render the real
// interactive form instead of static cards.
//
// SHAPE = THE CHARTER PAGE'S (Sep 2026, Wayan: "selaraskan styling layout sama
// charter bro, page transfer, airport dan charter harus identik"). Hero band with
// the form inside, then ONE cream band holding ONE white card - nothing loose on
// the page background any more.
//
// What that replaced, and why each piece had to go:
//   - a hand-written hero (min-h 560, inner 560, overlay .45/.55) beside charter's
//     (620 / 600 / .5/.64) on the SAME photo. Now the shared CHARTER_HERO strings,
//     so the two bands cannot drift again.
//   - max-w-[960px] on the routes and max-w-[820px] on the info block. Neither is
//     one of the four container tokens; the card's --container-mid is.
//   - px-[1.3rem] (20.8px) gutters, which match neither the 24px desktop nor the
//     16px mobile --container-x. The card carries the gutter now.
//   - a loose "Good to know" section: its facts strip and included/excluded pair
//     are blocks inside the card, built by detailBlocks() so airport gets the
//     same three in the same order.
export default function TransferSection() {
  return (
    <>
      <section className={`${CHARTER_HERO} bg-[url(/assets/images/transfer-hero.webp)]`}>
        <div className={CHARTER_HERO_INNER}>
          <h1 className={CHARTER_HERO_TITLE}>{TRANSFER.title}</h1>
          <p className={CHARTER_HERO_SUB}>{TRANSFER.desc}</p>
          <TransferPicker />
        </div>
      </section>

      <section className={INFO_SECTION_DETAIL}>
        <div className={`${INFO_CARD} ${INFO_CARD_BODY}`}>
          {/* Routes stay page markup, not a Prose block: they are priced, tappable
              controls, not reading content. They sit inside the card so the page
              is hero + one card, the same as charter and airport.
              The button markup is UNCHANGED on purpose - these six have no click
              handler (this file is not a client component), which is a real bug
              but a behaviour one. It is Wayan's to decide, and it does not belong
              in a layout change. */}
          <h2 className={SECTION_TITLE}>{TRANSFER.routesTitle}</h2>
          <p className="text-center text-muted text-[0.8rem] mt-[0.2rem] mb-[1.4rem]">{TRANSFER.routesNote}</p>
          <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-[0.6rem] mb-[var(--space-5)]">
            {TRANSFER.routes.map((r) => (
              <button type="button" className="flex items-center gap-3 border border-line rounded-md py-[0.55rem] px-[0.85rem] bg-white cursor-pointer text-left font-body w-full transition-[border-color,scale] duration-[0.15s] hover:border-gold" key={r.key}>
                <span className="w-[46px] h-[46px] rounded-md bg-cover bg-center shrink-0" style={{ backgroundImage: `url(/assets/images/${r.bg})` }} />
                <span className="flex flex-col">
                  <span className="font-semibold text-green text-h3">{r.name}</span>
                  <span className="text-muted text-small mt-[0.1rem]">{r.meta}</span>
                </span>
                <Price name={r.priceName} fallback={r.priceFallback} className="ml-auto text-amber font-semibold" />
              </button>
            ))}
          </div>

          <Prose blocks={detailBlocks('Transfer Details', TRANSFER.tinfo)} headingVariant="company" />
        </div>
      </section>
    </>
  );
}
