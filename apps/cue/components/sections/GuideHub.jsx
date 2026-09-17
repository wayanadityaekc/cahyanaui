'use client';

import clsx from 'clsx';
import { ChevronDown, Menu, Search } from 'lucide-react';
import { PopMenu, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { SUBHERO, SUBHERO_CONTENT, SUBHERO_TITLE, SUBHERO_TEXT } from '@/components/ui/subheroClasses';
import { GRID_GUIDEHUB } from '@/components/ui/gridClasses';
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
      <section className={SUBHERO} style={{ backgroundImage: GUIDE_HUB.heroStyle.replace(/^background-image:\s*/, '').replace(/;$/, ''), backgroundPosition: 'center 60%' }}>
        <div className={SUBHERO_CONTENT}>
          <h1 className={`${SUBHERO_TITLE} !text-white`}>{GUIDE_HUB.title}</h1>
          <p className={SUBHERO_TEXT}>{GUIDE_HUB.text}</p>

          <div className="flex items-stretch max-w-[640px] mt-6 mx-auto [border:1.5px_solid_var(--color-gold)] rounded-lg bg-white shadow-md">
            <div className={GC_NAV}>
              <button className="min-h-[3.15rem] box-border flex items-center gap-[0.35rem] px-[0.95rem] [border:none] [border-radius:0_var(--r-md)_var(--r-md)_0] bg-transparent font-body text-[1rem] font-semibold text-green cursor-pointer whitespace-nowrap [transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-[rgba(34,32,28,0.08)] [&_span]:hidden" type="button" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
                <Menu className="w-[var(--icon-md)] h-[var(--icon-md)]" aria-hidden="true" />
                <span>Categories</span>
                <ChevronDown
                  className={clsx('w-4 h-4 shrink-0 text-muted [transition:transform_var(--dur)_ease]', open && '[transform:rotate(180deg)]')}
                  aria-hidden="true"
                />
              </button>
              <PopMenu open={open}>
              <div className={GC_MENU}>
                {GUIDE_HUB.navItems.map((n) => (
                  <a className={GC_MENU_A} href={`#${n.id}`} key={n.id} onClick={() => setOpen(false)}>
                    <span><n.Icon strokeWidth={1.7} aria-hidden="true" /></span>
                    {n.label}
                  </a>
                ))}
              </div>
              </PopMenu>
            </div>
            <div className="relative flex-1 max-w-[560px] mt-6 mx-auto mb-0">
              <div className="flex items-center gap-[0.7rem] py-[0.85rem] px-[1.1rem] min-h-[var(--field-h)] box-border [border:none] rounded-none bg-transparent [box-shadow:none]">
                <Search className="w-[var(--icon-md)] h-[var(--icon-md)] shrink-0 text-gold-d" aria-hidden="true" />
                <input type="text" className="flex-1 border-none border-current [outline:none] bg-transparent font-body text-field text-green placeholder:text-muted" placeholder="Search" aria-label="Search guides" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white [border:1px_solid_var(--line)] rounded-lg [box-shadow:0_16px_40px_rgba(31,61,43,0.14)] overflow-hidden z-[6] [&[hidden]]:hidden" role="listbox" hidden />
            </div>
          </div>
        </div>
      </section>

      <section className={GUIDE_HUB.wrapClass}>
        {cats.map((c) => (
          <div className={GC_SECTION} id={c.id} key={c.id}>
            <h2 className={`${SECTION_TITLE} !text-left !mb-[1.1rem]`}>{c.title}</h2>
            <Stagger className={GRID_GUIDEHUB}>
              {c.cards.map((card, i) => (
                <StaggerItem key={card.href} index={i}>
                  <GuideCard href={card.href} img={card.img} alt={card.alt} title={card.title} tag={card.tag} cat={card.cat} w={card.w} hgt={card.hgt} overlayTag />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ))}
      </section>
    </>
  );
}
