import AirportTransferForm from '@/components/sections/AirportTransferForm';
import JsonLd from '@/components/JsonLd';
import { AIRPORT } from '@/content/shared/airport';

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
      <section className="charter-hero" style={{ backgroundImage: 'url(/assets/images/transfer-hero.webp)' }}>
        <div className="charter-hero__inner">
          <h1 className="charter-hero__title">{AIRPORT.title}</h1>
          <p className="charter-hero__sub">{AIRPORT.sub}</p>
          <AirportTransferForm />
        </div>
      </section>
      <section className="tinfo" dangerouslySetInnerHTML={{ __html: AIRPORT.tinfoHtml }} />
      <section className="info" dangerouslySetInnerHTML={{ __html: AIRPORT.infoHtml }} />
    </>
  );
}
