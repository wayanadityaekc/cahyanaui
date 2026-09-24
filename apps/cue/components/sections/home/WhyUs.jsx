import { WHY_US } from '@/content/shared/home';

// Tailwind-native (migrasi): utilities dipetakan 1:1 dari .whyus* di style.css.
// space token -> numeric utility yang nilainya sama (space-5 3rem=py-12,
// container-x 1.5rem=px-6, space-4 2rem=gap-8/mb-8, space-3 1.5rem=gap-x-6).
// Grid jadi 2 kolom di <=760px persis media query lama. Ikon = komponen Lucide
// dari WHY_US, ukurannya di-set lewat variant [&>svg].
const CLS = {
  section: 'bg-cream',
  in: 'max-w-[var(--container)] mx-auto px-[var(--container-x)] py-12',
  head: 'text-center mb-8',
  k: 'block uppercase tracking-[0.14em] text-label text-muted mb-[0.4rem]',
  t: 'font-head text-h2 font-medium tracking-[-0.01em] m-0 text-gold',
  grid: 'grid grid-cols-4 gap-8 max-[760px]:grid-cols-2 max-[760px]:gap-y-8 max-[760px]:gap-x-6',
  col: 'text-center',
  ic: 'inline-flex items-center justify-center w-[3.25rem] h-[3.25rem] rounded-[50%] bg-white text-cta mb-[0.8rem] [&>svg]:w-6 [&>svg]:h-6',
  h3: 'font-body text-strong font-semibold mb-[0.35rem] text-gold',
  p: 'text-body leading-[1.55] text-muted',
};

export default function WhyUs() {
  return (
    <section className={CLS.section} id="why-us">
      <div className={CLS.in}>
        <div className={CLS.head}>
          <span className={CLS.k}>Why Cahyana</span>
          <h2 className={CLS.t}>Clear prices, local team, your plan</h2>
        </div>
        <div className={CLS.grid}>
          {WHY_US.map((c) => (
            <div className={CLS.col} key={c.title}>
              <span className={CLS.ic}><c.Icon strokeWidth={1.6} /></span>
              <h3 className={CLS.h3}>{c.title}</h3>
              <p className={CLS.p}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
