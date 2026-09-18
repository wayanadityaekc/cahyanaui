// The 4-cell spec strip ("Availability 24/7", "Capacity up to 5 pax", ...) that
// opens the details card on the transfer and airport pages.
//
// Lifted out of the old <DetailTinfo> (Sep 2026) when those two pages were
// rebuilt on the charter page's shell. It used to sit LOOSE on the page
// background above a separate white card - the same "two treatments of one
// thing" the charter page had already been cured of. It now lives inside the
// card with everything else, rendered through the Prose 'facts' block so all
// three pages compose their details the same way.
//
// Radius is --r-md to match the include/exclude boxes below it (it was --r-lg
// on its own, which read as a different family), and there is no max-width or
// mx-auto any more: the card decides the width now.
export default function InfoFacts({ items }) {
  return (
    <div className="flex flex-wrap [border:1px_solid_var(--line)] rounded-[var(--r-md)] overflow-hidden mt-[0.4rem] mb-[var(--space-4)]">
      {items.map((f) => (
        <div
          className="flex-[1_1_0px] min-w-[130px] text-center py-[0.9rem] px-[0.8rem] [border-right:1px_solid_var(--line)] last:[border-right:none]"
          key={f.label}
        >
          <span className="block text-[length:var(--fs-small)] font-normal text-muted">{f.label}</span>
          <strong className="block mt-[0.2rem] font-body text-[length:var(--fs-small)] font-medium text-[var(--color-ink)] min-[769px]:text-[length:var(--fs-h3)]">
            {f.value}
          </strong>
        </div>
      ))}
    </div>
  );
}
