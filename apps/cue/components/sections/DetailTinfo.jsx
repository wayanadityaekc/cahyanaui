import { SECTION_TITLE } from '@/components/ui/sectionTitle';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';
// "Good to know" block for transfer / airport detail pages (TW-B4 #337).
// Was a raw HTML string (TRANSFER.tinfoHtml / AIRPORT.tinfoHtml) carrying
// .tinfo__facts / .tinfo__fact / .tinfo__cols / .tinfo__col - now data + this
// self-contained component with the styling as Tailwind utilities (those .tinfo*
// CSS rules are removed from style.css). Kept as a class on purpose (out of
// scope, another issue owns it): .section__title (B-FINAL).
//
// The included/excluded pair is <InfoBoxes> (Sep 2026, Wayan: option B, and
// "biar bisa di pakai juga di page transfer") - the SAME component the charter
// details body uses, so transfer, airport and charter cannot drift apart. The
// old marker lists and the uppercase column labels went with it; the box title
// is now the shared one.
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
      <h2 className={SECTION_TITLE}>Good to know</h2>
      <div className="flex flex-wrap [border:1px_solid_var(--line)] rounded-[var(--r-lg)] overflow-hidden max-w-[720px] mt-[0.4rem] mx-auto mb-[2.2rem]">
        {facts.map((f) => (
          <div className="flex-[1_1_0px] min-w-[130px] text-center py-[0.9rem] px-[0.8rem] [border-right:1px_solid_var(--line)] last:[border-right:none]" key={f.label}>
            <span className="block text-[length:var(--fs-small)] font-normal text-muted">{f.label}</span>
            <strong className="block mt-[0.2rem] font-body text-[length:var(--fs-small)] font-medium text-[var(--color-ink)] min-[769px]:text-[length:var(--fs-h3)]">{f.value}</strong>
          </div>
        ))}
      </div>
      {/* the good-to-know block is capped at 720px - keep that cap on the pair */}
      <div className="max-w-[720px] mx-auto">
        <InfoBoxes>
          <InfoBox title="What's included">
            <InfoBoxList items={included} />
          </InfoBox>
          <InfoBox title="What's excluded" variant="no">
            <InfoBoxList items={excluded} variant="no" />
          </InfoBox>
        </InfoBoxes>
      </div>
    </>
  );
}
