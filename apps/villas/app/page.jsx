import Link from 'next/link';
import { ShieldCheck, Users, Waves } from 'lucide-react';
import VillaCard from '@/components/cards/VillaCard';
import ServiceCard from '@/components/cards/ServiceCard';
import ReviewCard from '@/components/cards/ReviewCard';
import SearchCard from '@/components/sections/SearchCard';
import CheckAvailabilityButton from '@/components/booking/CheckAvailabilityButton';
import CharterCard from '@/components/sections/CharterCard';
import { VILLA_LIST } from '@/lib/villas';
import { OVERALL_RATING, OVERALL_REVIEW_COUNT, REVIEW_CARDS } from '@/lib/reviews';
import {
  Button,
  CAPS,
  EYEBROW_LINE,
  GRID_PAIR,
  GRID_TRIO,
  Hero,
  ICON_CIRCLE,
  JsonLd,
  MediaCard,
  STARS,
  Section,
  SectionHeading,
  SplitFeature,
} from '@cahyana/ui';
import { EXPLORE_MORE, STAY_ADDONS } from '@/content/crossSell';
import { buildPageMeta } from '@/lib/seo';
import { buildSiteSchema } from '@/lib/schema';

export const metadata = buildPageMeta({
  title: 'Private Pool Villas in Ubud, Bali | Ubud Private Villas',
  description:
    'Two private pool villas in north Ubud, Bali: a 3-bedroom family house and a 2-bedroom ricefield villa. Both rated 4.96 on Airbnb, 10 minutes from Ubud Palace.',
  path: '/',
});

const WHY_STAY = [
  { title: 'Private Pool', desc: 'Enjoy your own pool, surrounded by tropical greenery.', Icon: Waves },
  { title: 'Local Hosting', desc: 'Our family is here to make your stay feel like home.', Icon: Users },
  { title: 'Transparent Pricing', desc: 'No hidden fees. What you see is what you pay.', Icon: ShieldCheck },
];

