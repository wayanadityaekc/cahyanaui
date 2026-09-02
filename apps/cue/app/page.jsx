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

export const metadata = {
  title: 'Bali Trip Planner with a Private Driver | Cahyana Ubud Experience',
  description:
    'Plan your whole Bali trip in one place - private tours, airport transfers, experiences and villas from a local Ubud family, with every price upfront.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <div className="home">
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
      <Trust />
      <div id="reviews-placeholder" />
    </div>
  );
}
