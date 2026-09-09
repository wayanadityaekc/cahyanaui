import HomepageCard from '@/components/cards/HomepageCard';
import { HOME_DESTINATIONS } from '@/content/shared/home';
import { BTN_PILL } from '@/components/ui/btnClasses';

export default function Destinations() {
  return (
    <section className="xplore" id="destinations-home">
      <div className="flex justify-between items-end gap-8 flex-wrap mb-[2.2rem] max-[768px]:mb-[1.6rem]">
        <div>
          <h2 className="font-head font-medium tracking-[-0.01em] text-h2 leading-[var(--lh-heading)] text-gold m-0">Popular Bali Destinations</h2>
        </div>
      </div>
      <div className="experience__grid experience__grid--home4">
        {HOME_DESTINATIONS.map((c) => (
          <HomepageCard key={c.name} {...c} />
        ))}
      </div>
      <div className="mt-8 text-right max-[768px]:mt-[1.6rem]">
        <a href="/destinations.html" className={BTN_PILL}>View all destinations</a>
      </div>
    </section>
  );
}
