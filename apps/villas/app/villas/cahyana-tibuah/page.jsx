import Mosaic from '@/components/ui/Mosaic';
import ScoreRow from '@/components/ui/ScoreRow';
import BookAside from '@/components/sections/BookAside';
import AirbnbLink from '@/components/ui/AirbnbLink';

export const metadata = {
  title: "Cahyana Tibuah · 2 Bedroom Ricefield Villa with Private Pool in Ubud",
  description: 'Cahyana Tibuah is a 2-bedroom villa in the rice fields of north Ubud sleeping 4, with a private pool, ensuite bathrooms and self check-in. Rated 4.96 from 85 Airbnb reviews.',
};

export default function CahyanaTibuahPage() {
  return (
    <>
      <section className="detail-hero">
        <div
          className="detail-hero-bg"
          style={{ backgroundImage: "url('https://picsum.photos/seed/tibuah-hero/1800/900')" }}
        />
        <div className="container detail-hero-inner">
          <p className="kicker">North Ubud · Entire villa</p>
          <h1>Cahyana Tibuah</h1>
          <p className="hero-sub">2 bedrooms · sleeps 4 · private pool · ★ 4.96 from 85 reviews</p>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div className="detail-main">
            <p className="eyebrow">At a Glance</p>
            <ul className="glance-row">
              <li><span>Guests</span>Up to 4</li>
              <li><span>Bedrooms</span>2 · both ensuite</li>
              <li><span>Beds</span>2 king</li>
              <li><span>Bathrooms</span>2</li>
            </ul>

            <h2 className="section-title">The villa</h2>
            <p>
              A private 2-bedroom villa nestled among peaceful rice fields in northern Ubud. The villa is entirely yours, each room comes with its own key, and it sits about a three-minute walk down a small path into the fields.
            </p>
            <p>Airbnb marks it as top rated by guests from Australia - 100% of them gave it five stars in the past year.</p>

            <h2 className="section-title">The space</h2>
            <ul className="space-list">
              <li><strong>Two bedrooms</strong> King beds, both with a direct view of the pool.</li>
              <li><strong>Ensuite bathrooms</strong> One in each bedroom.</li>
              <li><strong>Living area</strong> Open plan lounge, neutral-toned sofa, smart TV.</li>
              <li><strong>Kitchen &amp; dining</strong> Fully equipped kitchen with a dining area.</li>
              <li><strong>Outside</strong> Private pool and an outdoor shower.</li>
              <li><strong>Parking</strong> Scooter parking just outside, car parking near the main street.</li>
            </ul>

            <h2 className="section-title">What&apos;s looked after</h2>
            <ul className="note-list">
              <li><span>Housekeeping</span>Included, with extended service available</li>
              <li><span>Linen &amp; towels</span>Fresh on arrival, changed every two days</li>
              <li><span>Airport pickup</span>We can arrange it - just tell us in advance</li>
              <li><span>Scooter</span>We can provide one if you ride but don&apos;t have one</li>
              <li><span>Check-in</span>Self check-in with the building staff</li>
            </ul>

            <h2 className="section-title">Getting around</h2>
            <ul className="note-list">
              <li><span>Ubud Palace</span>10-minute drive</li>
              <li><span>Monkey Forest</span>10-minute drive</li>
              <li><span>Tegallalang</span>10-minute drive</li>
              <li><span>Nearest restaurant</span>2 minutes</li>
              <li><span>Mini market</span>3 minutes</li>
            </ul>
            <p>
              The location is built for exploring - we usually suggest a full-day Ubud tour, which covers 7 to 8 destinations in about eight hours.
            </p>

            <h2 className="section-title">Gallery</h2>
            <Mosaic
              images={[
                { src: 'https://picsum.photos/seed/t1b/700/900', alt: 'Cahyana Tibuah pool above the rice field' },
                { src: 'https://picsum.photos/seed/t2b/700/500', alt: 'Cahyana Tibuah open plan living area' },
                { src: 'https://picsum.photos/seed/t3b/700/500', alt: 'Cahyana Tibuah king bedroom' },
                { src: 'https://picsum.photos/seed/t4b/700/500', alt: 'Cahyana Tibuah ensuite bathroom' },
                { src: 'https://picsum.photos/seed/t5b/700/500', alt: 'Cahyana Tibuah outdoor shower' },
              ]}
            />

            <h2 className="section-title">Guest ratings</h2>
            <ScoreRow
              scores={[
                ['Cleanliness', '5.0'],
                ['Accuracy', '5.0'],
                ['Check-in', '5.0'],
                ['Communication', '4.9'],
                ['Location', '4.8'],
                ['Value', '4.9'],
              ]}
            />
            <p>Guests mention hospitality, cleanliness, getting around, the location and the pool more than anything else.</p>

            <h2 className="section-title">Good to know</h2>
            <ul className="note-list">
              <li><span>Access</span>Three-minute walk down a small path by the rice fields</li>
              <li><span>Privacy</span>The villa is entirely yours, each room separately keyed</li>
              <li><span>Host</span>Wayan · Superhost, replies within an hour, speaks English &amp; Indonesian</li>
              <li><span>Registration</span>NIB 2501220013924</li>
            </ul>
          </div>

          <BookAside
            villa="tibuah"
            rating="4.96"
            reviews={85}
            facts={[
              'Entire villa, 4 guests',
              '2 king bedrooms · 2 baths',
              'Private pool & outdoor shower',
              'Self check-in',
            ]}
          />
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <h2>Cahyana Tibuah, your dates</h2>
          <p>See if the ricefield villa is open when you are.</p>
          <div className="btn-row">
            <AirbnbLink villa="tibuah" className="btn btn-gold">Check availability</AirbnbLink>
          </div>
        </div>
      </section>
    </>
  );
}
