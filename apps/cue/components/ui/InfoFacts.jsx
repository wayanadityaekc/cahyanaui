import { CHIP, pickChipIcon } from '@/components/ui/chipClasses';

const ICON_STROKE_WIDTH_REGULAR = 1.7;

export default function InfoFacts({ items }) {
  return (
    <ul className="list-none flex flex-wrap items-center gap-[0.45rem] m-0 mb-[var(--space-4)] p-0">
      {items.map((item) => {
        const Icon = pickChipIcon(item.label);
        return (
          <li className={CHIP} key={item.label}>
            <Icon aria-hidden="true" strokeWidth={ICON_STROKE_WIDTH_REGULAR} />
            <span>{item.value}</span>
          </li>
        );
      })}
    </ul>
  );
}
