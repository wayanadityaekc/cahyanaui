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
    icon: <path d="m3 20 5-8 4 5 3-4 6 7Z" />,
  },
  {
    title: 'Balinese Culture & Temples',
    desc: 'Traditional ceremonies, sacred sites and local craft villages.',
    icon: <><path d="M12 3l7 3.2v5c0 4.5-3 8.2-7 9.6-4-1.4-7-5.1-7-9.6v-5L12 3Z" /></>,
  },
  {
    title: 'Nature & Waterfalls',
    desc: "Bali's waterfalls, jungle treks and rice terrace walks.",
    icon: <path d="M12 3v9M8 8l4-5 4 5M6 21c0-4 2.7-7 6-7s6 3 6 7" />,
  },
  {
    title: 'Wellness & Spa Day',
    desc: 'Spa mornings and slow days out, beyond the in-villa massage.',
    icon: <><circle cx="12" cy="12" r="8" /><path d="M9 12h6M12 9v6" /></>,
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <section className="relative">
        <div className="relative min-h-[42vh] flex items-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/ubudwalk9/1800/900"
            alt="Rice terraces near Ubud"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,20,16,0.2), rgba(20,20,16,0.6))' }} />
          <div className="container relative z-10 py-14">
            <p className="eyebrow" style={{ color: 'var(--color-gold-l)' }}>More Than Just A Stay</p>
            <h1 className="text-display font-bold max-w-lg" style={{ color: '#fff' }}>Experience the real Ubud</h1>
            <p className="mt-3 max-w-md text-small" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Discover the beauty of Ubud with curated experiences, from cultural tours to wellness and adventure - run by our sister brand, Cahyana Ubud Experience.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Popular Categories</p>
          <h2 className="text-h2 font-semibold" style={{ color: 'var(--color-gold)' }}>What guests usually add on</h2>
          <p className="mt-2 max-w-2xl text-small text-muted">
            These are illustrative categories, not a live booking list — exact tours, prices and availability are confirmed directly with Cahyana Ubud Experience, the local driver-and-tour team our family also runs.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {CATEGORIES.map((c) => (
              <div key={c.title} className="card p-6">
                <span className="icon-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {c.icon}
                  </svg>
                </span>
                <h3 className="text-h3 font-semibold mt-4" style={{ color: 'var(--color-gold)' }}>{c.title}</h3>
                <p className="text-small text-muted mt-1.5">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section text-center" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          <h2 className="text-h2 font-semibold" style={{ color: 'var(--color-gold)' }}>Ready to plan your Ubud stay?</h2>
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
