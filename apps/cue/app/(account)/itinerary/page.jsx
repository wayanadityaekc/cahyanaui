import ItineraryBuilder from '@/components/trip/ItineraryBuilder';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { SUBHERO_OVERLAP, SUBHERO_OVERLAP_NEXT, SUBHERO_CONTENT, SUBHERO_TITLE, SUBHERO_TEXT } from '@/components/ui/subheroClasses';
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
      <section className={SUBHERO_OVERLAP}>
        <div className={SUBHERO_CONTENT}>
          <h1 className={SUBHERO_TITLE}>Build Your Own Bali Itinerary</h1>
          <p className={SUBHERO_TEXT}>
            Combine tours, activities, performances, and transfers into your perfect multi-day trip - up to 7 days,
            with live pricing as you plan. Only a 10% deposit to book.
          </p>
        </div>
      </section>

      <section className={`${SUBHERO_OVERLAP_NEXT} py-12 px-6`} id="itinerary">
        <h2 className={SECTION_TITLE}>Plan Your Bali Trip Day by Day</h2>
        <p className="max-w-[640px] mt-[-1rem] mx-auto mb-8 text-body leading-[1.6] text-center text-muted">
          Add tours, activities, and transfers to build your multi-day trip - up to 7 days, with live pricing. Only a
          10% deposit to book.
        </p>
        <ItineraryBuilder />
      </section>
    </>
  );
}
