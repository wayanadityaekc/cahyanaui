import HomepageCard from '@/components/cards/HomepageCard';
import { HOME_DESTINATIONS } from '@/content/shared/home';

export default function Destinations() {
  return (
    <section className="xplore" id="destinations-home">
      <div className="xplore__head">
        <div className="xplore__intro">
          <h2 className="xplore__t">Popular Bali Destinations</h2>
        </div>
      </div>
      <div className="experience__grid experience__grid--home4">
        {HOME_DESTINATIONS.map((c) => (
          <HomepageCard key={c.name} {...c} />
        ))}
      </div>
      <div className="xplore__more">
        <a href="/destinations.html" className="btn-pill">View all destinations</a>
      </div>
    </section>
  );
}
