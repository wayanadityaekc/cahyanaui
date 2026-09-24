import { BTN_SM } from '@/components/ui/btnClasses';
import Price from '@/components/Price';

// Tailwind-native (migrasi): utilities dipetakan 1:1 dari .airport* di style.css.
// Overlay gelap (dulu ::after) pakai variant after:* - gradient horizontal di
// desktop, ganti ke vertikal lebih gelap di <=560px persis media query lama.
// (.airport__price .price-unit di CSS lama = dead di React: <Price> gak render
// .price-unit, cuma renderPrices JS situs lama yang nambahin.)
const CLS = {
  section:
    "relative overflow-hidden bg-cover bg-center py-8 text-white " +
    "after:content-[''] after:absolute after:inset-0 " +
    'after:bg-[linear-gradient(90deg,rgba(20,19,15,0.86)_0%,rgba(20,19,15,0.62)_55%,rgba(20,19,15,0.35)_100%)] ' +
    'max-[560px]:after:bg-[linear-gradient(180deg,rgba(20,19,15,0.72)_0%,rgba(20,19,15,0.82)_100%)]',
  inner: 'relative z-[1] max-w-[var(--container)] mx-auto px-[var(--container-x)]',
  body: 'max-w-[560px]',
  k: 'block uppercase tracking-[0.14em] text-label text-gold-l mb-[0.6rem]',
  t: 'font-head text-[1.6rem] font-semibold tracking-[-0.01em] leading-[1.15] mt-0 mb-[0.7rem]',
  lead: 'text-body leading-[1.6] text-[rgba(247,243,234,0.85)] mt-0 mb-[1.3rem] max-w-[46ch]',
  chips: 'flex flex-wrap gap-[0.6rem] mb-6',
  chip: 'text-small bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.18)] rounded-sm px-[0.85rem] py-[0.35rem]',
  row: 'flex items-center gap-[1.1rem] flex-wrap',
  price: 'text-small text-[rgba(247,243,234,0.85)]',
  amt: 'text-[1.35rem] font-semibold text-amber',
  btn: `inline-flex ${BTN_SM} gap-[0.4rem] bg-cta text-white no-underline transition-[color,background-color,border-color,scale] duration-200 ease-in-out hover:bg-cta-d`,
};

export default function Airport() {
  return (
    <section
      className={CLS.section}
      id="airport-pickup"
      style={{ backgroundImage: 'url(/assets/images/transfer-hero.webp)' }}
    >
      <div className={CLS.inner}>
        <div className={CLS.body}>
          <span className={CLS.k}>Airport Pickup</span>
          <h2 className={CLS.t}>Land in Bali, we&apos;re already there</h2>
          <p className={CLS.lead}>
            Private car from Ngurah Rai (DPS) to your Ubud stay. Fixed price, meet &amp; greet at arrivals, sorted
            before you even land.
          </p>
          <div className={CLS.chips}>
            <span className={CLS.chip}>Meet &amp; greet</span>
            <span className={CLS.chip}>Fixed price per car</span>
            <span className={CLS.chip}>Local Ubud driver</span>
          </div>
          <div className={CLS.row}>
            <span className={CLS.price}>
              from <Price name="Airport – Ubud" fallback="$26" className={CLS.amt} as="b" />
            </span>
            {/* Anchor text carries the keyword on purpose: this band is the main
                internal link to /airport-transfer, and "Book a transfer" told
                Google nothing about what is on the other end. */}
            <a className={CLS.btn} href="/airport-transfer.html">
              Airport transfer &rsaquo;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
