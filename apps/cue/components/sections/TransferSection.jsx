import TransferPicker from '@/components/sections/TransferPicker';
import TransferRoutes from '@/components/sections/TransferRoutes';
import TransferRouteProvider from '@/components/sections/TransferRouteProvider';
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
//
// The provider wraps both sections because the routes in the card drive the
// form in the hero (see TransferRouteProvider). It renders no element, so this
// stays a server component and only the two interactive pieces ship JS.
export default function TransferSection() {
  return (
    <TransferRouteProvider>
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
              is hero + one card, the same as charter and airport. */}
          <TransferRoutes />

          <Prose blocks={detailBlocks('Transfer Details', TRANSFER.tinfo)} headingVariant="company" />
        </div>
      </section>
    </TransferRouteProvider>
  );
}
