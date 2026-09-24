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
import { Button, Card, Container, EYEBROW_LINE, GRID_PAIR, GRID_TRIO, Hero, ICON_CIRCLE, STARS, Section, SplitFeature } from '@cahyana/ui';

export const metadata = {
  title: 'Private Pool Villas in Ubud, Bali | Ubud Private Villas by Cahyana Ubud',
  description: 'Two private pool villas in north Ubud, Bali — a 3-bedroom family house and a 2-bedroom ricefield villa. Both rated 4.96 on Airbnb, 10 minutes from Ubud Palace.',
};

const WHY_STAY = [
  { title: 'Private Pool', desc: 'Enjoy your own pool, surrounded by tropical greenery.', Icon: Waves },
  { title: 'Local Hosting', desc: 'Our family is here to make your stay feel like home.', Icon: Users },
  { title: 'Transparent Pricing', desc: 'No hidden fees. What you see is what you pay.', Icon: ShieldCheck },
];

// Three of the four "at your villa" services, in Wayan's order. Live Dinner is
// deliberately not here: four bands is the point where a homepage stops
// introducing things and starts listing them, and the drawer, the footer and
// every service page already link to it.
const SERVICES_HOME = [
  {
    href: '/services/spa',
    img: 'https://picsum.photos/seed/spa9/1200/900',
    alt: 'Massage set up on a villa terrace in Ubud',
    eyebrow: 'At Your Villa',
    title: 'Spa & Massage',
    lede: 'Local therapists come to you. Book a Balinese massage on your own terrace instead of going out for one - no taxi afterwards.',
    cta: 'Spa & Massage',
  },
  {
    href: '/services/breakfast',
    img: 'https://picsum.photos/seed/bfast9/1200/900',
    alt: 'Balinese breakfast laid out at the villa',
    eyebrow: 'At Your Villa',
    title: 'Breakfast',
    lede: 'Cooked fresh in your own kitchen each morning, Balinese or western, at whatever hour suits you. Floating breakfast in the pool on request.',
    cta: 'See breakfast',
  },
  {
    href: '/services/scooter-rental',
    img: 'https://picsum.photos/seed/scooter9/1200/900',
    alt: 'Scooter parked at a villa entrance in Ubud',
    eyebrow: 'Getting Around',
    title: 'Scooter Rental',
    lede: 'A scooter delivered to the villa and collected at the end, with helmets. The easiest way to reach the rice fields and the warungs off the main road.',
    cta: 'Rent a scooter',
  },
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
            <CheckAvailabilityButton />
            <Button as={Link} variant="light" href="/villas">Explore villas</Button>
          </>
        )}
        below={(
          <Container>
            <SearchCard />
          </Container>
        )}
      />

      {/* Villas */}
      <Section tone="cream">
        <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-end mb-9">
          <div>
            <p className={EYEBROW_LINE}>Our Villas</p>
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
              <span className={ICON_CIRCLE}>
                <item.Icon className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-h3 font-semibold text-gold">{item.title}</h3>
                <p className="text-small text-muted mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
</Section>

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
        <Button as={Link} variant="light" href="/experiences" className="mt-5">Explore experiences</Button>

        <Card as={Link} href="/experiences" className="mt-8 inline-flex items-center gap-3 p-4 max-w-xs">
          <span className={ICON_CIRCLE}>
            <Mountain className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-h3 font-semibold text-gold">Ubud Highlights</span>
            <span className="block text-label text-muted">Temples, rice terraces, waterfalls &amp; more</span>
          </span>
        </Card>
      </Hero>


      {/* Services, in the order Wayan asked for: villas, then Cahyana Ubud
          Experience, then spa, breakfast and the scooter, then the reviews.
          Each is a SplitFeature - one thing at a time, photo alternating sides
          so three in a row do not read as one list. The copy is lifted from
          each service's own page rather than written fresh, so the homepage
          cannot promise something the page it links to does not say. */}
      {SERVICES_HOME.map((sv, i) => (
        <SplitFeature
          key={sv.href}
          tone={i % 2 === 0 ? 'cream' : 'plain'}
          reverse={i % 2 === 1}
          image={sv.img}
          alt={sv.alt}
          eyebrow={sv.eyebrow}
          title={sv.title}
          lede={sv.lede}
          actions={<Button as={Link} href={sv.href}>{sv.cta}</Button>}
        />
      ))}

      {/* Reviews */}
      <Section>
        <p className={EYEBROW_LINE}>Guest Reviews</p>
        <h2 className="text-h2 font-semibold text-gold">What our guests say</h2>
        <p className="mt-2 text-small text-muted">Real experiences from people who stayed with us.</p>
        <p className="mt-4 flex items-center gap-2 text-h3 font-semibold text-gold">
          {OVERALL_RATING}/5
          <span className={STARS}>★★★★★</span>
          <span className="text-small text-muted font-normal">from {OVERALL_REVIEW_COUNT}+ reviews</span>
        </p>

        <div className={`${GRID_TRIO} mt-7`}>
          {REVIEW_CARDS.map((card, i) => (
            <ReviewCard key={i} card={card} />
          ))}
        </div>
</Section>

      {/* Neighbourhood / sister brand */}
      <Section tone="cream" bare>
        <Container className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className={EYEBROW_LINE}>Same Family</p>
            <h2 className="text-h2 font-semibold text-gold">Need a driver while you stay?</h2>
            <p className="mt-2 text-small text-muted max-w-md">
              Airport pickup, day tours, temple runs and rice terrace mornings - booked through our sister brand, with every price upfront. Most guests do a full-day Ubud tour and cover 7 or 8 stops.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Button as="a" href="https://cahyanaubudexperience.com" target="_blank" rel="noopener">Visit Cahyana Ubud Experience</Button>
              <Button as="a" variant="ghost" href={UBUD_GUIDE_LINK} target="_blank" rel="noopener">Read the Ubud guide</Button>
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
        </Container>
      </Section>

      {/* CTA */}
      <Section tone="dark" className="text-center">
        <h2 className="text-h2 font-semibold text-white">Dates in mind?</h2>
        <p className="mt-2 text-small text-white/75">
          Open the booking flow, or message us and we&apos;ll tell you straight if it&apos;s free.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <CheckAvailabilityButton />
          <Button as={Link} variant="light" href="/services/scooter-rental">Renting a scooter too?</Button>
        </div>
</Section>
    </>
  );
}
