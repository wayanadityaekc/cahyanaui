import { CHIP, chipIcon } from '@/components/ui/chipClasses';

// Detail facts as chips; each chip prints only the value (label picks the icon), so values must read alone.
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
