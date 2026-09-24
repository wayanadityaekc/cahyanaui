import Hero from '@/components/sections/home/Hero';
import JsonLd from '@/components/JsonLd';
import Explore from '@/components/sections/home/Explore';
import Airport from '@/components/sections/home/Airport';
import Destinations from '@/components/sections/home/Destinations';
import WhyUs from '@/components/sections/home/WhyUs';
import GuideHome from '@/components/sections/home/GuideHome';
import Villas from '@/components/sections/home/Villas';
import CharterHome from '@/components/sections/home/CharterHome';
import About from '@/components/sections/home/About';
import Trust from '@/components/sections/home/Trust';
import GuestReviews from '@/components/sections/GuestReviews';

export const metadata = {
  title: 'Bali Trip Planner with a Private Driver | Cahyana Ubud Experience',
  description:
    'Plan your whole Bali trip in one place - private tours, airport transfers, experiences and villas from local Ubud drivers, with every price upfront.',
  alternates: { canonical: '/' },
};

export default function Home() {
  // Homepage section rhythm (was `.home > section:not(.hero){margin-top:--section-gap;
  // margin-bottom:0}`): every direct-child <section> except the first (Hero) gets the
  // uniform gap AND has its bottom margin forced to 0 (so a section's own my-* - e.g.
  // charter's my-[space-5] - doesn't add extra space; the gap is purely the top margin).
  // Hero is the first section child (the JsonLd script isn't a section), so
  // :not(:first-of-type) targets exactly the same set as the old :not(.hero).
  return (
    <div className="[&>section:not(:first-of-type)]:mt-[var(--section-gap)] [&>section:not(:first-of-type)]:mb-0">
      <JsonLd page="index" />
      <Hero />
      <Explore />
      <Airport />
      <Destinations />
      <WhyUs />
      <GuideHome />
      <Villas />
      {/* Charter and About share ONE row from 993px (Sep 2026, Wayan: "khusus
          desktop charter dan section di bawah charter jadiin 2 kolom", after seeing
          the mockup). A div, not a section, so the page's own section rhythm rule
          skips it and the pair is spaced once, here.
          Below 993px this is just a column: the charter panel, then the About band
          full-bleed exactly as before. */}
      <div className="mt-[var(--section-gap)] flex flex-col gap-[var(--section-gap)] min-[993px]:gap-[var(--space-3)] min-[993px]:grid min-[993px]:grid-cols-[1.35fr_1fr] min-[993px]:items-stretch min-[993px]:max-w-[var(--container)] min-[993px]:mx-auto min-[993px]:px-[var(--container-x)]">
        <CharterHome paired />
        <About paired />
      </div>
      <Trust cream />
      <GuestReviews />
    </div>
  );
}
