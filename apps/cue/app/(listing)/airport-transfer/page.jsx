import AirportTransferForm from '@/components/sections/AirportTransferForm';
import JsonLd from '@/components/JsonLd';
import Prose from '@/components/prose/Prose';
import { detailBlocks } from '@/lib/detailBlocks';
import { AIRPORT } from '@/content/shared/airport';
import FormHero from '@/components/sections/FormHero';

// SEO: this page owns "bali airport transfer" (Sep 2026, Wayan). It used to
// title itself "Booking | Flight Details Form" while /transfer led on the
// keyword - so the query landed on the page with 375 words and this one, with
// the depth AND the flight-number field that actually answers it, sat on four
// internal links. The title now leads on the phrase and /transfer names routes.
export const metadata = {
  title: 'Bali Airport Transfer to Ubud | Private Car, Fixed Price',
  description:
    'Private car between Ngurah Rai airport (DPS) and Ubud at a fixed price per car. Add your flight number so your driver tracks delays and meets you at arrivals.',
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
      <FormHero
        title={AIRPORT.title}
        sub={AIRPORT.sub}
        photo="transfer-hero.webp"
        alt="A plane reflected in the glass facade of Bali's Ngurah Rai airport terminal"
        // Centred, the tall narrow column cut "BALI International Airport" through
        // the middle of a word. This lands on the plane in the glass instead, which
        // says airport without half a sign.
        photoPos="[&>img]:object-[26%_50%]"
        details={<Prose blocks={detailBlocks('Airport Transfer Details', AIRPORT.tinfo, AIRPORT.info)} headingVariant="company" />}
      >
        <AirportTransferForm />
      </FormHero>
    </>
  );
}
