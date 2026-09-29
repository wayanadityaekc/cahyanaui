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
  // Every section after the Hero gets the uniform --section-gap top margin and mb-0, so only the top margin spaces it.
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
      {/* Charter + About share one 2-column row from 993px; a div (not a section) so the section rhythm rule skips it. */}
      <div className="mt-[var(--section-gap)] flex flex-col gap-[var(--section-gap)] min-[993px]:gap-[var(--space-3)] min-[993px]:grid min-[993px]:grid-cols-[1.35fr_1fr] min-[993px]:items-stretch min-[993px]:max-w-[var(--container)] min-[993px]:mx-auto min-[993px]:px-[var(--container-x)]">
        <CharterHome paired />
        <About paired />
      </div>
      <Trust cream />
      <GuestReviews />
    </div>
  );
}
