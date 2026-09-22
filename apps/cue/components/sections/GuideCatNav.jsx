'use client';

import CatDropdown, { CAT_ITEM_TAP } from '@/components/ui/CatDropdown';
import { RAIL_ASIDE, RAIL_STICK, RAIL_LABEL, railItem } from '@/components/ui/railClasses';

// Guide category nav, borrowed from Our Company (Sep 2026, Wayan: "taruh tab
// kategorinya seperti kategori di our company, kayaknya itu lebih masuk akal").
// Plain list on desktop; on mobile a single row showing the CURRENT category that
// expands the rest on tap.
//
// Why it beats the pill track it replaces: these five names are long ("About the
// Island", "People & Culture"). As equal segments they did not fit a 390px screen,
// so the row had to scroll sideways - and a category you cannot see is a category
// you will not use. Showing only the active one, with the rest one tap away, never
// clips at any width. It is also the same job Our Company's nav does (move between
// the sections of a set), where the tour pill track is a jump nav for four short
// in-page sections.
//
// These are LINKS to the guide hub's category anchors, not in-page panels, so the
// active item comes from the data rather than from click state.
//
// Rendered TWICE from GuideArticle with different variants, because the two forms
// belong in different columns: the desktop list sits in the side column beside the
// article, the mobile dropdown at the top of the article card itself.
export default function GuideCatNav({ tabs = [], variant = 'desktop' }) {
  if (!tabs.length) return null;
  const active = tabs.find((t) => t.active) || tabs[0];

  // Desktop: the SAME rail Our Company and My Trips use (Sep 2026, Wayan: "kita
  // udah punya side bar kategori yang kepakai di my trip dan our company, pakai
  // itu juga di page guide"). So it moves to the LEFT of the article and borrows
  // railItem/RAIL_STICK rather than drawing a second kind of side column.
  //
  // This overrides the older note that kept the column on the right to protect the
  // article's 48px left edge: Wayan asked for the shared rail, so the article now
  // starts beside it instead.
  if (variant === 'desktop') {
    return (
      <aside className={RAIL_ASIDE} aria-label="Guide categories">
        <div className={RAIL_STICK}>
          <p className={RAIL_LABEL}>Bali Guide</p>
          <nav className="flex flex-col">
            {tabs.map((t) => (
              <a
                key={t.href}
                href={t.href}
                className={`${railItem(t.active)} no-underline`}
                aria-current={t.active || undefined}
              >
                {t.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  // Mobile: the active category, tap to see the rest - the same control Our
  // Company uses, floating over the article rather than pushing it down.
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
