import VillaCard from '@/components/cards/VillaCard';
import ServiceCard from '@/components/cards/ServiceCard';
import Mosaic from '@/components/ui/Mosaic';
import AvailabilityBar from '@/components/ui/AvailabilityBar';
import AirbnbButton from '@/components/ui/AirbnbButton';
import { WHATSAPP_LINK, CUE_LINK, UBUD_GUIDE_LINK } from '@/lib/airbnb';

export const metadata = {
  title: 'Private Pool Villas in Ubud, Bali | Ubud Private Villas by Cahyana Ubud',
  description: 'Two private pool villas in north Ubud, Bali — a 3-bedroom family house and a 2-bedroom ricefield villa. Both rated 4.96 on Airbnb, 10 minutes from Ubud Palace.',
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: "url('https://picsum.photos/seed/ubudvilla9/1800/1000')" }}
        />
        <div className="container hero-inner">
          <p className="kicker">North Ubud · Bali</p>
          <h1>Your Own Villa,<br />Your Own Pace</h1>
          <p className="hero-sub">
            Two private pool villas run by one Ubud family. Both rated 4.96 on Airbnb, both ten minutes from Ubud Palace.
          </p>

          <AvailabilityBar />
        </div>
      </section>

      {/* Trust strip */}
      <section className="trust-strip">
        <div className="container trust-row">
          <div className="trust-item"><strong>4.96</strong><span>Average rating</span></div>
          <div className="trust-item"><strong>306</strong><span>Guest reviews</span></div>
          <div className="trust-item"><strong>Superhost</strong><span>Both villas</span></div>
          <div className="trust-item"><strong>Guest Favourite</strong><span>Airbnb badge</span></div>
        </div>
      </section>

      {/* Villas */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">Our Villas</p>
          <h2 className="section-title">Two villas, one family</h2>
          <div className="card-row">
            <VillaCard
              href="/villas/cahyana-house"
              img="https://picsum.photos/seed/house-hero/700/500"
              alt="Cahyana House private pool and garden"
              tag="3 Bedrooms"
              category="Sleeps 6 · 3 king beds · 4.5 baths"
              name="Cahyana House"
              meta="Private pool · Full kitchen · Ensuite in every room"
              rating="4.96"
              reviews={221}
            />
            <VillaCard
              href="/villas/cahyana-tibuah"
              img="https://picsum.photos/seed/tibuah-hero/700/500"
              alt="Cahyana Tibuah pool overlooking rice fields"
              tag="2 Bedrooms"
              category="Sleeps 4 · 2 king beds · 2 baths"
              name="Cahyana Tibuah"
              meta="Private pool · Ricefield setting · Self check-in"
              rating="4.96"
              reviews={85}
            />
            <a href="/villas" className="v-card more-card">
              <span className="more-arrow">→</span>
              <span className="more-title">Compare both villas</span>
              <span className="more-sub">Layouts, ratings and which one fits you</span>
            </a>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section band-dark">
        <div className="container">
          <p className="eyebrow gold">The Location</p>
          <h2 className="section-title light">Ten minutes from everything</h2>
          <div className="why-grid">
            <div className="why-item">
              <h3>10 min</h3>
              <p>Drive to Ubud Palace and the centre of town.</p>
            </div>
            <div className="why-item">
              <h3>10 min</h3>
              <p>Drive to the Sacred Monkey Forest Sanctuary.</p>
            </div>
            <div className="why-item">
              <h3>10 min</h3>
              <p>Drive to Tegallalang Rice Terrace.</p>
            </div>
            <div className="why-item">
              <h3>2 min</h3>
              <p>Walk to the nearest warung, cafe and mini market.</p>
            </div>
          </div>
          <p className="band-note">
            Both villas sit north of Ubud among rice fields and village life - quiet enough to sleep, close enough to reach 7 or 8 destinations in a single day.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">At Your Villa</p>
          <h2 className="section-title">Add it to your stay</h2>
          <div className="card-row">
            <ServiceCard
              href="/services/breakfast"
              img="https://picsum.photos/seed/bfast9/700/460"
              alt="Balinese breakfast served at the villa"
              name="Breakfast"
              desc="Cooked fresh each morning in your own villa kitchen."
              cta="See the menu"
            />
            <ServiceCard
              href="/services/spa"
              img="https://picsum.photos/seed/spa9/700/460"
              alt="Massage table set up beside the villa pool"
              name="Spa & Massage"
              desc="Local therapists come to you. Balinese, aromatherapy or couples."
              cta="See treatments"
            />
            <ServiceCard
              href="/services/live-dinner"
              img="https://picsum.photos/seed/dinner9/700/460"
              alt="Private chef preparing dinner at the villa"
              name="Live Dinner"
              desc="A chef cooks in your villa kitchen. Romantic table or family feast."
              cta="See menus"
            />
          </div>
        </div>
      </section>

      {/* Split feature */}
      <section className="section split">
        <div className="container split-inner">
          <div className="split-media">
            <img
              src="https://picsum.photos/seed/ubudwalk9/800/900"
              alt="Village path through the rice fields near the villas"
              width={800}
              height={900}
              loading="lazy"
            />
          </div>
          <div className="split-copy">
            <p className="eyebrow">The Neighbourhood</p>
            <h2 className="section-title">Village life, not a resort strip</h2>
            <p>
              Our villas sit inside real Ubud - temples, rice fields, a market, and neighbours going about their day. Guests tell us the best part is watching the village wake up.
            </p>
            <ul className="fact-list">
              <li><span>Setting</span>Rice fields and Balinese family compounds</li>
              <li><span>Nearby</span>Local restaurants, cafes and a mini market</li>
              <li><span>Parking</span>Space for scooters and cars</li>
              <li><span>Wildlife</span>Geckos and small lizards - harmless, and good luck here</li>
            </ul>
            <a href={UBUD_GUIDE_LINK} target="_blank" rel="noopener" className="btn btn-outline">Read the Ubud guide</a>
          </div>
        </div>
      </section>

      {/* Sister brand */}
      <section className="section band-gold">
        <div className="container band-inner">
          <div>
            <p className="eyebrow dark">Same Family</p>
            <h2 className="section-title">Need a driver while you stay?</h2>
            <p>
              Airport pickup, day tours, temple runs and rice terrace mornings - booked through our sister brand, with every price upfront. Most guests do a full-day Ubud tour and cover 7 or 8 stops.
            </p>
          </div>
          <a href={CUE_LINK} target="_blank" rel="noopener" className="btn btn-dark">Visit Cahyana Ubud Experience</a>
        </div>
      </section>

      {/* Gallery */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">Inside the Villas</p>
          <h2 className="section-title">A look around</h2>
          <Mosaic
            images={[
              { src: 'https://picsum.photos/seed/g1a/700/900', alt: 'Villa pool at golden hour' },
              { src: 'https://picsum.photos/seed/g2a/700/500', alt: 'Open living area with smart TV' },
              { src: 'https://picsum.photos/seed/g3a/700/500', alt: 'King bedroom facing the pool' },
              { src: 'https://picsum.photos/seed/g4a/700/500', alt: 'Ensuite bathroom' },
              { src: 'https://picsum.photos/seed/g5a/700/500', alt: 'Dining area beside the kitchen' },
            ]}
          />
        </div>
      </section>

      {/* Reviews */}
      <section className="section band-light">
        <div className="container">
          <p className="eyebrow">Guest Reviews</p>
          <h2 className="section-title">306 reviews, 4.96 average</h2>
          <div className="score-row">
            <div className="score"><strong>5.0</strong><span>Cleanliness</span></div>
            <div className="score"><strong>5.0</strong><span>Accuracy</span></div>
            <div className="score"><strong>5.0</strong><span>Check-in</span></div>
            <div className="score"><strong>5.0</strong><span>Communication</span></div>
            <div className="score"><strong>4.8</strong><span>Location</span></div>
            <div className="score"><strong>4.9</strong><span>Value</span></div>
          </div>
          <div className="review-row">
            <blockquote className="review">
              <p className="stars">★★★★★</p>
              <p>
                &ldquo;The place is very clean, comfortable, and peaceful - perfect for a family getaway. There are many great cafes and restaurants near the villa. The owners, Pak Made and his wife, are incredibly kind.&rdquo;
              </p>
              <cite>Airbnb guest · Cahyana House</cite>
            </blockquote>
            <blockquote className="review theme-card">
              <p className="stars">What guests mention most</p>
              <ul className="theme-list">
                <li>Hospitality <span>241</span></li>
                <li>Cleanliness <span>107</span></li>
                <li>Getting around <span>101</span></li>
                <li>Pool <span>85</span></li>
                <li>Location <span>89</span></li>
              </ul>
              <cite>Across both listings</cite>
            </blockquote>
            <blockquote className="review">
              <p className="stars">★★★★★</p>
              <p>
                100% of guests from Australia rated Cahyana Tibuah five stars in the past year - one of the reasons Airbnb marks it as top rated.
              </p>
              <cite>Airbnb listing highlight · Cahyana Tibuah</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-strip">
        <div className="container">
          <h2>Dates in mind?</h2>
          <p>Open the calendar, or message us and we&apos;ll tell you straight if it&apos;s free.</p>
          <div className="btn-row">
            <AirbnbButton className="btn btn-gold">Check availability</AirbnbButton>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className="btn btn-outline-light">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
