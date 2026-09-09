'use client';

import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { SUBHERO, SUBHERO_CONTENT, SUBHERO_TITLE, SUBHERO_TEXT } from '@/components/ui/subheroClasses';
import { GRID_SLIDER } from '@/components/ui/gridClasses';
import { useMemo, useState } from 'react';
import GuideCard from '@/components/cards/GuideCard';
import { GUIDE_HUB } from '@/content/shared/guide-hub';

// Tailwind-native (migrasi Fase 2): section kategori + nav container + menu dropdown.
// DIPERTAHANKAN CSS: .guide-cat-toggle (nempel ke shared .hs-chev, ada aria state) &
// .guide-cat__title (override shared .section__title -> kena source-order trap).
// Menu di-hide via atribut `hidden` (UA [hidden]{display:none}).
const GC_SECTION = 'mt-[2.4rem] [scroll-margin-top:80px]';
const GC_NAV = 'relative flex-[0_0_auto] flex order-2 [border-left:1px_solid_var(--line)]';
const GC_MENU = 'absolute right-0 top-[calc(100%_+_6px)] min-w-[220px] bg-white [border:1px_solid_var(--line)] rounded-md [box-shadow:0_16px_40px_rgba(31,61,43,0.14)] overflow-hidden z-20';
const GC_MENU_A = 'flex items-center gap-[0.6rem] py-[0.7rem] px-4 no-underline text-green font-semibold text-h3 [border-top:1px_solid_var(--line)] first:[border-top:none] hover:bg-[rgba(34,32,28,0.08)] [&_svg]:w-[var(--icon-sm)] [&_svg]:h-[var(--icon-sm)] [&_svg]:text-gold-d [&_svg]:shrink-0';

export default function GuideHub() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const cats = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return GUIDE_HUB.cats;
    return GUIDE_HUB.cats
      .map((c) => ({ ...c, cards: c.cards.filter((x) => x.title.toLowerCase().includes(term) || (x.kw || '').includes(term)) }))
      .filter((c) => c.cards.length);
  }, [q]);

  return (
    <>
      <section className={SUBHERO} style={{ backgroundImage: GUIDE_HUB.heroStyle.replace(/^background-image:\s*/, '').replace(/;$/, '') }}>
        <div className={SUBHERO_CONTENT}>
          <h1 className={SUBHERO_TITLE}>{GUIDE_HUB.title}</h1>
          <p className={SUBHERO_TEXT}>{GUIDE_HUB.text}</p>

          <div className="guide-hero-search">
            <div className={GC_NAV}>
              <button className="guide-cat-toggle" type="button" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
                <svg className="gcat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Categories</span>
                <svg className="hs-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={GC_MENU} hidden={!open}>
                {GUIDE_HUB.navItems.map((n) => (
                  <a className={GC_MENU_A} href={`#${n.id}`} key={n.id} onClick={() => setOpen(false)}>
                    <span dangerouslySetInnerHTML={{ __html: n.icon }} />
                    {n.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="gsearch guide-hero-search__field">
              <div className="gsearch__box flex items-center gap-[0.7rem] py-[0.85rem] px-[1.1rem] [border:1.5px_solid_var(--color-gold)] rounded-lg bg-white [box-shadow:var(--shadow-md)]">
                <svg className="w-[var(--icon-md)] h-[var(--icon-md)] shrink-0 text-gold-d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input type="text" className="flex-1 border-none border-current [outline:none] bg-transparent font-body text-field text-green placeholder:text-muted" placeholder="Search" aria-label="Search guides" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="gsearch__sug" role="listbox" hidden />
            </div>
          </div>
        </div>
      </section>

      <section className={GUIDE_HUB.wrapClass}>
        {cats.map((c) => (
          <div className={GC_SECTION} id={c.id} key={c.id}>
            <h2 className={`${SECTION_TITLE} !text-left !mb-[1.1rem]`}>{c.title}</h2>
            <div className={GRID_SLIDER}>
              {c.cards.map((card) => (
                <GuideCard key={card.href} href={card.href} img={card.img} alt={card.alt} title={card.title} tag={card.tag} cat={card.cat} w={card.w} hgt={card.hgt} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
