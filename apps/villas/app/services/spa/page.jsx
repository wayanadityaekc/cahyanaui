import Link from 'next/link';
import Mosaic from '@/components/ui/Mosaic';
import ServiceAside from '@/components/sections/ServiceAside';

export const metadata = {
  title: 'In-Villa Spa & Massage in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'Balinese massage, aromatherapy, couples treatments and flower baths, delivered to your private villa in Ubud. Prices upfront.',
};

export default function SpaPage() {
  return (
    <>
      <section className="detail-hero short">
        <div
          className="detail-hero-bg"
          style={{ backgroundImage: "url('https://picsum.photos/seed/spa9/1800/900')" }}
        />
        <div className="container detail-hero-inner">
          <p className="kicker">At Your Villa</p>
          <h1>Spa &amp; Massage</h1>
          <p className="hero-sub">Local therapists, your own villa, no taxi afterwards.</p>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div className="detail-main">
            <p className="eyebrow">At a Glance</p>
            <ul className="glance-row">
              <li><span>Where</span>Poolside or bedroom</li>
              <li><span>Book</span>Same day, with notice</li>
              <li><span>Therapists</span>From the village</li>
              <li><span>Price</span>Ask us</li>
            </ul>

            <h2 className="section-title">How it works</h2>
            <p>
              Our therapists are from the village, not an agency. They bring the table, the oils, the towels and the music, set up wherever you want, and take it all away after. You don&apos;t leave the villa and you don&apos;t get dressed for it.
            </p>

            <h2 className="section-title">Treatments</h2>
            <ul className="space-list">
              <li><strong>Balinese massage</strong> The traditional one - firm, oil-based, 60 or 90 minutes.</li>
              <li><strong>Aromatherapy massage</strong> Lighter pressure, essential oils.</li>
              <li><strong>Couples massage</strong> Two therapists, side by side at the pool.</li>
              <li><strong>Foot reflexology</strong> Good after a long day of temples and stairs.</li>
              <li><strong>Body scrub &amp; flower bath</strong> Scrub, rinse, then a bath full of frangipani.</li>
            </ul>
            <p className="rate-fine">Message us for current prices and to book a time - treatments are arranged for staying guests.</p>

            <Mosaic
              variant="three"
              images={[
                { src: 'https://picsum.photos/seed/sp1c/700/500', alt: 'Massage table set up beside the pool' },
                { src: 'https://picsum.photos/seed/sp2c/700/500', alt: 'Flower bath with frangipani petals' },
                { src: 'https://picsum.photos/seed/sp3c/700/500', alt: 'Aromatherapy oils and folded towels' },
              ]}
            />
          </div>

          <ServiceAside
            title="Spa at your villa"
            facts={['Therapist comes to you', 'Poolside or indoors', 'Book on the day, with notice', 'For staying guests']}
            ctaLabel="Book a treatment"
            otherServices={[
              { href: '/services/breakfast', label: 'Breakfast' },
              { href: '/services/live-dinner', label: 'Live Dinner' },
            ]}
          />
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <h2>Book the villa, then the massage</h2>
          <p>Treatments are for staying guests. Start with the dates.</p>
          <div className="btn-row">
            <Link href="/villas" className="btn btn-gold">See both villas</Link>
          </div>
        </div>
      </section>
    </>
  );
}
