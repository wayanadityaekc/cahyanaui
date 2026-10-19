import { CHIP, chipIcon } from '@/components/ui/chipClasses';

export default function InfoFacts({ items }) {
  return (
    <ul className="list-none flex flex-wrap items-center gap-[0.45rem] m-0 mb-[var(--space-4)] p-0">
      {items.map((item) => {
        const Icon = chipIcon(item.label);
        return (
          <li className={CHIP} key={item.label}>
            <Icon aria-hidden="true" strokeWidth={1.7} />
            <span>{item.value}</span>
          </li>
        );
      })}
    </ul>
  );
}
