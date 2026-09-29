'use client';

import CatDropdown, { CAT_ITEM_TAP } from '@/components/ui/CatDropdown';

// Phone-only guide category dropdown (links to hub anchors), passed to RailLayout as mobileNav.
export default function GuideCatNav({ tabs = [] }) {
  if (!tabs.length) return null;
  const active = tabs.find((t) => t.active) || tabs[0];

  return (
    <CatDropdown
      className="min-[993px]:hidden w-full pb-[var(--space-1)] mb-[var(--space-2)] border-b border-line"
      label={active.label}
      ariaLabel="Guide categories"
    >
      {(close) =>
        tabs.map((t) => (
          <a
            key={t.href}
            href={t.href}
            onClick={close}
            className={CAT_ITEM_TAP(t.active)}
            aria-current={t.active || undefined}
          >
            {t.label}
          </a>
        ))
      }
    </CatDropdown>
  );
}
