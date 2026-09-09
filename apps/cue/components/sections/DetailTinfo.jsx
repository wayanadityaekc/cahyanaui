// "Good to know" block for transfer / airport detail pages (TW-B4 #337).
// Was a raw HTML string (TRANSFER.tinfoHtml / AIRPORT.tinfoHtml) carrying
// .tinfo__facts / .tinfo__fact / .tinfo__cols / .tinfo__col - now data + this
// self-contained component with the styling as Tailwind utilities (those .tinfo*
// CSS rules are removed from style.css). Kept as classes on purpose (out of
// scope, other issues own them): .section__title (B-FINAL) and
// .info__list--yes/--no (B-FINAL checklist bullet).
//
// Utility map (1:1 with the removed CSS):
//   .tinfo__facts = flex flex-wrap [border:1px_solid_var(--line)] rounded-[var(--r-lg)]
//                   overflow-hidden max-w-[720px] mt-[0.4rem] mx-auto mb-[2.2rem]
//   .tinfo__fact  = flex-[1_1_0px] min-w-[130px] text-center py-[0.9rem] px-[0.8rem]
//                   [border-right:1px_solid_var(--line)] last:[border-right:none]
//   .tinfo__fact span    = block text-[length:var(--fs-small)] font-normal text-muted
//   .tinfo__fact strong  = block mt-[0.2rem] font-body text-[length:var(--fs-small)]
//                          font-medium text-[var(--color-ink)] min-[769px]:text-[length:var(--fs-h3)]
//   .tinfo__cols  = grid grid-cols-2 gap-10 max-w-[720px] mx-auto
//                   max-[768px]:grid-cols-1 max-[768px]:gap-[1.3rem]
//   .tinfo__col h3 = font-body text-[0.8rem] font-semibold uppercase tracking-[0.14em]
//                    text-muted mb-[0.8rem]
export default function DetailTinfo({ facts, included, excluded }) {
  return (
    <>
      <h2 className="section__title">Good to know</h2>
      <div className="flex flex-wrap [border:1px_solid_var(--line)] rounded-[var(--r-lg)] overflow-hidden max-w-[720px] mt-[0.4rem] mx-auto mb-[2.2rem]">
        {facts.map((f) => (
          <div className="flex-[1_1_0px] min-w-[130px] text-center py-[0.9rem] px-[0.8rem] [border-right:1px_solid_var(--line)] last:[border-right:none]" key={f.label}>
            <span className="block text-[length:var(--fs-small)] font-normal text-muted">{f.label}</span>
            <strong className="block mt-[0.2rem] font-body text-[length:var(--fs-small)] font-medium text-[var(--color-ink)] min-[769px]:text-[length:var(--fs-h3)]">{f.value}</strong>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-10 max-w-[720px] mx-auto max-[768px]:grid-cols-1 max-[768px]:gap-[1.3rem]">
        <div>
          <h3 className="font-body text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted mb-[0.8rem]">What&apos;s included</h3>
          <ul className="info__list info__list--yes">
            {included.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-body text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted mb-[0.8rem]">What&apos;s excluded</h3>
          <ul className="info__list info__list--no">
            {excluded.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        </div>
      </div>
    </>
  );
}
