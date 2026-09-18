// Tailwind-native (migrasi): .habout* -> utilities 1:1 dari style.css. Overlay
// gelap (dulu ::before) pakai variant before:*. space-6/space-3 -> py-16/px-6.
const CLS = {
  section:
    "relative flex items-center justify-center min-h-[360px] px-[var(--container-x)] py-16 text-center bg-cover bg-center " +
    "before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(0,0,0,0.52),rgba(0,0,0,0.72))]",
  in: 'relative z-[2] max-w-[600px]',
  k: 'block mb-[0.55rem] text-label tracking-[0.14em] uppercase font-medium text-gold-l',
  t: 'mt-0 mb-[0.8rem] font-head text-h2 font-medium tracking-[-0.01em] leading-[1.15] text-white',
  lead: 'mx-auto mt-0 mb-[1.4rem] max-w-[520px] text-body leading-[1.6] text-[rgba(255,255,255,0.9)]',
  btn: 'inline-block px-[1.7rem] py-[0.8rem] rounded-pill font-body font-semibold text-h3 no-underline text-white bg-cta border border-cta hover:bg-cta-d',
};

// paired = the right half of the homepage's charter row (desktop only). The band
// stops being full-bleed there and becomes a card in its column: rounded, no
// forced height, and its text left-aligned because a narrow column reads better
// ragged-right than centred. Below 993px NOTHING changes - it is the full-width
// photo band it has always been, and that band is what gives the bottom of the
// homepage its rhythm (the gold dividers are off on this page).
const PAIRED =
  'min-[993px]:min-h-0 min-[993px]:h-full min-[993px]:rounded-lg min-[993px]:overflow-hidden ' +
  'min-[993px]:justify-start min-[993px]:text-left min-[993px]:p-[var(--space-5)] ' +
  'min-[993px]:[&_p]:mx-0';

export default function About({ paired = false }) {
  return (
    <section
      className={`${CLS.section}${paired ? ' ' + PAIRED : ''}`}
      id="about"
      style={{ backgroundImage: 'url(/assets/images/tegalalang-rice-terrace-hero.jpg)' }}
    >
      <div className={`${CLS.in}${paired ? ' min-[993px]:max-w-none' : ''}`}>
        <span className={CLS.k}>About Cahyana</span>
        <h2 className={CLS.t}>Local drivers, your whole trip</h2>
        <p className={CLS.lead}>
          Tours, driver, activities and villa from one team in Ubud - plan it once, ask one person, and see every price
          before you commit.
        </p>
        <a className={CLS.btn} href="/our-company.html#about">Read our story</a>
      </div>
    </section>
  );
}