const SERVICES_HOME = [
  {
    href: '/services/spa',
    eyebrow: 'At Your Villa',
    title: 'Spa & Massage',
    lede: 'Local therapists come to you. Book a Balinese massage on your own terrace instead of going out for one - no taxi afterwards.',
    cta: 'Spa & Massage',
  },
  {
    href: '/services/breakfast',
    eyebrow: 'At Your Villa',
    title: 'Breakfast',
    lede: 'Cooked fresh in your own kitchen each morning, Balinese or western, at whatever hour suits you. Floating breakfast in the pool on request.',
    cta: 'See breakfast',
  },
  {
    href: '/services/scooter-rental',
    eyebrow: 'Getting Around',
    title: 'Scooter Rental',
    lede: 'A scooter delivered to the villa and collected at the end, with helmets. The easiest way to reach the rice fields and the warungs off the main road.',
    cta: 'Scooter rental',
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildSiteSchema(VILLA_LIST)} />
      <Hero
        size="page"
        image="/images/cahyana-tibuah.webp"
        alt="Cahyana Tibuah pool at dusk, surrounded by rice fields"
        eyebrow="Ubud Private Villas by Cahyana Ubud Experience"
        title="A private retreat in the heart of Bali"
        lede="Two exclusive villas, designed for comfort, privacy and a true Balinese experience."
      >
        <div className="mt-8 min-[993px]:mt-0 min-[993px]:absolute min-[993px]:top-1/2 min-[993px]:-translate-y-1/2 min-[993px]:right-[var(--container-x)] min-[993px]:w-[22rem]">
          <SearchCard layout="panel" />
        </div>
      </Hero>

      <Section id="villas" tone="cream">
        <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-end mb-9">
          <div>
            <p className={EYEBROW_LINE}>Our Villas</p>
            <h2 className="text-h2 font-medium text-gold">Two private villas in north Ubud</h2>
          </div>
          <p className="text-small leading-[1.45] text-green">
            Each villa is thoughtfully designed with a private pool, open living space and a calming view of the
            tropical gardens. Whether you&apos;re here for a romantic escape or a family getaway, you&apos;ll find your
            place in Ubud.
          </p>
        </div>
        <div className={GRID_PAIR}>
          <VillaCard villa={VILLA_LIST[0]} className="min-[993px]:order-1" />

          <div className="p-7 sm:p-9 bg-surface-raised grid sm:grid-cols-3 gap-8 min-[993px]:order-3 min-[993px]:col-span-2 min-[993px]:mt-[1.1rem]">
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

          <VillaCard villa={VILLA_LIST[1]} className="min-[993px]:order-2" />
        </div>
      </Section>

      <Hero
        size="band"
        as="h2"
        titleSize="h2"
        image="/images/tegalalang-rice-terrace.jpg"
        alt="Tegalalang Rice Terrace, a stop on a full-day Ubud tour with our sister brand"
        eyebrow={EXPLORE_MORE.eyebrow}
        title={EXPLORE_MORE.title}
        lede={EXPLORE_MORE.lede}
        actions={
          <Button as="a" variant="light" href={EXPLORE_MORE.href} target="_blank" rel="noopener">
            {EXPLORE_MORE.cta}
          </Button>
        }
      />

      {SERVICES_HOME.map((service, index) => (
        <SplitFeature
          key={service.href}
          tone={index % 2 === 0 ? 'cream' : 'plain'}
          reverse={index % 2 === 1}
          image={service.img}
          alt={service.alt}
          eyebrow={service.eyebrow}
          title={service.title}
          lede={service.lede}
          actions={
            <Button as={Link} href={service.href}>
              {service.cta}
            </Button>
          }
        />
      ))}

      <Section>
        <p className={EYEBROW_LINE}>Guest Reviews</p>
        <h2 className="text-h2 font-medium text-gold">What our guests say</h2>
        <p className="mt-2 text-small leading-[1.45] text-green">Real experiences from people who stayed with us.</p>
        <p className="mt-4 flex items-center gap-2 text-h3 font-semibold text-gold">
          {OVERALL_RATING}/5
          <span className={STARS}>★★★★★</span>
          <span className="text-small text-muted font-normal">from {OVERALL_REVIEW_COUNT}+ reviews</span>
        </p>

        <div className={`${GRID_TRIO} mt-7`}>
          {REVIEW_CARDS.map((card, index) => (
            <ReviewCard key={index} card={card} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Add to your reservation"
          title="Make it more than a room"
          lede="Booked with your stay, arranged before you land. Nothing here needs a second conversation."
          className="mb-8"
        />
        <div className={GRID_TRIO}>
          {STAY_ADDONS.map((addon) => (
            <MediaCard
              key={addon.id}
              as={addon.external ? 'a' : Link}
              href={addon.href}
              {...(addon.external ? { target: '_blank', rel: 'noopener' } : {})}
              image={{ src: addon.img, alt: addon.alt, width: 700, height: 525, ratio: 'aspect-[4/3]' }}
              footer={
                <span className={`${CAPS} text-cta`}>
                  {addon.cta}
                  <span aria-hidden="true"> &rsaquo;</span>
                </span>
              }
            >
              <p className={`${CAPS} text-muted`}>{addon.eyebrow}</p>
              <h3 className="text-h3 font-semibold text-gold">{addon.label}</h3>
              <p className="text-small text-muted">{addon.blurb}</p>
            </MediaCard>
          ))}
        </div>
      </Section>

      <Section tone="cream" id="private-driver">
        <div className="max-w-[44rem]">
          <CharterCard />
        </div>
      </Section>

      <Section tone="dark" className="text-center">
        <h2 className="text-h2 font-medium text-white">Dates in mind?</h2>
        <p className="mt-2 text-small text-white/75">
          Open the booking flow, or message us and we&apos;ll tell you straight if it&apos;s free.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <CheckAvailabilityButton variant="onDark" />
          <Button as={Link} variant="light" href="/services/scooter-rental">
            Scooter rental
          </Button>
        </div>
      </Section>
    </>
  );
}
