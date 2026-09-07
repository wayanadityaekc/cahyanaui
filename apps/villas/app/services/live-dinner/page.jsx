import Link from 'next/link';
import Mosaic from '@/components/ui/Mosaic';
import ServiceAside from '@/components/sections/ServiceAside';

export const metadata = {
  title: 'Private Chef Live Dinner in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'A private chef cooks dinner in your Ubud villa — romantic tables for two, Balinese megibung feasts and BBQ nights. Prices upfront.',
};

export default function LiveDinnerPage() {
  return (
    <>
      <section className="detail-hero short">
        <div
          className="detail-hero-bg"
          style={{ backgroundImage: "url('https://picsum.photos/seed/dinner9/1800/900')" }}
        />
        <div className="container detail-hero-inner">
          <p className="kicker">At Your Villa</p>
          <h1>Live Dinner</h1>
          <p className="hero-sub">A chef in your kitchen, a table under the stars, no booking a restaurant.</p>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div className="detail-main">
            <p className="eyebrow">At a Glance</p>
            <ul className="glance-row">
              <li><span>Where</span>Your villa kitchen</li>
              <li><span>Book</span>A day ahead</li>
              <li><span>Serves</span>2 to 6 guests</li>
              <li><span>Price</span>Ask us</li>
            </ul>

            <h2 className="section-title">How it works</h2>
            <p>
              The chef shops that afternoon, arrives around five, and cooks in your villa kitchen while you&apos;re still in the pool. You eat when it&apos;s ready, at your own table, and the kitchen is clean before anyone leaves.
            </p>

            <h2 className="section-title">Menus</h2>
            <ul className="space-list">
              <li><strong>Romantic dinner for two</strong> Multi-course, candles, flowers on the table.</li>
              <li><strong>Balinese feast</strong> Megibung style - shared platters for the whole group.</li>
              <li><strong>BBQ night</strong> Grilled beside the pool.</li>
              <li><strong>Everyday dinner</strong> Home cooking, no occasion needed.</li>
              <li><strong>Vegetarian &amp; vegan</strong> Any menu, just tell us when you book.</li>
            </ul>
            <p className="rate-fine">Ingredients, cooking, service and clean-up are all handled. Message us for current prices and to pick a night.</p>

            <h2 className="section-title">Cooking class version</h2>
            <p>
              Same chef, but you&apos;re at the counter. A couple of hours through a market basket of Balinese dishes, then you eat what you made. Ask us when you book.
            </p>

            <Mosaic
              variant="three"
              images={[
                { src: 'https://picsum.photos/seed/dn1c/700/500', alt: 'Candle-lit dinner table beside the villa pool' },
                { src: 'https://picsum.photos/seed/dn2c/700/500', alt: 'Chef cooking in the villa kitchen' },
                { src: 'https://picsum.photos/seed/dn3c/700/500', alt: 'Balinese dishes served on shared platters' },
              ]}
            />
          </div>

          <ServiceAside
            title="Dinner at your villa"
            facts={['Chef cooks in your kitchen', 'Book a day ahead', 'Ingredients & clean-up included', 'Cooking class available']}
            ctaLabel="Plan a dinner"
            otherServices={[
              { href: '/services/breakfast', label: 'Breakfast' },
              { href: '/services/spa', label: 'Spa & Massage' },
            ]}
          />
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <h2>The best table in Ubud is yours</h2>
          <p>Book the villa, then tell us the night.</p>
          <div className="btn-row">
            <Link href="/villas" className="btn btn-gold">See both villas</Link>
          </div>
        </div>
      </section>
    </>
  );
}
