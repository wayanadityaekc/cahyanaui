import TransferPicker from '@/components/sections/TransferPicker';
import Price from '@/components/Price';
import { TRANSFER } from '@/content/shared/transfer';

export const metadata = {
  title: 'Bali Airport Transfer to Ubud | Private Car, Fixed Prices',
  description:
    'Private car transfers between Ubud and Bali\'s airport, beaches, and regions. Fixed prices per car, local drivers, door-to-door comfort.',
  alternates: { canonical: '/transfer.html' },
};

export default function Page() {
  return (
    <>
      <section className="transfer-hero">
        <div className="transfer-hero__inner">
          <h1 className="transfer-hero__title">{TRANSFER.title}</h1>
          <p className="transfer-hero__desc">{TRANSFER.desc}</p>
          <TransferPicker />
        </div>
      </section>

      <section className="troutes">
        <h2 className="section__title">{TRANSFER.routesTitle}</h2>
        <p className="troutes__note">{TRANSFER.routesNote}</p>
        <div className="troutes__list">
          {TRANSFER.routes.map((r) => (
            <button type="button" className="troute" key={r.key}>
              <span className="troute__th" style={{ backgroundImage: `url(/assets/images/${r.bg})` }} />
              <span className="troute__info">
                <span className="troute__name">{r.name}</span>
                <span className="troute__meta">{r.meta}</span>
              </span>
              <Price name={r.priceName} fallback={r.priceFallback} className="troute__pr price" />
            </button>
          ))}
        </div>
      </section>

      <section className="tinfo" dangerouslySetInnerHTML={{ __html: TRANSFER.tinfoHtml }} />
    </>
  );
}
