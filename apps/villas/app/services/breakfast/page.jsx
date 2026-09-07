import Link from 'next/link';
import Mosaic from '@/components/ui/Mosaic';
import ServiceAside from '@/components/sections/ServiceAside';

export const metadata = {
  title: 'Breakfast at Your Villa in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'Breakfast cooked fresh at your Ubud villa each morning — Balinese and western options, plus floating breakfast in your private pool.',
};

export default function BreakfastPage() {
  return (
    <>
      <section className="detail-hero short">
        <div
          className="detail-hero-bg"
          style={{ backgroundImage: "url('https://picsum.photos/seed/bfast9/1800/900')" }}
        />
        <div className="container detail-hero-inner">
          <p className="kicker">At Your Villa</p>
          <h1>Breakfast</h1>
          <p className="hero-sub">Cooked fresh in your own villa kitchen each morning.</p>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div className="detail-main">
            <p className="eyebrow">At a Glance</p>
            <ul className="glance-row">
              <li><span>Order</span>Night before</li>
              <li><span>Where</span>Terrace, poolside or in bed</li>
              <li><span>Kitchen</span>Fully equipped</li>
              <li><span>Price</span>Ask us</li>
            </ul>

            <h2 className="section-title">How it works</h2>
            <p>
              Tell us the night before what you want and roughly when. Someone arrives in the morning, cooks it in your villa kitchen, sets the table, and leaves you to it. No buffet queue, no dining room, no set hour.
            </p>

            <h2 className="section-title">The menu</h2>
            <ul className="space-list">
              <li><strong>Balinese</strong> Nasi goreng, mie goreng, bubur injin, or nasi campur with sambal matah.</li>
              <li><strong>Western</strong> Eggs any way, banana pancakes, French toast, fruit and yoghurt.</li>
              <li><strong>Always on the table</strong> Seasonal fruit platter, fresh juice, Bali coffee or herbal tea.</li>
              <li><strong>Dietary</strong> Vegetarian, vegan and gluten-free versions of everything - just say so.</li>
            </ul>

            <h2 className="section-title">Floating breakfast</h2>
            <p>
              The tray version, floated on your own pool. It&apos;s a photo, yes, but the food is the same food and it&apos;s genuinely nice to eat in the water at eight in the morning. Order it the night before.
            </p>

            <Mosaic
              variant="three"
              images={[
                { src: 'https://picsum.photos/seed/bf1c/700/500', alt: 'Floating breakfast tray in the villa pool' },
                { src: 'https://picsum.photos/seed/bf2c/700/500', alt: 'Nasi goreng plated for breakfast' },
                { src: 'https://picsum.photos/seed/bf3c/700/500', alt: 'Fruit platter and Bali coffee' },
              ]}
            />
          </div>

          <ServiceAside
            title="Breakfast at your villa"
            facts={['Balinese or western', 'Your time, your table', 'Floating tray on request', 'Vegetarian & vegan versions']}
            ctaLabel="Ask about the menu"
            otherServices={[
              { href: '/services/spa', label: 'Spa & Massage' },
              { href: '/services/live-dinner', label: 'Live Dinner' },
            ]}
          />
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <h2>Wake up, eat well</h2>
          <p>Pick your villa first, then tell us what you like in the morning.</p>
          <div className="btn-row">
            <Link href="/villas" className="btn btn-gold">See both villas</Link>
          </div>
        </div>
      </section>
    </>
  );
}
