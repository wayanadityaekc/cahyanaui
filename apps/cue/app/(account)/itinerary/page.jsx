import ItineraryBuilder from '@/components/trip/ItineraryBuilder';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Build Your Own Bali Itinerary | Cahyana Ubud Experience',
  description:
    'Combine tours, activities, performances, and transfers into a multi-day Bali trip - up to 7 days, with live pricing as you plan.',
  alternates: { canonical: '/itinerary.html' },
};

export default function Page() {
  return (
    <>
      <JsonLd page="itinerary" />
      <section className="subhero subhero--overlap">
        <div className="subhero__content">
          <h1 className="subhero__title">Build Your Own Bali Itinerary</h1>
          <p className="subhero__text">
            Combine tours, activities, performances, and transfers into your perfect multi-day trip - up to 7 days,
            with live pricing as you plan. Only a 10% deposit to book.
          </p>
        </div>
      </section>

      <section className="itn" id="itinerary">
        <h2 className="section__title">Plan Your Bali Trip Day by Day</h2>
        <p className="builder__intro">
          Add tours, activities, and transfers to build your multi-day trip - up to 7 days, with live pricing. Only a
          10% deposit to book.
        </p>
        <ItineraryBuilder />
      </section>

      <div className="modal" id="itn-pick-modal">
        <div className="modal__box modal__box--sm">
          <button className="modal__close" aria-label="Close">&times;</button>
          <h3 className="modal__title">Add to your trip</h3>
          <p className="modal__sub">Pick a category to add to your trip.</p>
          <div className="pick-cats">
            <a href="/tour.html" className="pick-cat">Tour Programs</a>
            <a href="/transfer.html" className="pick-cat">Transfers</a>
            <a href="/charter.html" className="pick-cat">Private Car Charter</a>
            <a href="/activities.html" className="pick-cat">Activities &amp; Performances</a>
          </div>
        </div>
      </div>
    </>
  );
}
