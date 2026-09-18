import AirportTransferForm from '@/components/sections/AirportTransferForm';
import { INFO_SECTION_DETAIL, INFO_CARD, INFO_CARD_BODY } from '@/components/ui/infoClasses';
import JsonLd from '@/components/JsonLd';
import Prose from '@/components/prose/Prose';
import { detailBlocks } from '@/lib/detailBlocks';
import { AIRPORT } from '@/content/shared/airport';
import { CHARTER_HERO, CHARTER_HERO_INNER, CHARTER_HERO_TITLE, CHARTER_HERO_SUB } from '@/components/ui/charterHeroClasses';

export const metadata = {
  title: 'Bali Airport Transfer Booking | Flight Details Form',
  description:
    'Book your private Bali airport transfer to or from Ubud. Add your flight number and time so your driver tracks delays and is ready when you land or need pickup.',
  alternates: { canonical: '/airport-transfer.html' },
};

// SHAPE = THE CHARTER PAGE'S (Sep 2026, Wayan: "page transfer, airport dan
// charter harus identik"): hero band with the form inside, then ONE cream band
// holding ONE white card.
//
// The "Good to know" block used to be a <section className="tinfo"> between the
// two - and `.tinfo` has no rule left in style.css, so that section had ZERO
// padding. On a 390px phone its facts strip and boxes ran edge to edge at 0px
// while the same block on /transfer sat at 21px; the border was clipped by the
// screen. Folding it into the card as Prose blocks removes the loose section and
// the dead class dependency in one go.
//
// headingVariant="company" matches charter too: the card's sub-headings are
// left-aligned with no centred underline. This page was rendering the default
// 'legal' variant, so "How It Works" was centred here and left on charter.
export default function Page() {
  return (
    <>
      <JsonLd page="airport-transfer" />
      <section className={`${CHARTER_HERO} bg-[url(/assets/images/transfer-hero.webp)]`}>
        <div className={CHARTER_HERO_INNER}>
          <h1 className={CHARTER_HERO_TITLE}>{AIRPORT.title}</h1>
          <p className={CHARTER_HERO_SUB}>{AIRPORT.sub}</p>
          <AirportTransferForm />
        </div>
      </section>
      <section className={INFO_SECTION_DETAIL}>
        <div className={`${INFO_CARD} ${INFO_CARD_BODY}`}>
          <Prose blocks={detailBlocks('Airport Transfer Details', AIRPORT.tinfo, AIRPORT.info)} headingVariant="company" />
        </div>
      </section>
    </>
  );
}
