'use client';

import CatDropdown, { CAT_ITEM_TAP } from '@/components/ui/CatDropdown';

export default function GuideCatNav({ tabs = [] }) {
  if (!tabs.length) return null;
  const active = tabs.find((tab) => tab.active) || tabs[0];

  return (
    <CatDropdown
      className="min-[993px]:hidden w-full pb-[var(--space-1)] mb-[var(--space-2)] border-b border-line"
      label={active.label}
      ariaLabel="Guide categories"
    >
      {(close) =>
        tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            onClick={close}
            className={CAT_ITEM_TAP(tab.active)}
            aria-current={tab.active || undefined}
          >
            {tab.label}
          </a>
        ))
      }
    </CatDropdown>
  );
}
