// Tailwind-native (migrasi): .habout* -> utilities 1:1 dari style.css. Overlay
// gelap (dulu ::before) pakai variant before:*. space-6/space-3 -> py-16/px-6.
const CLS = {
  section:
    "relative flex items-center justify-center min-h-[360px] px-6 py-16 text-center bg-cover bg-center " +
    "before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(0,0,0,0.52),rgba(0,0,0,0.72))]",
  in: 'relative z-[2] max-w-[600px]',
  k: 'block mb-[0.55rem] text-label tracking-[0.14em] uppercase font-medium text-gold-l',
  t: 'mt-0 mb-[0.8rem] font-head text-h2 font-medium tracking-[-0.01em] leading-[1.15] text-white',
  lead: 'mx-auto mt-0 mb-[1.4rem] max-w-[520px] text-body leading-[1.6] text-[rgba(255,255,255,0.9)]',
  btn: 'inline-block px-[1.7rem] py-[0.8rem] rounded-pill font-body font-semibold text-h3 no-underline text-white bg-cta border border-cta hover:bg-cta-d',
};

export default function About() {
  return (
    <section
      className={CLS.section}
      id="about"
      style={{ backgroundImage: 'url(/assets/images/tegalalang-rice-terrace-hero.jpg)' }}
    >
      <div className={CLS.in}>
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
