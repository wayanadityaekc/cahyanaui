import Link from 'next/link';
import VillaCard from '@/components/cards/VillaCard';
import ServiceCard from '@/components/cards/ServiceCard';
import ReviewCard from '@/components/cards/ReviewCard';
import SearchCard from '@/components/sections/SearchCard';
import CheckAvailabilityButton from '@/components/booking/CheckAvailabilityButton';
import { VILLA_LIST } from '@/lib/villas';
import { OVERALL_RATING, OVERALL_REVIEW_COUNT, REVIEW_CARDS } from '@/lib/reviews';
import { UBUD_GUIDE_LINK } from '@/lib/constants';
import { GRID_PAIR, GRID_TRIO } from '@/components/ui/gridClasses';

export const metadata = {
  title: 'Private Pool Villas in Ubud, Bali | Ubud Private Villas by Cahyana Ubud',
  description: 'Two private pool villas in north Ubud, Bali — a 3-bedroom family house and a 2-bedroom ricefield villa. Both rated 4.96 on Airbnb, 10 minutes from Ubud Palace.',
};

const WHY_STAY = [
  {
    title: 'Private Pool',
    desc: 'Enjoy your own pool, surrounded by tropical greenery.',
    icon: <path d="M3 16c1.5-1 2.5-1 4 0s2.5 1 4 0 2.5-1 4 0 2.5 1 4 0M3 12c1.5-1 2.5-1 4 0s2.5 1 4 0 2.5-1 4 0 2.5 1 4 0M6 12V7a2 2 0 0 1 2-2h1v2" />,
  },
  {
    title: 'Local Hosting',
    desc: 'Our family is here to make your stay feel like home.',
    icon: <><circle cx="9" cy="8" r="2.6" /><circle cx="16" cy="9" r="2.2" /><path d="M3.5 19c0-3 2.5-5.4 5.5-5.4S14.5 16 14.5 19M14.8 13.7c2.5.3 4.2 2.4 4.2 5" /></>,
  },
  {
    title: 'Transparent Pricing',
    desc: 'No hidden fees. What you see is what you pay.',
    icon: <><path d="M12 3l7 3.2v5c0 4.5-3 8.2-7 9.6-4-1.4-7-5.1-7-9.6v-5L12 3Z" /><path d="m9 12 2 2 4-4" /></>,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative min-h-[58vh] sm:min-h-[72vh] flex items-center overflow-hidden [background:linear-gradient(150deg,var(--color-gold),#2f2b24)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cahyana-tibuah.webp"
            alt="Cahyana Tibuah pool at dusk, surrounded by rice fields"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* TWO scrims, because the two layouts need opposite things.
              Desktop puts the copy in the left third, so a left-to-right gradient
              darkens exactly where the words are and leaves the photo clear.
              On a phone the copy spans the FULL width, and that same gradient
              left the right-hand end of every line sitting on a lit window — the
              subhead was genuinely hard to read. Below 993px it becomes a
              top-to-bottom scrim instead, dark at both ends, with the bottom end
              carrying the search card that overlaps it. */}
          <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(20,20,16,0.5)_0%,rgba(20,20,16,0.34)_40%,rgba(20,20,16,0.68)_100%)] min-[993px]:[background:linear-gradient(100deg,rgba(20,20,16,0.62)_0%,rgba(20,20,16,0.28)_48%,rgba(20,20,16,0.05)_75%)]" />
          <div className="wrap relative z-10 py-14 sm:py-24">
            <p className="eyebrow text-gold-l">Ubud Private Villas</p>
            <h1 className="text-display font-bold max-w-xl text-white">
              A private retreat in the heart of Ubud
            </h1>
            <p className="mt-4 max-w-md text-body text-white/88">
              Two exclusive villas, designed for comfort, privacy and a true Balinese experience.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <CheckAvailabilityButton className="btn btn-cta" />
              <Link href="/villas" className="btn btn-outline-light">Explore villas</Link>
            </div>
          </div>
        </div>

        <div className="wrap">
          <SearchCard />
        </div>
      </section>

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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
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

      {/* Experience the real Ubud */}
      <section className="relative">
        <div className="relative min-h-[46vh] flex items-center overflow-hidden [background:linear-gradient(150deg,var(--color-gold),#2f2b24)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/ubudwalk9/1800/900"
            alt="Rice terraces near Ubud at sunrise"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,20,16,0.15), rgba(20,20,16,0.55))' }} />
          <div className="wrap relative z-10 py-16">
            <p className="eyebrow text-gold-l">More Than Just A Stay</p>
            <h2 className="text-h2 font-semibold max-w-md text-white">Experience the real Ubud</h2>
            <p className="mt-2 max-w-md text-small text-white/85">
              Combine your villa stay with our curated experiences, from cultural tours to wellness and adventure.
            </p>
            <Link href="/experiences" className="btn btn-outline-light mt-5">Explore experiences</Link>

            <Link
              href="/experiences"
              className="card mt-8 inline-flex items-center gap-3 p-4 max-w-xs bg-white"
            >
              <span className="icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 20 5-8 4 5 3-4 6 7Z" /><circle cx="8" cy="7" r="2" />
                </svg>
              </span>
              <span>
                <span className="block text-h3 font-semibold text-gold">Ubud Highlights</span>
                <span className="block text-label text-muted">Temples, rice terraces, waterfalls &amp; more</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

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
