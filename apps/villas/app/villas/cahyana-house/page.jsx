import Mosaic from '@/components/ui/Mosaic';
import ScoreRow from '@/components/ui/ScoreRow';
import BookAside from '@/components/sections/BookAside';
import AirbnbLink from '@/components/ui/AirbnbLink';

export const metadata = {
  title: 'Cahyana House · 3 Bedroom Private Pool Villa in Ubud | Cahyana Ubud',
  description: 'Cahyana House is a 3-bedroom private house in north Ubud sleeping 6, with ensuite bathrooms, a private pool and full kitchen. Rated 4.96 from 221 Airbnb reviews.',
};

export default function CahyanaHousePage() {
  return (
    <>
      <section className="detail-hero">
        <div
          className="detail-hero-bg"
          style={{ backgroundImage: "url('https://picsum.photos/seed/house-hero/1800/900')" }}
        />
        <div className="container detail-hero-inner">
          <p className="kicker">North Ubud · Entire house</p>
          <h1>Cahyana House</h1>
          <p className="hero-sub">3 bedrooms · sleeps 6 · private pool · ★ 4.96 from 221 reviews</p>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div className="detail-main">
            <p className="eyebrow">At a Glance</p>
            <ul className="glance-row">
              <li><span>Guests</span>Up to 6</li>
              <li><span>Bedrooms</span>3 · all ensuite</li>
              <li><span>Beds</span>3 king</li>
              <li><span>Bathrooms</span>4.5</li>
            </ul>

            <h2 className="section-title">The villa</h2>
            <p>
              This spacious 3-bedroom house sits north of Ubud, offering a quiet escape while staying close to everything. It&apos;s surrounded by Balinese village life - a temple, rice fields, restaurants and the local market are all nearby.
            </p>
            <p>
              Airbnb marks it as extra spacious and one of the few places in the area with a pool. Guests mention the smooth check-in more than almost anything else.
            </p>

            <h2 className="section-title">The space</h2>
            <ul className="space-list">
              <li><strong>Three bedrooms</strong> Each with a king bed and a direct view of the pool.</li>
              <li><strong>Ensuite bathrooms</strong> One in every bedroom, 4.5 bathrooms in total.</li>
              <li><strong>Living area</strong> Comfortable lounge with a smart TV.</li>
              <li><strong>Kitchen &amp; dining</strong> Fully equipped kitchen with its own dining area.</li>
              <li><strong>Outside</strong> Private pool and home garden.</li>
              <li><strong>Parking</strong> Space for motorbikes on the property.</li>
            </ul>

            <h2 className="section-title">Getting around</h2>
            <ul className="note-list">
              <li><span>Ubud Palace</span>10-minute drive</li>
              <li><span>Monkey Forest</span>10-minute drive</li>
              <li><span>Tegallalang</span>10-minute drive</li>
              <li><span>Nearest cafe</span>2-minute walk</li>
              <li><span>Mini market</span>A few minutes away</li>
            </ul>
            <p>
              The location lets you cover 7 to 8 popular Ubud destinations in a single day - most guests take a full-day tour straight from the villa.
            </p>

            <h2 className="section-title">Gallery</h2>
            <Mosaic
              images={[
                { src: 'https://picsum.photos/seed/h1b/700/900', alt: 'Cahyana House pool at sunset' },
                { src: 'https://picsum.photos/seed/h2b/700/500', alt: 'Cahyana House living area with smart TV' },
                { src: 'https://picsum.photos/seed/h3b/700/500', alt: 'Cahyana House king bedroom facing the pool' },
                { src: 'https://picsum.photos/seed/h4b/700/500', alt: 'Cahyana House ensuite bathroom' },
                { src: 'https://picsum.photos/seed/h5b/700/500', alt: 'Cahyana House kitchen and dining area' },
              ]}
            />

            <h2 className="section-title">Guest ratings</h2>
            <ScoreRow
              scores={[
                ['Cleanliness', '5.0'],
                ['Accuracy', '5.0'],
                ['Check-in', '5.0'],
                ['Communication', '5.0'],
                ['Location', '4.8'],
                ['Value', '4.9'],
              ]}
            />
            <blockquote className="review inline-review">
              <p className="stars">★★★★★</p>
              <p>
                &ldquo;We had a wonderful stay! The place is very clean, comfortable, and peaceful - perfect for a family getaway. There are many great cafes and restaurants near the villa. The owners, Pak Made and his wife, are incredibly kind.&rdquo;
              </p>
              <cite>Airbnb guest</cite>
            </blockquote>

            <h2 className="section-title">Good to know</h2>
            <ul className="note-list">
              <li><span>Check-in</span>Through a Balinese family compound - a real welcome, full privacy inside</li>
              <li><span>Geckos</span>Small lizards are normal here, harmless, and considered good luck</li>
              <li><span>Host</span>Made · Superhost, 3 years hosting, replies within an hour</li>
              <li><span>Registration</span>NIB 2501220013924 · KBLI 55193</li>
            </ul>
          </div>

          <BookAside
            villa="house"
            rating="4.96"
            reviews={221}
            facts={[
              'Entire house, 6 guests',
              '3 king bedrooms · 4.5 baths',
              'Private pool & garden',
              'Superhost since 2023',
            ]}
          />
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <h2>Cahyana House, your dates</h2>
          <p>Open the calendar and see if the house is free when you are.</p>
          <div className="btn-row">
            <AirbnbLink villa="house" className="btn btn-gold">Check availability</AirbnbLink>
          </div>
        </div>
      </section>
    </>
  );
}
