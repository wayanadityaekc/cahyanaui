import TransferPicker from '@/components/sections/TransferPicker';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import Price from '@/components/Price';
import DetailTinfo from '@/components/sections/DetailTinfo';
import { TRANSFER } from '@/content/shared/transfer';

// The transfer page body (hero + picker form + routes + info), extracted so
// both the /transfer route and the All Programs "Transfer" tab render the real
// interactive form instead of static cards.
// Tailwind-native (TW-A10, #331): .transfer-hero* -> utilities (dark overlay via
// before:*, same pattern as the shared charter-hero band in
// components/ui/charterHeroClasses.js - kept inline here instead of a shared
// module since `.transfer-hero` only ever had ONE consumer, unlike charter-hero's
// two). Old CSS also suppressed the auto section-divider on the hero itself AND
// on the routes section right after it (`.transfer-hero::before` /
// `.transfer-hero + section::before` both in the shared kill-list) - the hero's
// own before: now carries real content instead of `none`, and the routes
// section gets its own `before:content-none` since the adjacency selector can't
// key off a class name that no longer exists. The "Good to know" block (was
// TRANSFER.tinfoHtml, .tinfo__*) is now data + <DetailTinfo> utilities (TW-B4 #337).
export default function TransferSection() {
  return (
    <>
      <section
        className="relative min-h-[560px] flex items-center justify-center bg-cover bg-center pt-28 px-[1.3rem] pb-12 before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.55))]"
        style={{ backgroundImage: 'url(/assets/images/transfer-hero.webp)' }}
      >
        <div className="relative z-[2] w-full max-w-[560px] text-center">
          <h1 className="font-head font-medium tracking-[-0.01em] text-display leading-[1.15] text-white mb-[0.4rem]">{TRANSFER.title}</h1>
          <p className="text-[rgba(255,255,255,0.9)] text-body mx-auto mb-[1.6rem] max-w-[440px]">{TRANSFER.desc}</p>
          <TransferPicker />
        </div>
      </section>

      <section className="max-w-[960px] mx-auto mt-12 px-[1.3rem] before:content-none">
        <h2 className={SECTION_TITLE}>{TRANSFER.routesTitle}</h2>
        <p className="text-center text-muted text-[0.8rem] mt-[0.2rem] mb-[1.4rem]">{TRANSFER.routesNote}</p>
        <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-[0.6rem]">
          {TRANSFER.routes.map((r) => (
            <button type="button" className="flex items-center gap-3 border border-line rounded-md py-[0.55rem] px-[0.85rem] bg-white cursor-pointer text-left font-body w-full transition-[border-color] duration-[0.15s] hover:border-gold" key={r.key}>
              <span className="w-[46px] h-[46px] rounded-md bg-cover bg-center shrink-0" style={{ backgroundImage: `url(/assets/images/${r.bg})` }} />
              <span className="flex flex-col">
                <span className="font-semibold text-green text-h3">{r.name}</span>
                <span className="text-muted text-small mt-[0.1rem]">{r.meta}</span>
              </span>
              <Price name={r.priceName} fallback={r.priceFallback} className="ml-auto text-amber font-semibold" />
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-[820px] mx-auto py-12 px-[1.3rem]">
        <DetailTinfo facts={TRANSFER.tinfo.facts} included={TRANSFER.tinfo.included} excluded={TRANSFER.tinfo.excluded} />
      </section>
    </>
  );
}
