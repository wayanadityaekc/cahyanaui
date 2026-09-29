import { GRID_XPLORE, XPLORE_SECTION } from '@/components/ui/gridClasses';
import HomepageCard from '@/components/cards/HomepageCard';
import { EXPLORE_TOURS, EXPLORE_EXPERIENCES } from '@/content/shared/home';
import { BTN_PILL } from '@/components/ui/btnClasses';

// Homepage program section: 4 tours + 4 experiences in one grid (server component); CTA goes to /tour.html, not /programs.
const CARDS = [...EXPLORE_TOURS, ...EXPLORE_EXPERIENCES];

export default function Explore() {
  return (
    <section className={XPLORE_SECTION} id="explore">
      <div className="flex justify-between items-end gap-8 flex-wrap mb-[2.2rem] max-[768px]:mb-[1.6rem]">
        <div>
          <h2 className="font-head font-medium tracking-[-0.01em] text-h2 leading-[var(--lh-heading)] text-gold m-0">Our Best Bali Program</h2>
        </div>
      </div>
      <div className={GRID_XPLORE}>
        {CARDS.map((c) => (
          <HomepageCard key={c.href + c.name} {...c} />
        ))}
      </div>
      <div className="mt-8 text-right max-[768px]:mt-[1.6rem]">
        <a href="/tour.html" className={BTN_PILL}>All tours</a>
      </div>
    </section>
  );
}
