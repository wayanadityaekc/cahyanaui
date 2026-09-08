import TransferPicker from '@/components/sections/TransferPicker';
import Price from '@/components/Price';
import { TRANSFER } from '@/content/shared/transfer';

// The transfer page body (hero + picker form + routes + info), extracted so
// both the /transfer route and the All Programs "Transfer" tab render the real
// interactive form instead of static cards.
export default function TransferSection() {
  return (
    <>
      <section className="transfer-hero">
        <div className="transfer-hero__inner">
          <h1 className="transfer-hero__title">{TRANSFER.title}</h1>
          <p className="transfer-hero__desc">{TRANSFER.desc}</p>
          <TransferPicker />
        </div>
      </section>

      <section className="max-w-[960px] mx-auto mt-12 px-[1.3rem]">
        <h2 className="section__title">{TRANSFER.routesTitle}</h2>
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

      <section className="max-w-[820px] mx-auto py-12 px-[1.3rem]" dangerouslySetInnerHTML={{ __html: TRANSFER.tinfoHtml }} />
    </>
  );
}
