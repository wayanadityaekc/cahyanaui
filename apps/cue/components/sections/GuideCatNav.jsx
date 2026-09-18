'use client';

import CatDropdown, { CAT_ITEM, CAT_ITEM_TAP } from '@/components/ui/CatDropdown';

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

  // Desktop: plain sticky list. border-l, where Our Company has border-r, because
  // this column sits to the RIGHT of the article - moving it left would push the
  // article's left edge off the tour pages' 48px, which the previous change was for.
  if (variant === 'desktop') {
    return (
      <nav
        className="max-[992px]:hidden flex flex-col gap-[var(--space-2)] sticky top-[calc(var(--header-h,104px)+var(--space-2))] self-start pl-[var(--space-3)] border-l border-line"
        aria-label="Guide categories"
      >
        {tabs.map((t) => (
          <a key={t.href} href={t.href} className={CAT_ITEM(t.active)} aria-current={t.active || undefined}>
            {t.label}
          </a>
        ))}
      </nav>
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
