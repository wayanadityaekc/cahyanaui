import { GRID_XPLORE, XPLORE_SECTION } from '@/components/ui/gridClasses';
import HomepageCard from '@/components/cards/HomepageCard';
import { EXPLORE_TOURS, EXPLORE_EXPERIENCES } from '@/content/shared/home';
import { BTN_PILL } from '@/components/ui/btnClasses';

// Homepage "Our Best Bali Program" (Sep 2026, Wayan: "keluarin card dari kategori,
// tour dan experience jadi satu"). It used to be two tabs - Tours | Experiences -
// which hid half the cards behind a tap and made the section look thinner than the
// catalogue actually is. Now it's one set of 8 (4 tours + 4 experiences), the same
// count Destinations has, so GRID_XPLORE lays it out identically: one slider on
// mobile, two rows of four on desktop. No tab state left, so this is a plain server
// component again - it does not ship any JS.
//
// One CTA instead of two: /programs.html is the page that actually lists both kinds
// together, which is the whole point of merging them here.
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
        <a href="/programs.html" className={BTN_PILL}>View all programs</a>
      </div>
    </section>
  );
}
