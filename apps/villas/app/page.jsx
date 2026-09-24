import Link from 'next/link';
import { Mountain, ShieldCheck, Users, Waves } from 'lucide-react';
import VillaCard from '@/components/cards/VillaCard';
import ServiceCard from '@/components/cards/ServiceCard';
import ReviewCard from '@/components/cards/ReviewCard';
import SearchCard from '@/components/sections/SearchCard';
import CheckAvailabilityButton from '@/components/booking/CheckAvailabilityButton';
import { VILLA_LIST } from '@/lib/villas';
import { OVERALL_RATING, OVERALL_REVIEW_COUNT, REVIEW_CARDS } from '@/lib/reviews';
import { UBUD_GUIDE_LINK } from '@/lib/constants';
import { GRID_PAIR, GRID_TRIO, Hero } from '@cahyana/ui';

export const metadata = {
  title: 'Private Pool Villas in Ubud, Bali | Ubud Private Villas by Cahyana Ubud',
  description: 'Two private pool villas in north Ubud, Bali — a 3-bedroom family house and a 2-bedroom ricefield villa. Both rated 4.96 on Airbnb, 10 minutes from Ubud Palace.',
};

const WHY_STAY = [
  { title: 'Private Pool', desc: 'Enjoy your own pool, surrounded by tropical greenery.', Icon: Waves },
  { title: 'Local Hosting', desc: 'Our family is here to make your stay feel like home.', Icon: Users },
  { title: 'Transparent Pricing', desc: 'No hidden fees. What you see is what you pay.', Icon: ShieldCheck },
];

export default function HomePage() {
  return (
    <>
      {/* Hero. The shell - the height ladder, the two scrims, the container,
          the eyebrow/title/lede stack - is Hero in @cahyana/ui. */}
      <Hero
        size="page"
        image="/images/cahyana-tibuah.webp"
        alt="Cahyana Tibuah pool at dusk, surrounded by rice fields"
        eyebrow="Ubud Private Villas"
        title="A private retreat in the heart of Ubud"
        lede="Two exclusive villas, designed for comfort, privacy and a true Balinese experience."
        actions={(
          <>
            <CheckAvailabilityButton className="btn btn-cta" />
            <Link href="/villas" className="btn btn-outline-light">Explore villas</Link>
          </>
        )}
        below={(
          <div className="wrap">
            <SearchCard />
          </div>
        )}
      />

      {/* Villas */}
      <section className="section bg-cream">
        <div className="wrap">
          <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-end mb-9">
            <div>
              <p className="eyebrow">Our Villas</p>
              <h2 className="text-h2 font-semibold text-gold">
                Two unique villas, one unforgettable stay
              </h2>
            </div>
            <p className="text-small text-muted">
              Each villa is thoughtfully designed with a private pool, open living space and a calming view of the tropical gardens. Whether you&apos;re here for a romantic escape or a family getaway, you&apos;ll find your place in Ubud.
            </p>
          </div>
          <div className={GRID_PAIR}>
            {VILLA_LIST.map((villa) => (
              <VillaCard key={villa.slug} villa={villa} />
            ))}
          </div>

          {/* Why stay with us */}
          <div className="mt-10 rounded-xl p-7 sm:p-9 bg-white grid sm:grid-cols-3 gap-8">
            {WHY_STAY.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="icon-circle">
                  <item.Icon className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-h3 font-semibold text-gold">{item.title}</h3>
                  <p className="text-small text-muted mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience the real Ubud. Same Hero shell as the page's own hero,
          one step down the height ladder - and now the same scrim, which this
          band used to hand-roll with an inline style. */}
      <Hero
        size="band"
        as="h2"
        titleSize="h2"
        titleClassName="max-w-md"
        image="https://picsum.photos/seed/ubudwalk9/1800/900"
        alt="Rice terraces near Ubud at sunrise"
        eyebrow="More Than Just A Stay"
        title="Experience the real Ubud"
        lede="Combine your villa stay with our curated experiences, from cultural tours to wellness and adventure."
      >
        <Link href="/experiences" className="btn btn-outline-light mt-5">Explore experiences</Link>

        <Link
          href="/experiences"
          className="card mt-8 inline-flex items-center gap-3 p-4 max-w-xs bg-white"
        >
          <span className="icon-circle">
            <Mountain className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-h3 font-semibold text-gold">Ubud Highlights</span>
            <span className="block text-label text-muted">Temples, rice terraces, waterfalls &amp; more</span>
          </span>
        </Link>
      </Hero>

      {/* Reviews */}
      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Guest Reviews</p>
          <h2 className="text-h2 font-semibold text-gold">What our guests say</h2>
          <p className="mt-2 text-small text-muted">Real experiences from people who stayed with us.</p>
          <p className="mt-4 flex items-center gap-2 text-h3 font-semibold text-gold">
            {OVERALL_RATING}/5
            <span className="stars-amber">★★★★★</span>
            <span className="text-small text-muted font-normal">from {OVERALL_REVIEW_COUNT}+ reviews</span>
          </p>

          <div className={`${GRID_TRIO} mt-7`}>
            {REVIEW_CARDS.map((card, i) => (
              <ReviewCard key={i} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* Neighbourhood / sister brand */}
      <section className="section bg-cream">
        <div className="wrap grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="eyebrow">Same Family</p>
            <h2 className="text-h2 font-semibold text-gold">Need a driver while you stay?</h2>
            <p className="mt-2 text-small text-muted max-w-md">
              Airport pickup, day tours, temple runs and rice terrace mornings - booked through our sister brand, with every price upfront. Most guests do a full-day Ubud tour and cover 7 or 8 stops.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <a href="https://cahyanaubudexperience.com" target="_blank" rel="noopener" className="btn btn-cta">Visit Cahyana Ubud Experience</a>
              <a href={UBUD_GUIDE_LINK} target="_blank" rel="noopener" className="btn btn-outline">Read the Ubud guide</a>
            </div>
          </div>
          {/* Real photo, reused from CUE's own asset
              (assets/images/tegalalang-rice-terrace-hero.jpg) — an actual
              destination guests visit, not a stock/placeholder shot. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/tegalalang-rice-terrace.jpg"
            alt="Tegalalang Rice Terrace, one of the stops on a full-day Ubud tour with our sister brand"
            width={800}
            height={560}
            loading="lazy"
            className="w-full rounded-xl object-cover aspect-[4/3]"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center bg-gold">
        <div className="wrap">
          <h2 className="text-h2 font-semibold text-white">Dates in mind?</h2>
          <p className="mt-2 text-small text-white/75">
            Open the booking flow, or message us and we&apos;ll tell you straight if it&apos;s free.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <CheckAvailabilityButton className="btn btn-cta" />
            <Link href="/services/scooter-rental" className="btn btn-outline-light">Renting a scooter too?</Link>
          </div>
        </div>
      </section>
    </>
  );
}
