import { FAQ } from '@/content/shared/faq';
import { breadcrumb, faqPage, jsonLd } from '@/lib/schema';

export const metadata = {
  title: 'FAQ - Booking, Prices & Pick-up | Cahyana Ubud Experience',
  description:
    'Answers to common questions about booking, payment, prices per car or per person, custom itineraries, and pick-up areas with Cahyana Ubud Experience.',
  alternates: { canonical: '/faq.html' },
};

export default function Faq() {
  return (
    <>
      <script type="application/ld+json" id="schema-faq" dangerouslySetInnerHTML={jsonLd(faqPage(FAQ))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq.html' },
          ]),
        )}
      />
      <section className="faq">
        <h2 className="section__title">Frequently Asked Questions</h2>
        <div className="faq__container">
          <div className="faq__list">
            {FAQ.map((item, i) => (
              <details className="faq__item" key={i}>
                <summary className="faq__q">{item.q}</summary>
                <div className="faq__a" dangerouslySetInnerHTML={{ __html: item.a }} />
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
