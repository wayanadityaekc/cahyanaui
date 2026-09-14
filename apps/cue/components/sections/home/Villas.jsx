import { ArrowUpRight } from 'lucide-react';

// Tailwind-native (migrasi): .vpromo* -> utilities 1:1 dari style.css. Overlay
// (dulu ::after) pakai variant after:*. 2 foto villa side-by-side (grid 2 kolom)
// jadi tumpuk atas-bawah di <=768px persis media query lama. Judul level-halaman
// (2.1rem, sengaja non-token) -> text-[2.1rem], mengecil ke 1.7rem di HP.
const CLS = {
  section:
    "relative min-h-[420px] flex items-center justify-center text-center px-6 py-12 max-[768px]:min-h-[380px] " +
    "after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(20,28,23,0.55),rgba(20,28,23,0.72))]",
  bg: 'absolute inset-0 grid grid-cols-2 max-[768px]:grid-cols-1 max-[768px]:grid-rows-2',
  bgTile: 'bg-cover bg-center',
  inner: 'relative z-[2] max-w-[580px]',
  kick: 'block text-label tracking-[0.14em] uppercase font-medium text-gold-l',
  title: 'font-head font-medium tracking-[-0.01em] text-[2.1rem] leading-[1.15] text-white mt-[0.5rem] mb-[0.8rem] max-[768px]:text-[1.7rem]',
  desc: 'text-[rgba(255,255,255,0.9)] text-body leading-[1.7] mt-0 mb-[1.6rem]',
  cta: 'inline-flex items-center gap-2 px-[1.7rem] py-[0.85rem] rounded-pill font-body font-semibold text-h3 no-underline bg-white text-green hover:bg-cta hover:text-white [&>svg]:w-4 [&>svg]:h-4',
};

export default function Villas() {
  return (
    <section className={CLS.section} id="villas">
      <div className={CLS.bg} aria-hidden="true">
        <div className={CLS.bgTile} style={{ backgroundImage: 'url(/assets/images/cahyana-house.webp)' }} />
        <div className={CLS.bgTile} style={{ backgroundImage: 'url(/assets/images/cahyana-tibuah.webp)' }} />
      </div>
      <div className={CLS.inner}>
        <span className={CLS.kick}>Stay with us in Ubud</span>
        <h2 className={CLS.title}>Ubud Private Villas</h2>
        <p className={CLS.desc}>
          Two private pool villas - Cahyana House and Cahyana Tibuah - hosted by the same family behind your tours. Ask
          about tour + stay perks.
        </p>
        <a className={CLS.cta} href="https://ubudprivatevillas.com" target="_blank" rel="noopener">
          Visit ubudprivatevillas.com
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
