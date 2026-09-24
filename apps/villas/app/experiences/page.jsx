import { Flower2, Landmark, Mountain, Trees } from 'lucide-react';
import { GRID_QUAD } from '@/components/ui/gridClasses';
import { CUE_LINK, UBUD_GUIDE_LINK } from '@/lib/constants';

// Judgement call (see report): there is no real, ready-to-publish content
// for a standalone "Experiences" product on this site — actual tours and
// pricing live on the sister brand, Cahyana Ubud Experience. Rather than
// inventing specific experience names/prices to fill mockup-style cards,
// this page stays intentionally minimal: honest category teasers that are
// clearly illustrative, all pointing guests to CUE's real site rather than
// a fabricated booking flow of our own.
export const metadata = {
  title: 'Experiences Near Your Villa in Ubud | Ubud Private Villas by Cahyana Ubud',
  description: 'Pair your villa stay with real Ubud tours and experiences, run by our sister brand Cahyana Ubud Experience — temples, rice terraces, waterfalls and more.',
};

const CATEGORIES = [
  {
    title: 'Ubud Highlights',
    desc: 'Temples, rice terraces, waterfalls and the classic Ubud stops in one day.',
    Icon: Mountain,
  },
  {
    title: 'Balinese Culture & Temples',
    desc: 'Traditional ceremonies, sacred sites and local craft villages.',
    Icon: Landmark,
  },
  {
    title: 'Nature & Waterfalls',
    desc: "Bali's waterfalls, jungle treks and rice terrace walks.",
    Icon: Trees,
  },
  {
    title: 'Wellness & Spa Day',
    desc: 'Spa mornings and slow days out, beyond the in-villa massage.',
    Icon: Flower2,
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <section className="relative">
        <div className="relative min-h-[42vh] flex items-center overflow-hidden [background:linear-gradient(150deg,var(--color-gold),#2f2b24)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/ubudwalk9/1800/900"
            alt="Rice terraces near Ubud"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,20,16,0.2), rgba(20,20,16,0.6))' }} />
          <div className="wrap relative z-10 py-14">
            <p className="eyebrow text-gold-l">More Than Just A Stay</p>
            <h1 className="text-display font-bold max-w-lg text-white">Experience the real Ubud</h1>
            <p className="mt-3 max-w-md text-small text-white/85">
              Discover the beauty of Ubud with curated experiences, from cultural tours to wellness and adventure - run by our sister brand, Cahyana Ubud Experience.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Popular Categories</p>
          <h2 className="text-h2 font-semibold text-gold">What guests usually add on</h2>
          <p className="mt-2 max-w-2xl text-small text-muted">
            These are illustrative categories, not a live booking list — exact tours, prices and availability are confirmed directly with Cahyana Ubud Experience, the local driver-and-tour team our family also runs.
          </p>

          <div className={`${GRID_QUAD} mt-8`}>
            {CATEGORIES.map((c) => (
              <div key={c.title} className="card p-6">
                <span className="icon-circle">
                  <c.Icon className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <h3 className="text-h3 font-semibold mt-4 text-gold">{c.title}</h3>
                <p className="text-small text-muted mt-1.5">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section text-center bg-cream">
        <div className="wrap">
          <h2 className="text-h2 font-semibold text-gold">Ready to plan your Ubud stay?</h2>
          <p className="mt-2 text-small text-muted max-w-md mx-auto">
            See real tours, upfront pricing and availability on Cahyana Ubud Experience, or start with our Ubud guide.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a href={CUE_LINK} target="_blank" rel="noopener" className="btn btn-cta">Browse tours &amp; experiences</a>
            <a href={UBUD_GUIDE_LINK} target="_blank" rel="noopener" className="btn btn-outline">Read the Ubud guide</a>
          </div>
        </div>
      </section>
    </>
  );
}
