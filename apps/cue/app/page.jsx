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
    'Plan your whole Bali trip in one place - private tours, airport transfers, experiences and villas from a local Ubud family, with every price upfront.',
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
      <CharterHome />
      <About />
      <Trust cream />
      <GuestReviews />
    </div>
  );
}
