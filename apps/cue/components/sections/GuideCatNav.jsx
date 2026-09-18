'use client';

import { useState } from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { Collapse } from '@/components/ui/Reveal';

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
const ITEM = (active) =>
  `text-left font-body text-body no-underline ${active ? 'font-semibold text-gold' : 'text-muted'}`;

export default function GuideCatNav({ tabs = [], variant = 'desktop' }) {
  const [open, setOpen] = useState(false);
  if (!tabs.length) return null;
  const active = tabs.find((t) => t.active) || tabs[0];

  // Desktop: plain sticky list. border-l, where Our Company has border-r, because
  // this column sits to the RIGHT of the article - moving it left would push the
  // article's left edge off the tour pages' 48px, which the previous change was for.
  if (variant === 'desktop') {
    return (
      <nav
        className="max-[992px]:hidden flex flex-col gap-3 sticky top-[calc(var(--header-h,104px)+1rem)] self-start pl-6 border-l border-line"
        aria-label="Guide categories"
      >
        {tabs.map((t) => (
          <a key={t.href} href={t.href} className={ITEM(t.active)} aria-current={t.active || undefined}>
            {t.label}
          </a>
        ))}
      </nav>
    );
  }

  // Mobile: the active category, tap to see the rest. Icon = 2x2 grid (categories),
  // not the navbar's 3-line hamburger - same call Our Company made.
  return (
    <div className="min-[993px]:hidden w-full pb-3 mb-4 border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full gap-2 p-0 bg-transparent border-none cursor-pointer font-body text-body font-semibold text-gold"
      >
        <span className="flex items-center gap-[0.6rem]">
          <LayoutGrid className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
          {active.label}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-muted transition-[rotate] duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <Collapse open={open}>
        <div className="mt-3 gap-1 flex flex-col" aria-label="Guide categories">
          {tabs.map((t) => (
            <a key={t.href} href={t.href} className={`${ITEM(t.active)} py-[0.35rem]`} aria-current={t.active || undefined}>
              {t.label}
            </a>
          ))}
        </div>
      </Collapse>
    </div>
  );
}
