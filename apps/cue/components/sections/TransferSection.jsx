import TransferPicker from '@/components/sections/TransferPicker';
import TransferRoutes from '@/components/sections/TransferRoutes';
import TransferRouteProvider from '@/components/sections/TransferRouteProvider';
import Prose from '@/components/prose/Prose';
import { INFO_SECTION_DETAIL, INFO_CARD, INFO_CARD_BODY } from '@/components/ui/infoClasses';
import FormHero from '@/components/sections/FormHero';
import { detailBlocks } from '@/lib/detailBlocks';
import { TRANSFER } from '@/content/shared/transfer';

// The transfer page body (hero + picker form + routes + details), extracted so
// both the /transfer route and the All Programs "Transfer" tab render the real
// interactive form instead of static cards.
//
// SHAPE = THE SAME AS CHARTER AND AIRPORT (Sep 2026, Wayan: "selaraskan styling
// layout sama charter bro, page transfer, airport dan charter harus identik").
// All three are now <FormHero> (title, sub, form, photo) followed by ONE cream
// band holding ONE white card - nothing loose on the page background.
//
// The three used to share class strings for a dark photo band with the form on
// top of it; that band is gone (see FormHero for why) and so are the strings.
// Sharing a COMPONENT is stronger anyway: what has to match is the order of the
// four pieces, and an order cannot be enforced by a class string.
//
// What the shared shell replaced here, and why each piece had to go:
//   - a hand-written hero (min-h 560, inner 560, overlay .45/.55) beside
//     charter's (620 / 600 / .5/.64) on the SAME photo.
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
export default function TransferSection({ embedded }) {
  return (
    <TransferRouteProvider>
      {/* NOT transfer-hero.webp any more. That photo is a terminal facade with
          "BALI International Airport" written across it in readable type. It was
          survivable while it sat darkened behind white text; as a clear panel it
          puts the exact phrase this page was deliberately made to STOP competing
          for (Sep 2026 SEO split: /airport-transfer owns "bali airport transfer",
          /transfer owns the routes) back on the page as a picture. A coastal road
          says "private car across Bali", which is what the page sells. */}
      <FormHero
        title={TRANSFER.title}
        sub={TRANSFER.desc}
        photo="coastal-road-beach-bali.webp"
        alt="A coastal road running along a beach on the south Bali cliffs"
        embedded={embedded}
      >
        <TransferPicker />
      </FormHero>

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
