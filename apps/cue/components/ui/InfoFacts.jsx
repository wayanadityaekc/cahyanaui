import { CHIP, chipIcon } from '@/components/ui/chipClasses';

// The spec facts that open a details block: "24/7", "Up to 5 pax", "Door to
// door", "English-speaking driver".
//
// CHIPS, not a box (Sep 2026, Wayan: "box untuk availability, capacity dll ganti
// bro gua gamau isi box gitu"). It used to be a 4-cell bordered grid, which was
// a second kind of container on a page that had just been reduced to one. Chips
// are already this site's way of stating exactly this kind of fact - the tour,
// destination and guide heroes all do it - so this is the existing vocabulary
// applied to the pages that had not caught up, not a new shape.
//
// The chip prints the VALUE only, so every value has to stand on its own; the
// LABEL picks the icon (see chipClasses). That is why "English" became
// "English-speaking driver" and "At arrivals" became "Meet & greet at arrivals"
// in the content files - a lone "English" under a Languages icon says nothing.
//
// Wrapping beats the old grid on a phone: each chip drops whole, where the
// 4-column grid left a lone cell on a second row and a single dot-separated
// line broke mid-phrase.
export default function InfoFacts({ items }) {
  return (
    <ul className="list-none flex flex-wrap items-center gap-[0.45rem] m-0 mb-[var(--space-4)] p-0">
      {items.map((f) => {
        const Icon = chipIcon(f.label);
        return (
          <li className={CHIP} key={f.label}>
            <Icon aria-hidden="true" strokeWidth={1.7} />
            <span>{f.value}</span>
          </li>
        );
      })}
    </ul>
  );
}
