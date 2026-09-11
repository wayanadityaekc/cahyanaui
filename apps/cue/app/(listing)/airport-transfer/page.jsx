import AirportTransferForm from '@/components/sections/AirportTransferForm';
import { INFO_SECTION_DETAIL, INFO_CARD } from '@/components/ui/infoClasses';
import JsonLd from '@/components/JsonLd';
import Prose from '@/components/prose/Prose';
import DetailTinfo from '@/components/sections/DetailTinfo';
import { AIRPORT } from '@/content/shared/airport';
import { CHARTER_HERO, CHARTER_HERO_INNER, CHARTER_HERO_TITLE, CHARTER_HERO_SUB } from '@/components/ui/charterHeroClasses';

export const metadata = {
  title: 'Bali Airport Transfer Booking | Flight Details Form',
  description:
    'Book your private Bali airport transfer to or from Ubud. Add your flight number and time so your driver tracks delays and is ready when you land or need pickup.',
  alternates: { canonical: '/airport-transfer.html' },
};

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
      <section className="tinfo">
        <DetailTinfo facts={AIRPORT.tinfo.facts} included={AIRPORT.tinfo.included} excluded={AIRPORT.tinfo.excluded} />
      </section>
      <section className={INFO_SECTION_DETAIL}>
        <div className={INFO_CARD}>
          <Prose blocks={AIRPORT.info} />
        </div>
      </section>
    </>
  );
}
