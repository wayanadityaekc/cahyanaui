import { FAQ } from '@/content/shared/faq';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'FAQ - Booking, Prices & Pick-up | Cahyana Ubud Experience',
  description:
    'Answers to common questions about booking, payment, prices per car or per person, custom itineraries, and pick-up areas with Cahyana Ubud Experience.',
  alternates: { canonical: '/faq.html' },
};

export default function Faq() {
  return (
    <>
      <JsonLd page="faq" />
      <section className="subhero subhero--overlap">
        <div className="subhero__content">
          <h1 className="subhero__title">Frequently Asked Questions</h1>
          <p className="subhero__text">
            The quick answers to how booking, pricing, and pick-up work. Still not sure? Message us on WhatsApp - we
            usually reply within a few hours.
          </p>
        </div>
      </section>

      <section className="py-[var(--section-gap)] px-[var(--space-3)]">
        <h2 className={SECTION_TITLE}>Frequently Asked Questions</h2>
        <div className="max-w-[var(--container-mid)] mx-auto">
          <div className="min-w-0">
            {FAQ.map((item, i) => (
              <details className="group mb-3 [border:1px_solid_#e0ddd4] rounded-md bg-white overflow-hidden" key={i}>
                <summary className="relative py-[1.1rem] pr-12 pl-5 font-body text-[1rem] font-semibold text-green cursor-pointer list-none [&::-webkit-details-marker]:hidden after:content-['+'] after:absolute after:top-1/2 after:right-5 after:-translate-y-1/2 after:text-[1.5rem] after:font-normal after:text-gold [[open]_&]:text-gold [[open]_&]:after:content-['−']">
                  {item.q}
                </summary>
                <div
                  className="pt-0 px-5 pb-5 [&_p]:font-body [&_p]:text-body [&_p]:leading-[var(--lh-body)] [&_p]:font-normal"
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
