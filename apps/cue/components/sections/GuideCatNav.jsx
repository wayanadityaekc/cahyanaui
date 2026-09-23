'use client';

import CatDropdown, { CAT_ITEM_TAP } from '@/components/ui/CatDropdown';

// The guide categories on a PHONE: one row showing the current category, tap to
// see the rest. The same control Our Company uses, floating over the article
// rather than pushing it down.
//
// Why it beats the pill track it replaced: these five names are long ("About the
// Island", "People & Culture"). As equal segments they did not fit a 390px screen,
// so the row had to scroll sideways - and a category you cannot see is a category
// you will not use. Showing only the active one, with the rest one tap away, never
// clips at any width.
//
// THE DESKTOP LIST USED TO LIVE HERE TOO and no longer does (Sep 2026, Wayan:
// "reuse komponen container dan side bar di our company dan pakai container dan
// side bar di guide"). It was a second copy of the rail - its own <aside>, its own
// RAIL_STICK - so the two could drift even while sharing strings. The rail now
// comes from RailLayout, which takes these same tabs as link items; this file is
// only the phone control, passed to it as `mobileNav`.
//
// These are LINKS to the guide hub's category anchors, not in-page panels, so the
// active item comes from the data rather than from click state.
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
