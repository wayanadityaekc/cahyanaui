import ServiceReviews from '@/components/reviews/ServiceReviews';
import { AIRPORT_ROUTE } from '@/content/shared/timeSlots';
import AirportTransferForm from '@/components/sections/AirportTransferForm';
import JsonLd from '@/components/JsonLd';
import Prose from '@/components/prose/Prose';
import { detailBlocks } from '@/lib/detailBlocks';
import { AIRPORT } from '@/content/shared/airport';
import FormHero from '@/components/sections/FormHero';

export const metadata = {
  title: 'Bali Airport Transfer to Ubud | Private Car, Fixed Price',
  description:
    'Private car between Ngurah Rai airport (DPS) and Ubud at a fixed price per car. Add your flight number so your driver tracks delays and meets you at arrivals.',
  alternates: { canonical: '/airport-transfer.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="airport-transfer" />
      <FormHero
        page="airport-transfer"
        title={AIRPORT.title}
        sub={AIRPORT.sub}
        photo="transfer-hero.webp"
        alt="A plane reflected in the glass facade of Bali's Ngurah Rai airport terminal"
        photoPos="[&>img]:object-[80%_50%]"
        half
        details={
          <Prose
            blocks={detailBlocks('Airport Transfer Details', AIRPORT.tinfo, AIRPORT.info)}
            headingVariant="company"
          />
        }
      >
        <AirportTransferForm />
      </FormHero>
      <ServiceReviews
        service={AIRPORT_ROUTE}
        title="What guests say about our airport transfers"
        emptyText="No airport transfer reviews yet - be the first to tell other travellers how your pickup went."
      />
    </>
  );
}
